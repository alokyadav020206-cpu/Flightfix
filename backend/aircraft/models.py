from django.db import models


class Aircraft(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        IN_MAINTENANCE = "IN_MAINTENANCE", "In Maintenance"
        GROUNDED = "GROUNDED", "Grounded"
        RETIRED = "RETIRED", "Retired"

    registration_number = models.CharField(max_length=20, unique=True)
    model = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=50, unique=True)
    year_manufactured = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    total_flight_hours = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    last_maintenance_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["registration_number"]
        verbose_name_plural = "aircraft"

    def __str__(self):
        return f"{self.registration_number} ({self.model})"
