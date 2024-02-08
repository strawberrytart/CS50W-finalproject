from django.db import models

# Create your models here.
class Motor(models.Model):
    rating = models.CharField(max_length = 10)
    pole = models.CharField(max_length = 10)
    voltage = models.CharField(max_length = 10)

    def __str__(self):
        return f"{self.rating} kW - {self.pole}P"
    

class Checklist(models.Model):
    dateCreated = models.DateTimeField(auto_now_add = True)
    dateEdited = models.DateTimeField(auto_now = True)
    customer = models.CharField(max_length = 20)
    salesOrder = models.CharField(max_length = 20)
    deliveryOrder = models.CharField(max_length = 20)
    customerPO = models.CharField(max_length = 20)
    remarks = models.TextField(max_length = 300, blank = True)

    def __str__(self):
        return f"{self.salesOrder}"
    


class Pump(models.Model):
    serialnumber = models.CharField(max_length = 20, null=True, blank = True)
    model = models.CharField(max_length = 20)
    has_motor = models.BooleanField(default = False)
    motor = models.ForeignKey(Motor, on_delete = models.SET_NULL, blank = True, null = True)
    shipmentBatch = models.CharField(max_length = 20, null=True, blank = True)
    checklist = models.ForeignKey(Checklist, on_delete = models.CASCADE, null = True, blank = True, related_name = "pumps")

class QualityCheck(models.Model):
    canShaftBeTurnedByHand = models.BooleanField()
    isTheYellowShaftCoverInstalled = models.BooleanField()
    isTheWireMeshProvided = models.BooleanField()
    inletCover = models.BooleanField()
    catalogProvided = models.BooleanField()
    pump = models.OneToOneField(Pump, on_delete = models.CASCADE, null = True, blank = True, related_name = "qualitycheck")

    def __str__(self):

        return f"{self.canShaftBeTurnedByHand} - {self.isTheYellowShaftCoverInstalled} - {self. isTheWireMeshProvided}"

class Impeller(models.Model):
    size =  models.CharField(max_length = 10, blank = True, null = True)
    quantity = models.PositiveIntegerField(blank = True, null = True)
    pump = models.ForeignKey(Pump, on_delete = models.CASCADE)
    

    def __str__(self):
        return f"{self.size} x {self.quantity}"
    
class Baseplate(models.Model):
    dimension_A = models.DecimalField(max_digits = 10, decimal_places = 2)
    dimension_B = models.DecimalField(max_digits = 10, decimal_places = 2)
    dimension_C = models.DecimalField(max_digits = 10, decimal_places = 2)
    pump = models.OneToOneField(Pump, on_delete = models.CASCADE, blank = True, null = True, related_name = "baseplate")
    
    UNITS = {
        "mm":"millimeters",
        "cm":"centimeters",
        "in": "inches",
    }

    unit = models.CharField(max_length = 10, blank = True, null = True, choices = UNITS)

    def __str__(self):
        return f"{self.dimension_A}{self.unit} x {self.dimension_B}{self.unit} x {self.dimension_C}{self.unit}"
    
    
class Book(models.Model):

    name = models.CharField(max_length=255)
    isbn_number = models.CharField(max_length=13)

    class Meta:
        db_table = 'book'

    def __str__(self):
        return self.name