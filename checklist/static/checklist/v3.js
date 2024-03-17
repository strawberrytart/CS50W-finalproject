//Declare global variables
//Declare initialFormData to store the form fields in a dictionary to be used for checking 
let initialFormData = {}
//Initiate a variable to track the modal that is currently active in a string
//to be used to discard changes 
let activeModal =''

document.addEventListener('DOMContentLoaded', function () {  
    document.querySelectorAll('#editPumpBtn').forEach(function(button){
        button.addEventListener('click', function(){
            handleEditButtonClick(button);
        })
    })

    document.querySelector('#deletePumpBtn').addEventListener('click', function(){
        openDeleteModal(this)
    })
    

    document.querySelector('#editChecklistBtn').addEventListener('click',function(){
        //Show the modal
        $('#editChecklistModal').modal('show');
        //Capture the initial form data and save it in initialFormData to be used for checking later
        initialFormData = captureInitialFormData('#editChecklistForm')
        //Set the attribute data-form to the editChecklistForm so that we can close it later 
        document.querySelector('#discardBtn').dataset.form = '#editChecklistForm'
        //Update the flag activeModal to #editChecklistModal
        activeModal = '#editChecklistModal'
    })

    document.querySelector('#addPumpBtn').addEventListener('click',function(){
        //Show the modal
        $('#addPumpModal').modal('show');
        //Capture the form field data and save it in a dict for checking later
        initialFormData = captureInitialFormData('#addPumpForm')
        //Set the attribute data-form to the addPumpForm so that we can discard changes to the form
        document.querySelector('#discardBtn').dataset.form = '#addPumpForm'
        //Update the flag activeModal to #addPumpModal
        activeModal = '#addPumpModal'
    })

    //What to do when the checklist form is submitted
    const editChecklistForm = document.querySelector('#editChecklistForm')
    editChecklistForm.addEventListener('submit', function(event){
        checklistId = editChecklistForm.dataset.checklistid
        saveChecklistForm(editChecklistForm,checklistId);
        //prevent the form from reloading
        event.preventDefault();
        console.log("checklist form submitted")
    })

    const addPumpForm = document.querySelector('#addPumpForm')
    addPumpForm.addEventListener('submit', function(event){
        //prevent the page from reloading
        checklistId = addPumpForm.dataset.checklistid
        addPump(addPumpForm, checklistId)
        event.preventDefault();
    })

    //Attach event to closeModalBtn when clicked
    document.querySelectorAll('.closeModalBtn').forEach(function(button){
        button.addEventListener('click', function(){
            formId = this.dataset.form;
            //Check if the form fields have been changed by comparing to the dict stored before
            if (hasFormChanged(initialFormData,`#${formId}`)) {
                console.log('Form has changed');
                //Show the discard changes modal
                $('#modal2').modal('show');
                return;
            }
            //If the form fields have not been changed, then close the modal
            $('#editChecklistModal').modal('hide');
        })
    });

    //Attach event to closePumpModalBtn when clicked
    document.querySelectorAll('.closePumpModalBtn').forEach(function(button){
        button.addEventListener('click', function(){
            formId = this.dataset.form
            //Check if the form fields have been changed by comparing to the dict stored before
            if (hasFormChanged(initialFormData,`#${formId}`)) {
                console.log('Form has changed');
                //Show the discard changes modal
                $('#modal2').modal('show');
                return;
            }
            //If the form fields have not been changed, then close the modal
            $('#addPumpModal').modal('hide');
        })
    });

    //Attach event to closeEditPumpModalBtn when clicked
    document.querySelectorAll('.closeEditPumpModalBtn').forEach(function(button){
        //console.log(button)
        button.addEventListener('click', function(){
            formId = this.dataset.form
            //Check if the form fields have been changed by comparing to the dict stored before
            if (hasFormChanged(initialFormData,`#${formId}`)) {
                console.log('Form has changed');
                //Show the discard changes modal
                $('#modal2').modal('show');
                return;
            }
            //If the form fields have not been changed, then close the modal
            $('#editPumpModal').modal('hide');
        })
    });


    document.querySelector('#discardBtn').addEventListener('click', function(){
        console.log("discard btn clicked")
        //Close the discard changes modal
        $('#modal2').modal('hide');
        //close the current active modal, denoated by the flag activeModal which is a string
        $(activeModal).modal('hide');
        const formstring = this.dataset.form
        //restore the form fields to the original data 
        restoreFormFields(initialFormData,formstring);
    })
});



//When the edit button is clicked
function handleEditButtonClick(button){
    //Show the edit pump modal 
    $('#editPumpModal').modal('show');
    pumpId = button.dataset.id;
    //set the delete button to the pump id 
    document.querySelector('#deletePumpBtn').setAttribute('data-id', pumpId );
    //make a asynchronous call to retrieve the info of a pump based on pump id 
    getEditPump(button)
    .then(data => {
        //put the Pump Model fields into the dict
        initialFormData = data;
        console.log(initialFormData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    //set the discard button to editPumpForm
    document.querySelector('#discardBtn').dataset.form = '#editPumpForm';
    //set the flag to editPumpModal
    activeModal = '#editPumpModal';
}


//Open modal when delete pump button is clicked
function openDeleteModal(btn){
    pumpId = btn.dataset.id
    fetch(`/deletepumpajax/${pumpId}`,{
        method: 'GET',
    })
    .then(response => response.text())
    .then(function(data){
        deleteModal = document.querySelector('#deleteModal')
        modalBody = deleteModal.querySelector('.modal-body')
        //Set the pump info in the modalBody
        modalBody.innerHTML = data
        // When the promise is received successfully, show the deleteModal
        $('#deleteModal').modal('show');
        const deletePumpForm = document.querySelector('#deletePumpForm')
        //when the delete pump form is submitted, delete the pump
        deletePumpForm.addEventListener('submit', function(event){
            event.preventDefault();
            const form  = event.target;
            deletePump(form)
        })
    })
}

// Function to handle delete pump form
function deletePump(form){
    pumpId = form.dataset.pumpid
    console.log(pumpId)
    fetch(`/deletepumpajax/${pumpId}`,{
        method: "POST",
        body: new FormData(form)
    })
    .then(response => response.json())
    .then(result =>{
        if (result['error']){
            console.log(result['error']);
        }
        else{
            console.log(result["message"]);
            pumpId = result["id"]
            //If the pump is successfully deleted, hide all modals 
            $('#deleteModal').modal('hide');
            $('#editPumpModal').modal('hide');
            //Remove the pump from the list without page refresh
            const pumpContainer = document.querySelector(".pumpContainer");
            const pumprow = pumpContainer.querySelector(`#pump-${pumpId}`);
            pumprow.remove()
        }
    })
}

//Capture the form fields and save it in a dictionary
function captureInitialFormData(formstring){
    // Initialize an empty object to store the initial form data
    const initialFormData = {}
     // Select the form element using the provided selector string
    const form = document.querySelector(formstring)
    // Loop through each element of the form
    Array.from(form.elements).forEach(element => {
        // Check if the element type is not 'hidden', so that we don't copy the CSRF token 
        if (element.type !== 'hidden') {
            // Check if the element type is 'checkbox'
            if (element.type === 'checkbox') {
                // Store the checkbox state (checked or unchecked) in the initialFormData object
                initialFormData[element.name] = element.checked;
            }
            // For all other types of elements
            else{
                // Store the element value in the initialFormData object
                initialFormData[element.name] = element.value;
            }
        }
    });
    // Return the object containing the initial form data
    return initialFormData
}


// Define a function named hasFormChanged which checks if the form data has changed compared to initial form data
function hasFormChanged(initialFormData, formstring) {
    // Initialize an empty object to store the form data that will be submitted
    const submitFormData = {};
    // Select the form element using the provided selector string
    const form = document.querySelector(formstring);
    // Loop through each element of the form
    Array.from(form.elements).forEach(function(element) {
        // Check if the element type is not 'hidden', so that we don't copy CSRF token 
        if (element.type !== 'hidden') {
            // Check if the element type is 'checkbox'
            if (element.type === 'checkbox') {
                 // Store the checkbox state (false or true) in the submitFormData object
                submitFormData[element.name] = element.checked;
            }
            // For all other types of elements
            else{
                // Store the element value in the submitFormData object
                submitFormData[element.name] = element.value;
            }
        }
    });
    // Compare the form data that will be submitted with the initial form data
    for (let key in submitFormData) {
        // If any form field's value has changed compared to initial form data
        if (submitFormData[key] !== initialFormData[key]) {
            // Return true indicating that form data has changed
            return true;
        }
    }
    // Return false indicating that form data has not changed
    return false;
}

// Define a function named restoreFormFields which restores the form fields to their initial values based on initial form data
function restoreFormFields(initialFormData, formstring){
    const form = document.querySelector(formstring);
    // Loop through each key in the initial form data object
    for (let key in initialFormData){
        // Find the input element with the corresponding name attribute in the form
        const input = form.querySelector("[name='" + key + "']");
        // Check if the input element exists
        if (input){
            // Set the value of the input element to the corresponding value from the initial form data
            input.value = initialFormData[key];
        }
    }
}

// Define a function named saveChecklistForm which sends a checklist form data to the server for updating
function saveChecklistForm(form, checklistId){
    // Send a POST request to the server with the checklistId appended to the URL
    fetch(`/updatev3/${checklistId}`,{
        method: 'POST',
        // Use FormData to construct the request body from the form data
        body: new FormData(form)
    })
    // Once the server responds, parse the response as text
    .then(response => response.text())
     // Process the data returned from the server
    .then(function(data){
         // If an error message is present, display it in the modal body
        if (data.includes('errorlist')){
            document.querySelector('.modal-body').innerHTML = data
            // Reattach the event listener for 'submit' because the previous one was removed
            const form = document.querySelector('#editChecklistForm')
            form.addEventListener('submit', function(event){
                checklistId = form.dataset.checklistid
                saveChecklistForm(form,checklistId);
                event.preventDefault();
                console.log("checklist form submitted")
            })
        }
        // If no error message is present in the response data
        else{
            const container = document.querySelector('#checklist-detail-container')
            container.innerHTML = data
             // Hide the edit checklist modal using jQuery
            $('#editChecklistModal').modal('hide');
        }
    })
}


// Define a function named addPump which sends a request to add a pump to a checklist
function addPump(form, checklistId){
    // Send a POST request to the server to add a pump, with the checklistId appended to the URL
    fetch(`/addpumpajax/${checklistId}`, {
        method: 'POST',
        // Use FormData to construct the request body from the form data
        body: new FormData(form)
    })
    // Once the server responds, parse the response as text
    .then(response => response.text())
    // Process the data returned from the server
    .then(function(data){
        // If an error message is present
        if (data.includes('errorlist')){
            // Display the error message in the add pump modal body
            document.querySelector('.addPumpModalBody').innerHTML = data
            // Reattach the event listener for 'submit' because the previous one was removed
            const form = document.querySelector('#addPumpForm')
            form.addEventListener('submit', function(event){
                console.log("add pump form submitted")
                checklistId = form.dataset.checklistid
                console.log(checklistId)
                addPump(form,checklistId)   
                event.preventDefault();
            })

        }
        else{
            // Hide the add pump modal using jQuery
            $('#addPumpModal').modal('hide');
            const pumpContainer = document.querySelector('.pumpContainer')
            const pumpRow = document.createElement('div')
            pumpRow.classList.add("row");
            pumpRow.innerHTML = data
            // Append the row to the pump container
            pumpContainer.append(pumpRow)
            // Reset the add pump form
            form.reset()

            // Add event listener to the edit pump button in the new pump row
            pumpRow.querySelector('#editPumpBtn').addEventListener('click', function(){
                 // Call the handleEditButtonClick function passing the edit pump button
                handleEditButtonClick(this);
            })
        }
    })
}


// Define a function named getEditPump which fetches the data of a pump for editing
function getEditPump(button){
    const pumpId = button.dataset.id

    // Return a Promise for asynchronous handling
    return new Promise ((resolve, reject) =>{
        // Send a GET request to the server to fetch pump data for editing
        fetch(`/editpumpajax/${pumpId}`,{
            method: 'GET',
        })
         // Once the server responds, parse the response as text
        .then(response => response.text())
        // Process the data returned from the server
        .then(function(data){
            const formcontainer = document.querySelector('.editPumpModalBody')
            // Set the inner HTML of the container to the fetched data directly
            formcontainer.innerHTML = data;
            const editPumpForm = document.querySelector('#editPumpForm')
            
            // Attach a submit form handler to the edit pump form
            editPumpForm.addEventListener('submit', function(event){
                event.preventDefault();
                const form = event.target;
                submitEditPumpForm(form, pumpId);
            });
            // Capture the initial form data of the edit pump form
            const initialFormData = captureInitialFormData('#editPumpForm');
            // Resolve the promise with the initial form data
            resolve(initialFormData)
        })
        // If an error occurs during the process, reject the promise
        .catch(error => reject(error));
    });
}


// Define a function named submitEditPumpForm which submits the edit pump form data to the server
function submitEditPumpForm(form,pumpId){
    // Send a POST request to the server with the pumpId appended to the URL
    fetch(`/editpumpajax/${pumpId}`,{
        method: 'POST',
        // Use FormData to construct the request body from the form data
        body: new FormData(form)
    })
    // Once the server responds, parse the response as text
    .then(response => response.text())
    .then(function(data){
        // If an error message is present
        if (data.includes('errorlist')){
            // Display the error message in the modal body of the edit pump modal
            document.querySelector('.modal-body.editPumpModalBody').innerHTML = data
            const editPumpForm = document.querySelector('#editPumpForm')
             // Reattach the event listener for 'submit' because the previous one was removed
            editPumpForm.addEventListener('submit', function(event){
            event.preventDefault();
            const form = event.target;
            submitEditPumpForm(form, pumpId);
        })
        }
        else{
            // Convert HTML string to HTML Node
            const placeholder = document.createElement("div");
            placeholder.innerHTML = data
            const pumpRow = placeholder.firstElementChild;

            // Swap location of old pump with newly edited pump
            const pumpRowOld = document.querySelector(`#pump-${pumpId}`)
            pumpRowOld.parentNode.replaceChild(pumpRow, pumpRowOld)

            //Hide the modal after successfully editing the pump
            $('#editPumpModal').modal('hide');

            //Re-attach the event listener for the edit pump
            pumpRow.querySelector('#editPumpBtn').addEventListener('click', function(){
                console.log("edit pump btn clicked")
                getEditPump(this)
                $('#editPumpModal').modal('show');   
            })
        }
    })
}
