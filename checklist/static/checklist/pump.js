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
    emptyForm.querySelector("#remove-button").addEventListener('click', function(){
        console.log(this.parentElement)
        removeForm(this.parentElement)
    })
    formList.append(emptyForm)
}


// function addNewForm() {
//     const emptyForm = document.querySelector("#empty-form").cloneNode(true);
//     const totalNewForms = document.querySelector("#id_form-TOTAL_FORMS");
//     const currentFormCount = document.querySelectorAll(".pump-form").length;

//     emptyForm.setAttribute("class", "pump-form");
//     emptyForm.setAttribute("id", `form-${currentFormCount}`);
//     const regex = new RegExp("__prefix__", "g");
//     emptyForm.innerHTML = emptyForm.innerHTML.replace(regex, currentFormCount);
//     emptyForm.style.display = "flex";

//     // Update the names of form fields
//     emptyForm.querySelectorAll("input, select, textarea").forEach(function (input) {
//         const oldName = input.getAttribute("name");
//         const newName = oldName.replace(/-\d+-/, `-${currentFormCount}-`);
//         input.setAttribute("name", newName);

//         if (input.hasAttribute("id")) {
//             const oldId = input.getAttribute("id");
//             const newId = oldId.replace(/-\d+-/, `-${currentFormCount}-`);
//             input.setAttribute("id", newId);

//             const labelFor = document.querySelector(`label[for='${oldId}']`);
//             if (labelFor) {
//                 labelFor.setAttribute("for", newId);
//             }
//         }
//     });

//     totalNewForms.setAttribute("value", currentFormCount + 1);

//     emptyForm.querySelector("#remove-button").addEventListener("click", function () {
//         removeForm(emptyForm);
//     });

//     const formList = document.querySelector(".pump-form-list");
//     formList.appendChild(emptyForm);
// }

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