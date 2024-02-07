from django.shortcuts import render, reverse
from .models import Checklist, Pump, Book
from .forms import ChecklistForm, PumpForm, BookForm
from django.forms import modelformset_factory, inlineformset_factory
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

    PumpFormSet = modelformset_factory(Pump, form = PumpForm, extra = 1)

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
                "formset": formset,
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