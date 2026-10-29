from rest_framework.permissions import SAFE_METHODS, BasePermission

ROLES = ("Admin", "Manager", "Technician")


def get_role(user):
    """Return 'Admin', 'Manager', 'Technician' or None."""
    if not user or not user.is_authenticated:
        return None
    if user.is_superuser:
        return "Admin"
    names = set(user.groups.values_list("name", flat=True))
    for role in ROLES:
        if role in names:
            return role
    return None


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return get_role(request.user) == "Admin"


class ReadAnyWriteManagerUp(BasePermission):
    """Any logged-in role can read; only Admin/Manager can create/edit/delete."""

    def has_permission(self, request, view):
        role = get_role(request.user)
        if role is None:
            return False
        if request.method in SAFE_METHODS:
            return True
        return role in ("Admin", "Manager")
