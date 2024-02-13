from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("details/<int:checklist_id>", views.checklist_detail, name = "checklist_detail"),
    path("update/<int:checklist_id>", views.checklist_update, name="checklist_update"),
    path("create", views.create, name ="checklist_create"),
    path("books",views.book, name="book"),
    path("updatev2/<int:checklist_id>",views.checklist_updatev2, name="checklist_updatev2"),
    path("editpump/<int:pump_id>", views.edit_pump, name="editpump"),
    path("delete/<int:pump_id>", views.delete_pump, name="deletepump"),
    path("allpumpsview", views.allpumpsview, name="allpumpsview"),
    path("editpumpinline/<int:pump_id>", views.editpumpinline, name="editpumpinline"),
    path("payment-method-ajax/<slug:method>", views.payment_method_ajax, name="payment-method-ajax"),
    path("main", views.main_ajax, name="main_ajax"),
]