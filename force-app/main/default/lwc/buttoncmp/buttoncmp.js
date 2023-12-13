import { LightningElement } from 'lwc';

export default class Buttoncmp extends LightningElement {
    label1='submit';
    addressData=true;
    require=true;
    label='Address Type';

    listaddress=['billing','Shipping'];

    itemhandler(event){
        debugger;
        // let selectedAddress = event.currentTarget.dataset.item;
        let selectedAddress= event.target.dataset.value;
        this.label=selectedAddress;
        // let requriedField= this.template.querySelector('.address-field')
        this.require=false;
       // requriedField.classList.add('label-remove');
        this.addressData=true;
    }

    buttonevent(){

        this.addressData=false;
        // let requriedField= this.template.querySelector('.country-options');
        // requriedField.classList.remove('label-remove');
    }
    removelist(){
        this.addressData=true;
    }
}