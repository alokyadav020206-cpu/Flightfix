from django.conf import settings
from django.db import models, transaction
from django.utils import timezone

from aircraft.models import Aircraft
from inventory.models import SparePart
from technicians.models import Technician


class MaintenanceSchedule(models.Model):
    class Type(models.TextChoices):
        ROUTINE = "ROUTINE", "Routine"
        INSPECTION = "INSPECTION", "Inspection"
        A_CHECK = "A_CHECK", "A-Check"
        B_CHECK = "B_CHECK", "B-Check"
        C_CHECK = "C_CHECK", "C-Check"
        D_CHECK = "D_CHECK", "D-Check"

    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        DONE = "DONE", "Done"
        OVERDUE = "OVERDUE", "Overdue"
        CANCELLED = "CANCELLED", "Cancelled"

    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name="schedules")
    title = models.CharField(max_length=150)
    maintenance_type = models.CharField(max_length=20, choices=Type.choices, default=Type.ROUTINE)
    scheduled_date = models.DateField()
    interval_days = models.PositiveIntegerField(null=True, blank=True,
                                                help_text="Repeat every N days (optional)")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["scheduled_date"]

    def __str__(self):
        return f"{self.aircraft.registration_number} - {self.title} ({self.scheduled_date})"


class WorkOrder(models.Model):
    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"
        CRITICAL = "CRITICAL", "Critical"

    class Status(models.TextChoices):
        OPEN = "OPEN", "Open"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    order_number = models.CharField(max_length=20, unique=True, null=True, blank=True, editable=False)
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name="work_orders")
    schedule = models.ForeignKey(MaintenanceSchedule, null=True, blank=True,
                                 on_delete=models.SET_NULL, related_name="work_orders")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    assigned_technicians = models.ManyToManyField(Technician, blank=True, related_name="work_orders")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True,
                                   on_delete=models.SET_NULL, related_name="created_work_orders")
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    estimated_hours = models.DecimalField(max_digits=6, decimal_places=1, default=0)
    actual_hours = models.DecimalField(max_digits=6, decimal_places=1, default=0)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_number or 'WO'} - {self.title}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if self.status == self.Status.COMPLETED and not self.completed_at:
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)

        if is_new and not self.order_number:
            self.order_number = f"WO-{self.pk:05d}"
            WorkOrder.objects.filter(pk=self.pk).update(order_number=self.order_number)

        if self.status == self.Status.COMPLETED:
            MaintenanceHistory.objects.get_or_create(
                work_order=self,
                defaults={
                    "aircraft": self.aircraft,
                    "summary": self.title,
                    "completed_on": self.completed_at.date(),
                    "hours_spent": self.actual_hours,
                },
            )
            Aircraft.objects.filter(pk=self.aircraft_id).update(
                last_maintenance_date=self.completed_at.date(),
                status=Aircraft.Status.ACTIVE,
            )
            if self.schedule_id:
                MaintenanceSchedule.objects.filter(pk=self.schedule_id).update(
                    status=MaintenanceSchedule.Status.DONE)
        elif self.status == self.Status.IN_PROGRESS:
            Aircraft.objects.filter(pk=self.aircraft_id).update(
                status=Aircraft.Status.IN_MAINTENANCE)


class WorkOrderPart(models.Model):
    """Spare parts used on a work order. Stock is deducted when a row is created."""
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name="parts_used")
    spare_part = models.ForeignKey(SparePart, on_delete=models.PROTECT, related_name="usages")
    quantity = models.PositiveIntegerField(default=1)

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if self._state.adding:
                part = SparePart.objects.select_for_update().get(pk=self.spare_part_id)
                part.quantity_in_stock = max(part.quantity_in_stock - self.quantity, 0)
                part.save(update_fields=["quantity_in_stock", "updated_at"])
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        with transaction.atomic():
            part = SparePart.objects.select_for_update().get(pk=self.spare_part_id)
            part.quantity_in_stock += self.quantity
            part.save(update_fields=["quantity_in_stock", "updated_at"])
            return super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.spare_part.name}"


class MaintenanceTask(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name="tasks")
    description = models.CharField(max_length=255)
    technician = models.ForeignKey(Technician, null=True, blank=True,
                                   on_delete=models.SET_NULL, related_name="tasks")
    is_done = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["id"]

    def save(self, *args, **kwargs):
        if self.is_done and not self.completed_at:
            self.completed_at = timezone.now()
        elif not self.is_done:
            self.completed_at = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.description


class MaintenanceHistory(models.Model):
    """Auto-created when a work order is completed."""
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name="history")
    work_order = models.OneToOneField(WorkOrder, on_delete=models.CASCADE, related_name="history")
    summary = models.CharField(max_length=255)
    completed_on = models.DateField()
    hours_spent = models.DecimalField(max_digits=6, decimal_places=1, default=0)

    class Meta:
        ordering = ["-completed_on"]
        verbose_name_plural = "maintenance history"

    def __str__(self):
        return f"{self.aircraft.registration_number} - {self.summary}"
