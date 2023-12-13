import { LightningElement } from 'lwc';
import flagTelpicker from '@salesforce/resourceUrl/flagTelpicker';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

export default class Countrydialcode extends LightningElement {
    
    //https://www.jqueryscript.net/form/jQuery-International-Telephone-Input-With-Flags-Dial-Codes.html
    connectedCallback(){
        Promise.all([
            loadStyle(this,flagTelpicker + '/css/demo.css'),
            loadStyle(this,flagTelpicker + '/css/intlTelInput.css'),
            loadScript(this, flagTelpicker + '/js/utils.js'),
            loadScript(this, flagTelpicker + '/js/intlTelInput.js')
        ]).then(() => {
            this.initFlagpicker();
        })
        .catch(error => {
            console.log(error);
        });
    }
    initFlagpicker(){
        const input = this.template.querySelector("[data-id=phone]");
        window.intlTelInput(input, {
            separateDialCode: true,
            excludeCountries: ["il"],
            preferredCountries: ["ru", "jp", "pk", "no"],
            initialCountry: "IN",
        });
    }
    handleFieldChange(event){
        debugger;
        const input1 = this.template.querySelector("[data-id=phone]")
        console.log('input1--->'+JSON.stringify(input1));
        console.log(event.target.value);
    }
}