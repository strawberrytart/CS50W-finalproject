from django.shortcuts import render, reverse
from .models import Checklist, Pump, Book, Baseplate, QualityCheck
from .forms import ChecklistForm, PumpForm, BookForm, PumpFormComplete, BaseplateForm, QualityCheckForm
from django.forms import modelformset_factory
from django.http import HttpResponseRedirect

# Create your views here.

def index(request):
    
    checklists = Checklist.objects.all().order_by("-dateCreated")

    return render(request, "checklist/index.html",{
        "checklists": checklists
    })

def checklist_detail(request, checklist_id):

    try: 
        checklist = Checklist.objects.get(id = checklist_id)

    except Checklist.DoesNotExist:
        checklist= None
    
    return render(request, "checklist/detail.html",{
        "checklist": checklist,
    })

            
def checklist_update(request, checklist_id):
    
    try: 
        checklist = Checklist.objects.get(id = checklist_id)
    except Checklist.DoesNotExist:
        checklist= None
    pumps = checklist.pumps.all()

    PumpFormSet = modelformset_factory(Pump, form = PumpForm, extra = 0)

    #Instantiate the form
    formset = PumpFormSet(queryset = pumps )
    form = ChecklistForm(instance = checklist) 
    
    #if form submitted
    if request.method == "POST":
        message = None
        try: 
            c = Checklist.objects.get(id = checklist_id)

        except Checklist.DoesNotExist:
            c= None
        else:
            pumps = c.pumps.all()
        
        form = ChecklistForm(request.POST, instance = c)
        sub_formset = PumpFormSet(request.POST, queryset = pumps)

        # if form.is_valid():
        #     form.save()
        #     message = "Data saved."
        if all([form.is_valid(), sub_formset.is_valid()]):
            checklist = form.save(commit = False)
            checklist.save()

            for pump in sub_formset:
                if pump.is_valid():
                    if pump.cleaned_data != {}:
                        print(pump.cleaned_data)
                        pump = pump.save(commit = False)
                        if pump.checklist is None:
                            pump.checklist = checklist 
                        pump.save()
                        message = "Data saved."
                 
        else:
            # If the form is invalid, re-render the page with existing information.
            print("form invalid")
            return render(request, "checklist/update.html", {
                "form": form,
                "formset": sub_formset,
                "checklist": checklist,
            })
        
        # if request.htmx:
        #     return render(request, "checklist/partials/forms.html",{
        #         "form": form,
        #         "formset":formset,
        #         "checklist": checklist,
        #         "message": message,
        #     })
        
    
    return render(request, "checklist/update.html",{
        "form": form,
        "formset":formset,
        "checklist": checklist,
    })


def checklist_updatev2(request, checklist_id):

    try:
        checklist = Checklist.objects.get(id = checklist_id)

    except Checklist.DoesNotExist:
        checklist = None
    else:
        pumps = checklist.pumps.all()


    form = ChecklistForm(instance = checklist) 
    PumpFormSet = modelformset_factory(Pump, form = PumpForm, extra = 0)
 
    formset = PumpFormSet(queryset = Pump.objects.none())

    if request.method == "POST":
        print(request.POST)
        try: 
            c = Checklist.objects.get(id = checklist_id)

        except Checklist.DoesNotExist:
            c= None

        else:
            pumps = c.pumps.all()
            
        form = ChecklistForm(request.POST, instance = c)
        formset = PumpFormSet(request.POST, queryset = pumps)

        if all([form.is_valid(), formset.is_valid()]):
            checklist = form.save(commit = False)
            checklist.save()

            for pump in formset:
                if pump.is_valid():
                    if pump.cleaned_data !={}:
                        print(pump.cleaned_data)
                        pump = pump.save(commit = False)
                        if pump.checklist is None:
                            pump.checklist = checklist 
                        pump.save()
            
            return HttpResponseRedirect(reverse('checklist_updatev2', args=[checklist.id,]))

        else:
            return render(request, "checklist/updatev2.html",{
                "form": form,
                "formset": formset,
                "checklist": checklist,
                "pumps":pumps,
            })

    return render(request, "checklist/updatev2.html",{
        "form": form,
        "checklist": checklist,
        "pumps":pumps,
        "formset": formset,
    })




def create(request):
    PumpFormSet = modelformset_factory(Pump, form = PumpForm, extra = 1)
    
    formset = PumpFormSet(queryset= Pump.objects.none())
    #instantiate empty form
    form = ChecklistForm()

    if request.method == "POST":
        form = ChecklistForm(request.POST)
        sub_formset = PumpFormSet(request.POST)
        print(sub_formset)
        if all([form.is_valid(), sub_formset.is_valid()]):
            #Saves the form data into a new 'Checklist' object without committing it to database yet, allowing for further modifications
            checklist = form.save(commit = False)
            checklist.save()
            print(checklist)

            for pump in sub_formset:
                if pump.is_valid():
                    print("Pump is valid")
                    if pump.cleaned_data !={}:
                        pump = pump.save(commit=False)
                        pump.checklist = checklist
                        pump.save()
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "checklist/create.html",{
                "form": form,
                "formset": sub_formset,
            })
        
    return render(request, "checklist/create.html",{
        "form": form,
        "formset": formset,
    })


def book(request):

    BookFormSet = modelformset_factory(Book,form = BookForm, extra = 1)
    formset = BookFormSet()
    return render(request, "checklist/books.html", {
        "formset": formset,
    })

def edit_pump(request, pump_id):

    pump = Pump.objects.get(id = pump_id)

    pumpform = PumpFormComplete(instance = pump)
    
    #BaseplateFormSet = modelformset_factory(Baseplate , form = BaseplateForm, extra=0)
    #formset = BaseplateFormSet()

    baseplateform = BaseplateForm()
    qualitycheckform = QualityCheckForm()
    try:
        baseplate = pump.baseplate
    except Baseplate.DoesNotExist:
        print("Pump has no baseplate")
    else:
        baseplateform = BaseplateForm(instance = baseplate)
        #formset = BaseplateFormSet(queryset=baseplate)

    try:
        qualitycheck = pump.qualitycheck
    except QualityCheck.DoesNotExist:
        print("Pump has not passed quality check.")
    else:
        qualitycheckform = QualityCheckForm(instance = qualitycheck)

    #if form is submitted
    if request.method == "POST":

        p = Pump.objects.get(id = pump_id)

        pumpform = PumpFormComplete(request.POST, instance = p)
        
        try: 
            b = p.baseplate
        except Baseplate.DoesNotExist:
            baseplateform = BaseplateForm(request.POST)
        else:
            baseplateform = BaseplateForm(request.POST, instance = b)

        try: 
            q = p.qualitycheck
        
        except QualityCheck.DoesNotExist:
            qualitycheckform = QualityCheckForm(request.POST)
        else:
            qualitycheckform = QualityCheckForm(request.POST, instance = q)

        if all([pumpform.is_valid(),baseplateform.is_valid(), qualitycheckform.is_valid()]):
            print("All forms are valid")
            pump = pumpform.save(commit = False)
            pump.save()
            print("successfully saved pump")

            baseplate = baseplateform.save(commit = False)
            baseplate.pump = pump
            baseplate.save()
            print("successfully saved baseplate")
            qc = qualitycheckform.save(commit = False)
            qc.pump = pump
            qc.save()
            print("successfully saved qcform")

            return HttpResponseRedirect(reverse('editpump', args=[pump.id,]))
        else:

            return render(request,"checklist/pump.html",{
                "pump": pump,
                "pumpform": pumpform,
                "baseplateform": baseplateform,
                "qualitycheckform": qualitycheckform,
            })
    return render(request, "checklist/pump.html",{
        "pump": pump,
        "pumpform": pumpform,
        "baseplateform": baseplateform,
        "qualitycheckform": qualitycheckform,
    })


def delete_pump(request, pump_id):

    try:
        pump = Pump.objects.get(id = pump_id)
    
    except Pump.DoesNotExist:
        pump = None

        return render(request, "checklist/error.html")


    if request.method == "POST":
        pump = Pump.objects.get(id = pump_id)
        checklist_id = pump.checklist.id
        pump.delete()

        return HttpResponseRedirect(reverse('checklist_updatev2', args=[checklist_id,]))


    return render(request, "checklist/delete.html",{
        "pump":pump,
    })


def allpumpsview(request):

    pumps = Pump.objects.all()

    return render(request, "checklist/allpump.html",{
        "pumps": pumps
    })


def delete_pump(request, pump_id):
    try:
        pump = Pump.objects.get(id = pump_id)
    
    except Pump.DoesNotExist:
        pump = None

        return render(request, "checklist/error.html")
    if request.method == "POST":
        pump = Pump.objects.get(id = pump_id)
        checklist_id = pump.checklist.id
        pump.delete()

        return HttpResponseRedirect(reverse('checklist_updatev2', args=[checklist_id,]))
    return render(request, "checklist/partials/deletepumpform.html",{
        "pump":pump,
    })


def editpumpinline(request,pump_id): 
    context = None 
    try:
        pump = Pump.objects.get(id= pump_id)
    except Pump.DoesNotExist:
        pump = None
    
    baseplateform = BaseplateForm()
    qualitycheckform = QualityCheckForm()

    try:
        baseplate = pump.baseplate
    except Baseplate.DoesNotExist:
        baseplate = None
    else:
        baseplateform = BaseplateForm(instance = baseplate)
        #formset = BaseplateFormSet(queryset=baseplate)

    try:
        qualitycheck = pump.qualitycheck
    except QualityCheck.DoesNotExist:
        qualitycheck = None
    else:
        qualitycheckform = QualityCheckForm(instance = qualitycheck)


    context = {"form": PumpForm(instance = pump),
               "pump" : pump,
               "baseplateform": baseplateform,
               "qualitycheckform" : qualitycheckform }
    
    if request.method == "POST":
        try:
            pump = Pump.objects.get(id = pump_id)
        except Pump.DoesNotExist:
            pump = None
        
        form = PumpForm(request.POST, instance = pump)

        try:
            b = pump.baseplate
        except Baseplate.DoesNotExist:
            baseplateform = BaseplateForm(request.POST)
        else:
            baseplateform = BaseplateForm(request.POST, instance = b)
        
        try: 
            q = pump.qualitycheck
        
        except QualityCheck.DoesNotExist:
            qualitycheckform = QualityCheckForm(request.POST)
        
        else:
            qualitycheckform = QualityCheckForm(request.POST, instance = q)
        
        
        # Manually set some invalid data on the form fields for testing
        if all([form.is_valid(), baseplateform.is_valid(), qualitycheckform.is_valid()]):
            pump = form.save()

            baseplate = baseplateform.save(commit = False)
            baseplate.pump = pump
            baseplate.save()

            qc = qualitycheckform.save(commit = False)
            qc.pump = pump
            qc.save()

            return render(request, "checklist/partials/pump_inline.html", {
                "pump": pump
            })
        else:
            context = {
                "form": form,
                "pump": pump,
                "baseplateform": baseplateform,
                "qualitycheckform": qualitycheckform,
            }
    return render(request, "checklist/partials/pumpinlineform.html", context)



def payment_method_ajax(request, method):  # method is your slug
    """Load a dynamic form based on the desired payment method"""

    pump = Pump.objects.get(id = 133)
    options = {
        'ach': PumpForm(instance = pump),  # Dynamic form #1
        'credit-card': ChecklistForm(),  #  Dynamic form #2
    }

    if method in options.keys():
        context = {'form': options[method]}
    else:
        context = None

    template = 'checklist/partials/form_from_ajax.html'
    return render(request, template, context)


def main_ajax(request):

    context = {
        'target': 'Add a New Payment Method',
        'h1': 'Add a New Payment Method',
        'ach': 'Save an ACH Profile',
        'credit_card': 'Save a Credit Card Profile',
        'slugs': ['ach', 'credit-card'],  # Here are the slugs ****
    }

    return render(request,"checklist/ajax_form.html", context)
