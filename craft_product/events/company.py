import frappe
from frappe import _

def before_insert(doc, method):
    # Count how many Company docs already exist
    company_count = frappe.db.count("Company")
    max_companies = 2

    if company_count >= max_companies:
        frappe.throw(_("Cannot add more companies. Maximum {0} companies are allowed.").format(max_companies))
