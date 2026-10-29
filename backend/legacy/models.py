from django.db import models


class MaintenanceDataset(models.Model):
    record_id = models.IntegerField(primary_key=True)
    aircraft_code = models.CharField(max_length=20, blank=True, null=True)
    model = models.CharField(max_length=50, blank=True, null=True)
    maintenance_type = models.CharField(max_length=60, blank=True, null=True)
    technician = models.CharField(max_length=30, blank=True, null=True)
    priority = models.CharField(max_length=8, blank=True, null=True)
    status = models.CharField(max_length=11, blank=True, null=True)
    flight_hours = models.DecimalField(max_digits=10, decimal_places=1, blank=True, null=True)
    part_no = models.CharField(max_length=10, blank=True, null=True)
    quantity_used = models.IntegerField(blank=True, null=True)
    cost = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    maintenance_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'maintenance_dataset'

    def __str__(self):
        return f"{self.aircraft_code} - {self.maintenance_type} ({self.maintenance_date})"
