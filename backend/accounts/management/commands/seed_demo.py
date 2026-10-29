from datetime import date, timedelta

from django.contrib.auth.models import Group, User
from django.core.management import call_command
from django.core.management.base import BaseCommand

from aircraft.models import Aircraft
from inventory.models import SparePart
from maintenance.models import MaintenanceSchedule
from technicians.models import Technician


class Command(BaseCommand):
    help = "Create roles, demo users, and sample aircraft / parts / technicians / schedules"

    def handle(self, *args, **options):
        call_command("setup_roles")

        users = [
            ("admin", "admin123", "Admin", True),
            ("manager", "manager123", "Manager", False),
            ("tech1", "tech123", "Technician", False),
            ("tech2", "tech123", "Technician", False),
        ]
        created_users = {}
        for username, pwd, role, is_super in users:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={"email": f"{username}@flightfix.local",
                          "is_staff": is_super, "is_superuser": is_super},
            )
            if created:
                user.set_password(pwd)
                user.save()
            user.groups.set(Group.objects.filter(name=role))
            created_users[username] = user

        for i, (u, name, spec) in enumerate([
            ("tech1", "Rahul Sharma", "Avionics"),
            ("tech2", "Priya Singh", "Engines"),
        ], start=1):
            Technician.objects.get_or_create(
                employee_id=f"EMP{i:03d}",
                defaults={"user": created_users[u], "name": name,
                          "specialization": spec, "phone": f"98000000{i:02d}",
                          "email": f"{u}@flightfix.local"},
            )

        planes = [
            ("VT-ABC", "Airbus A320", "Airbus", "SN1001", 2016, 18450),
            ("VT-DEF", "Boeing 737-800", "Boeing", "SN1002", 2014, 26300),
            ("VT-GHI", "ATR 72-600", "ATR", "SN1003", 2019, 9800),
        ]
        for reg, model, maker, sn, year, hours in planes:
            ac, _ = Aircraft.objects.get_or_create(
                registration_number=reg,
                defaults={"model": model, "manufacturer": maker, "serial_number": sn,
                          "year_manufactured": year, "total_flight_hours": hours},
            )
            MaintenanceSchedule.objects.get_or_create(
                aircraft=ac, title="A-Check",
                defaults={"maintenance_type": "A_CHECK",
                          "scheduled_date": date.today() + timedelta(days=14),
                          "interval_days": 90},
            )

        for pn, name, cat, qty, reorder, price in [
            ("PN-1001", "Hydraulic Pump", "Hydraulics", 12, 5, 1850.00),
            ("PN-1002", "Landing Gear Bolt", "Landing Gear", 3, 10, 45.50),
            ("PN-1003", "Fuel Filter", "Fuel System", 40, 15, 120.00),
        ]:
            SparePart.objects.get_or_create(
                part_number=pn,
                defaults={"name": name, "category": cat, "quantity_in_stock": qty,
                          "reorder_level": reorder, "unit_price": price},
            )

        self.stdout.write(self.style.SUCCESS(
            "Demo data ready. Logins: admin/admin123, manager/manager123, tech1/tech123"))
