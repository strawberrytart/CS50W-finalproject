from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("details/<int:checklist_id>", views.checklist_detail, name = "checklist_detail"),
    path("update/<int:checklist_id>", views.checklist_update, name="checklist_update"),
    path("create", views.create, name ="checklist_create"),
    path("books",views.book, name="book"),

]