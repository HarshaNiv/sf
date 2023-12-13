import { LightningElement } from 'lwc';

export default class Refcmp extends LightningElement {
   addressData;
    Address1=false;
    fname1=false;
    lname1=false;
    require=true;
    //for country

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
        this.addressData= !this.addressData;
    }

    buttonevent(event){
        console.log('ok');
        event.preventDefault();
        event.stopPropagation();
        let requriedField= this.template.querySelector('.country-options');
        // this.addressData= !this.addressData;
        
         console.log('requriedField------------>'+ JSON.stringify(requriedField));
         requriedField.classList.toggle('show-toggle');
    }
    removelist(event){
        setTimeout(() => {
            console.log('ok');
            event.preventDefault();
            event.stopPropagation();
            let requriedField= this.template.querySelector('.country-options');
            // this.addressData= !this.addressData;
            
             console.log('requriedField------------>'+ JSON.stringify(requriedField));
             requriedField.classList.toggle('show-toggle');
        }, 0); 
       
    }
}