from rest_framework.permissions import SAFE_METHODS, BasePermission

from accounts.permissions import get_role

TECH_ALLOWED_ACTIONS = {"start", "complete", "partial_update"}


class WorkOrderPermission(BasePermission):
    """
    Admin/Manager: full access.
    Technician: read everything; may only start/complete/update status of
    work orders (and tick tasks) they are assigned to.
    """

    def has_permission(self, request, view):
        role = get_role(request.user)
        if role is None:
            return False
        if request.method in SAFE_METHODS or role in ("Admin", "Manager"):
            return True
        return role == "Technician" and getattr(view, "action", None) in TECH_ALLOWED_ACTIONS

    def has_object_permission(self, request, view, obj):
        role = get_role(request.user)
        if request.method in SAFE_METHODS or role in ("Admin", "Manager"):
            return True
        work_order = getattr(obj, "work_order", obj)
        return work_order.assigned_technicians.filter(user=request.user).exists()
