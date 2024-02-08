from django.contrib import admin
from .models import Checklist, Pump, Baseplate, QualityCheck, Motor
# Register your models here.


class PumpInline(admin.StackedInline):
    model = Pump

class BaseplateInline(admin.StackedInline):
    model = Baseplate

class QualityCheckInline(admin.StackedInline):
    model = QualityCheck

class MotorAdmin(admin.ModelAdmin):
    exclude = []

class ChecklistAdmin(admin.ModelAdmin):
    list_display =["customer", "salesOrder", "deliveryOrder", "customerPO"]
    inlines = [
        PumpInline,
    ]

class BaseplateAdmin(admin.ModelAdmin):
    list_display = ["dimension_A", "dimension_B", "dimension_C"]

class PumpAdmin(admin.ModelAdmin):
    list_display = ["serialnumber", "model"]
    inlines = [
        BaseplateInline,
        QualityCheckInline,
    ]

admin.site.register(Checklist,ChecklistAdmin)
admin.site.register(Pump, PumpAdmin)
admin.site.register(Baseplate, BaseplateAdmin)
admin.site.register(Motor,MotorAdmin)