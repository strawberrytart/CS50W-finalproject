from django.contrib import admin
from .models import Checklist, Pump
# Register your models here.

class PumpAdmin(admin.ModelAdmin):
    list_display = ["serialnumber", "model"]

class PumpInline(admin.StackedInline):
    model = Pump

class ChecklistAdmin(admin.ModelAdmin):
    list_display =["customer", "salesOrder", "deliveryOrder", "customerPO"]
    inlines = [
        PumpInline,
    ]

admin.site.register(Checklist,ChecklistAdmin)
admin.site.register(Pump, PumpAdmin)