from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create the Admin / Manager / Technician groups"

    def handle(self, *args, **options):
        for name in ("Admin", "Manager", "Technician"):
            _, created = Group.objects.get_or_create(name=name)
            self.stdout.write(f"{'Created' if created else 'Exists '}: {name}")
