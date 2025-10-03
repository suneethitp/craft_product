frappe.ui.form.on('Account', {
    onload: function(frm) {
        frappe.router.on('change', () => {
            const route = frappe.get_route().join('/');
            
       
            if (route === 'home') {
                frappe.set_route('Account', frm.doc.name);
            }
        });
    }
});

