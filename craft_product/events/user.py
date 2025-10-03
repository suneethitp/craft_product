import frappe
from frappe import _

def before_insert(doc, method):
    user_count = frappe.db.count("User", {"enabled": 1})
    max_users = 10
    if user_count >= max_users:
        frappe.throw(_("Cannot add more users. Maximum {0} users are allowed.").format(max_users))
