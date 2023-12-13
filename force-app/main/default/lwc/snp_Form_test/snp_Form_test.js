import { LightningElement } from 'lwc';

export default class Snp_Form_test extends LightningElement {

    handelEmailNotification(event) {
        // if (this.template.querySelector('.EmailNotification').checked) {
        //     console.log('Checkbox is checked');
    
        //     // Create a form dynamically
        //     let formElement = document.createElement("form");
        //     formElement.setAttribute("method", "POST");
        //     formElement.setAttribute("action", "https://pr.sunpowermarketing.co.uk/l/308921/2018-10-31/w8q66");
        //     formElement.setAttribute("class", "marketing-form");
    
        //     // Create an email input element
        //     var inputElement = document.createElement("input");
        //     inputElement.setAttribute("type", "email");
        //     inputElement.setAttribute("name", "email"); // Set the name attribute to match your form's field name
        //     inputElement.setAttribute("value", "jijjiijj@yopmail.com"); // Set the email value
    
        //     // Append the email input to the form
        //     formElement.appendChild(inputElement);
    
        //     // Submit the form
        //     formElement.submit();
        // }

        // Find a container element in your component's template
let targetedContainer = this.template.querySelector(".signUp-container");

if (this.template.querySelector('.EmailNotification').checked) {
    console.log('Checkbox is checked');

    // Create a form dynamically
    let formElement = document.createElement("form");
    formElement.setAttribute("method", "POST");
    // formElement.setAttribute("action", "https://pr.sunpowermarketing.co.uk/l/308921/2018-10-31/w8q66");
    formElement.setAttribute("class", "marketing-form");

    // Create an email input element
    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "email");
    inputElement.setAttribute("name", "email"); // Set the name attribute to match your form's field name
    inputElement.setAttribute("value", "jijjiijj@yopmail.com"); // Set the email value

    // Append the email input to the form
    formElement.appendChild(inputElement);

    // Append the form to the container element in the DOM
    targetedContainer.appendChild(formElement);

    // Submit the form
    formElement.submit();
    console.log('form submitted');
}

    }

    // handelEmailNotification(event){
    //         if (this.template.querySelector('.EmailNotification').checked) {
    //             console.log('checked');
    //         console.log(event.target.checked);
    //         if(event.target.checked){
    //             console.log('ok send the email');
    //             debugger;
    //             if(!this.template.querySelector(".marketing-form")){
    //                 let targetedContainer = this.template.querySelector(".signUp-container")
    //                 let formElement = document.createElement("form");
    //                 formElement.setAttribute("method","POST");
    //                 formElement.setAttribute("action","https://pr.sunpowermarketing.co.uk/l/308921/2018-10-31/w8q66");
    //                 formElement.setAttribute("class","marketing-form");
    //                 var inputElement = document.createElement("input");
    //                 inputElement.setAttribute("type","email");
    //                 inputElement.setAttribute("value","jijjiijj@yopmail.com");
    //                 formElement.appendChild(inputElement);
    //                 targetedContainer.appendChild(formElement);
    //                 form.submit();
    //             }
    //         }
    //     }
    // }
}