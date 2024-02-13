from django import forms
from .models import Checklist, Pump, Book, Baseplate, QualityCheck
from django.forms import ModelForm, inlineformset_factory, BaseFormSet


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

class PumpFormComplete(ModelForm):
    class Meta:
        model = Pump
        fields = ['serialnumber','model','has_motor','shipmentBatch', 'motor']

        # widgets = {
        #     "serialnumber": forms.TextInput(attrs={"required":True}),
        #     "model": forms.TextInput(attrs={"required":True}),
        #     "shipmentBatch": forms.TextInput(attrs={"required":True}),
        # }

        widgets = {
            "serialnumber" : forms.TextInput(attrs = {"class": "form-control"}),
            "model": forms.TextInput(attrs={"class":"form-control"}),
            "shipmentBatch": forms.TextInput(attrs={"class":"form-control"}),
            "motor": forms.Select(attrs={"class":"form-control"}),
        }


class BookForm(ModelForm):
    class Meta:
        model = Book

        fields = ["name"]

        widgets = {
            "name" : forms.TextInput(attrs={"class":"form-control", "placeholder": "Enter Book Name Here"},)
        }


class BaseplateForm(ModelForm):
    class Meta:
        model = Baseplate

        fields = ["dimension_A", "dimension_B", "dimension_C", "unit"]

        
        widgets = {
            "dimension_A" : forms.TextInput(attrs = {"class": "form-control"}),
            "dimension_B" : forms.TextInput(attrs = {"class": "form-control"}),
            "dimension_C": forms.TextInput(attrs = {"class": "form-control"}),
            "unit": forms.Select(attrs = {"class": "form-control"}),
        }

class QualityCheckForm(ModelForm):
    class Meta:
        model = QualityCheck

        exclude = ["pump"]

        widgets = {
            "canShaftBeTurnedByHand" : forms.CheckboxInput(attrs={"class" : "form-check-input"}),
            "isTheYellowShaftCoverInstalled": forms.CheckboxInput(attrs={"class" : "form-check-input"}),
            "inletCover": forms.CheckboxInput(attrs={"class" : "form-check-input"}),
            "catalogProvided": forms.CheckboxInput(attrs={"class" : "form-check-input"}),

        }


