document.addEventListener("DOMContentLoaded", function(){   
    document.addEventListener('click', function(event){
       if (event.target.id == 'add-more'){
            addNewForm()
        }
    })

    
    document.querySelectorAll(".edit-pump-button").forEach(function(button){
        button.addEventListener('click', function(){
            editpumpinline(button)
        });
    });

    document.querySelectorAll(".delete-pump-button").forEach(function(button){
        button.addEventListener('click', function(){
            loadDeletePumpForm(button)
            // pumpId = button.dataset.id
            // console.log(pumpId)
            // pumpModel = button.parentElement.querySelector('.card-title').innerText
            // pumpSerialNumber = button.parentElement.querySelector('.pump_serialnumber').innerText
            
            // form = document.querySelector('#deletePumpModal').querySelector('#deletePumpForm');
            // confirmationMessage = document.createElement('p');
            // confirmationMessage.textContent = 'Are you sure you want to delete ' + pumpModel + ' - ' + pumpSerialNumber + '?';
            // form.appendChild = confirmationMessage

        })
    })
});



function loadDeletePumpForm(btn){
    pumpId = btn.dataset.id
    console.log(pumpId)
    fetch(`/delete/${pumpId}`,{
        method: 'GET',
    })
    .then(response => response.text())
    .then(function(data){
        console.log(data)
        pumpModal = document.querySelector('#deletePumpModal')
        modalBody = pumpModal.querySelector('.modal-body')
        modalBody.innerHTML = data

    })
    .catch(error => {
        console.error('Error:', error);
    });
}





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
    emptyForm.querySelector("#remove-button").addEventListener('click', function(){
        console.log(this.parentElement)
        removeForm(this.parentElement)
    })
    formList.append(emptyForm)
}

function removeForm(formToRemove){
    // Remove the form from the DOM
    formToRemove.remove()

    //Update the total forms count
    const totalNewForms = document.querySelector("#id_form-TOTAL_FORMS")
    const IngredientFormsLength = document.querySelectorAll(".pump-form").length
    const currentFormCount = IngredientFormsLength
    console.log(currentFormCount)
    totalNewForms.value = currentFormCount

    //Update the indexes of the remaining forms

    //Get the outer div container that holds the form
    const formList = document.querySelector(".pump-form-list");

    //Get the div container that holds the forms
    const remainingForms = formList.querySelectorAll(".pump-form");

    //Loop over each form in the remainingForms nodelist 
    remainingForms.forEach(function(form, index){

        console.log(form)
        console.log(index)
        //assigns the current index to the variable newIndex
        const newIndex = index;
        //set the id attribute of the current form to a new value composed of the string "form-" concatenated with the newIndex.
        form.id = `form-${newIndex}`;
        //Selects all input and select elements within the current form and starts another loop to iterate over each of them.
        form.querySelectorAll("input").forEach(function(input){
            console.log(input)
            //retrieves the value of the name attribute
            const oldName = input.getAttribute("name");
            //uses a regular expression to find and replace the numeric part of the name attribute with the newIndex value we generated earlier
            // update form index 
            //replaces the matched pattern (-\d+-) with a hyphen followed by the newIndex 
            // -: Matches a hyphen character.
            // \d+: Matches one or more digits (0-9).
            // -: Matches another hyphen character.
            // this regular expression search for a pattern like "-{number}-" within the oldName string and replaces it with "-{newIndex}-".
            const newName = oldName.replace(/-\d+-/, `-${newIndex}-`);
            //set the name attribute of the current input element to the new value stored in newName
            input.setAttribute("name", newName);
            // checks if the input/select element has an id attribute.
            if (input.hasAttribute("id")) {
                const oldId = input.getAttribute("id");
                const newId = oldId.replace(/-\d+-/, `-${newIndex}-`);
                input.setAttribute("id", newId);

                // Update label for attribute
                //find a <label> element whose for attribute matches the value stored in the oldId variable.
                const labelFor = document.querySelector(`label[for='${oldId}']`);
                if (labelFor) {
                    labelFor.setAttribute("for", newId);
                }
            }
        });
    });
}

function editpumpinline(btn){
    console.log(btn.dataset.id)
    const pumpId = btn.dataset.id
    const container = document.querySelector(`#pump-${pumpId}-form-container`)
    const originalContent = container.innerHTML;

    fetch(`/editpumpinline/${ pumpId }`)
    .then(response => response.text())
    .then(function(data){
        console.log(data)
        const editPumpInlineForm = data;

        // editPumpInlineForm.innerHTML = data
        // editPumpInlineForm.method = "post"; // Set the form method
        // editPumpInlineForm.action = "//"; // Set the form action

        container.innerHTML = '';

        //Create a div for cancel button
        // const cancelButton = document.createElement("div");
        // cancelButton.classList.add("text-left")
        // cancelButton.innerHTML =`<button class="cancel-button">Cancel</button>`

        // //Create a div for save button
        // const saveButton = document.createElement("div");
        // saveButton.classList.add("text-left")
        // saveButton.innerHTML =`<button class="save-button">Save</button>`


        container.innerHTML = editPumpInlineForm;
        // container.appendChild(cancelButton);
        // container.appendChild(saveButton);

        // container.querySelector(".save-button").addEventListener("click", function(){
        //     saveFormData(editPumpInlineForm, pumpId, container);
        // })

        container.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission behavior
            //console.log("form submitted")
            const form = event.target;
            console.log(form)
            //console.log(form.parentElement)
            saveFormData(form, pumpId, form.parentElement, originalContent);
        });


        container.querySelector(".cancel-button").addEventListener("click", function() {
            console.log("Cancel button pressed")
            container.innerHTML = '';
            container.innerHTML = originalContent;
            //console.log(container.querySelector(".edit-pump-button"))

            container.querySelector(".edit-pump-button").addEventListener('click', function(){
                editpumpinline(this)
            });
        });
            
    })
}

function saveFormData(form, pumpId, container, originalContent){
    // console.log("save function called")
    // const tempContainer = document.createElement('div');
    // tempContainer.innerHTML = form;
    // const htmlForm = tempContainer.querySelector('form')
    fetch(`/editpumpinline/${ pumpId }`, {
        method: 'POST',
        body: new FormData(form) // Serialize the form data
    })
    .then(response => response.text())
    .then(function(data) {
        // Update the container with the response data
        console.log(data)
        container.innerHTML = data;
        if (data.includes('errorlist')) {
            container.querySelector(".cancel-button").addEventListener("click", function() {
                console.log("Cancel button pressed")
                container.innerHTML = '';
                container.innerHTML = originalContent;
    
                container.querySelector(".edit-pump-button").addEventListener('click', function(){
                    editpumpinline(this)
                });
            });
            
        }
        else{
            container.querySelector(".edit-pump-button").addEventListener('click', function(){
                editpumpinline(this)
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return false;

}