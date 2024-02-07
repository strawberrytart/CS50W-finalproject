from django import forms
from .models import Checklist, Pump, Book
from django.forms import ModelForm


class ChecklistForm(ModelForm):
    class Meta:
        model = Checklist
        fields = ['customer','salesOrder','deliveryOrder','customerPO', 'remarks']

        widgets = {
            "customer": forms.TextInput(attrs={"class":"form-control"}),
            "salesOrder": forms.TextInput(attrs={"class":"form-control"}),
            "deliveryOrder": forms.TextInput(attrs={"class":"form-control"}),
            "customerPO": forms.TextInput(attrs={"class":"form-control"}),
            "remarks" : forms.Textarea(attrs={"rows": 3, "class":"form-control"}),
        }
        
        labels = {
            "customer": "Customer",
            "salesOrder": "Sales Order",
            "deliveryOrder": "Delivery Order",
            "customerPO": "Customer Purchase Order"
        }


class PumpForm(ModelForm):
    class Meta:
        model = Pump
        fields = ['serialnumber','model','has_motor','shipmentBatch']

        # widgets = {
        #     "serialnumber": forms.TextInput(attrs={"required":True}),
        #     "model": forms.TextInput(attrs={"required":True}),
        #     "shipmentBatch": forms.TextInput(attrs={"required":True}),
        # }


class BookForm(ModelForm):
    class Meta:
        model = Book

        fields = ["name"]

        widgets = {
            "name" : forms.TextInput(attrs={"class":"form-control", "placeholder": "Enter Book Name Here"},)
        }