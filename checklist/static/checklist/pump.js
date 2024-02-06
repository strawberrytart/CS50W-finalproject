document.addEventListener("DOMContentLoaded", function(){   

    // document.querySelector("#id_form-__prefix__-serialnumber").required = false
    // document.querySelector("#id_form-__prefix__-model").required = false
    // document.querySelector("#id_form-__prefix__-shipmentBatch").required = false
    // document.querySelector("#id_form-__prefix__-has_motor").required = false
    document.addEventListener('click', function(event){
       if (event.target.id == 'add-more'){
            addNewForm()
        }
    })
})

function addNewForm(){
    const emptyForm = document.querySelector("#empty-form").cloneNode(true)
    const totalNewForms = document.querySelector("#id_form-TOTAL_FORMS")
    const IngredientFormsLength = document.querySelectorAll(".pump-form").length
    const currentFormCount = IngredientFormsLength
    console.log(currentFormCount)
    emptyForm.setAttribute('class','pump-form')
    emptyForm.setAttribute('id', `form-${currentFormCount}`)
    const regex = new RegExp('__prefix__', 'g')
    emptyForm.innerHTML = emptyForm.innerHTML.replace(regex, currentFormCount)
    emptyForm.style.display = "flex"
    totalNewForms.setAttribute('value', currentFormCount+1)
    const formList = document.querySelector(".pump-form-list")
    // emptyForm.querySelector("input").required = true
    formList.append(emptyForm)
}