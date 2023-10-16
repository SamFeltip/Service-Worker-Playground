function createModal(intTargetModalID="", strHeaderText="default modal header", strModalBody="<div class='modalLoading'></div>"){

    let dialog = document.createElement('dialog');
    dialog.id = intTargetModalID;
    dialog.className = 'samModal';

    let headerElement = document.createElement('div');
    headerElement.className = 'header';

    let headerText = document.createElement('p');
    headerText.innerHTML = strHeaderText

    let closeModalButton = document.createElement('button');
    closeModalButton.className = 'closeModal';
    closeModalButton.textContent = 'X';

    // Add the header text and close button to the header
    headerElement.appendChild(headerText);
    headerElement.appendChild(closeModalButton);

    let modalBody = document.createElement('div');
    modalBody.className = 'body';

    modalBody.innerHTML = strModalBody;

    // Add the header and body to the dialog
    dialog.appendChild(headerElement);
    dialog.appendChild(modalBody);

    // Add the dialog to the body of the HTML document
    document.body.appendChild(dialog);

    addClosingProceduresToModal(dialog)

    return dialog

}


const openModalButtons = document.getElementsByClassName('openModal');

for (let indexOfOpenModalButtons = 0; indexOfOpenModalButtons < openModalButtons.length; indexOfOpenModalButtons++) {
    
    let HTMLOpenModalButton = openModalButtons[indexOfOpenModalButtons]
    
    HTMLOpenModalButton.addEventListener('click', function() {

        let intTargetModalID = HTMLOpenModalButton.getAttribute('data-modal-id');
        let strHeaderText = HTMLOpenModalButton.getAttribute('data-modal-header');
    
        let strModalAjaxURL = HTMLOpenModalButton.getAttribute('data-modal-url');
        let HTMLModal = document.getElementById(intTargetModalID);
        
        if(!HTMLModal){
            HTMLModal = createModal(intTargetModalID, strHeaderText)
        }

        HTMLModal.showModal();
        let HTMLModalBody = HTMLModal.getElementsByClassName("body")[0]
    
        
        if(strModalAjaxURL){
            fetch(strModalAjaxURL).then(async (response) => {
                let strHtml = await response.text();
                HTMLModalBody.innerHTML = strHtml
            }).catch(err => {
                console.error(err);
            })
        }

    })
}



function addClosingProceduresToModal(modal){
    modal.addEventListener('click', function(event) {
        // Check if click was outside the dialog
        if (event.target === modal) {
            modal.close();
        }
    })

    let HTMLCloseModalButton = modal.getElementsByClassName("closeModal")[0]
    
    HTMLCloseModalButton.addEventListener('click', function(){
      modal.close()
    })
}

const modals = document.getElementsByClassName('samModal');

for (let indexOfModals = 0; indexOfModals < modals.length; indexOfModals++) {
    let modal = modals[indexOfModals]
    addClosingProceduresToModal(modal)
}


// document.querySelectorAll('.samModal').forEach(modal => {
//     addClosingProceduresToModal(modal)
// })