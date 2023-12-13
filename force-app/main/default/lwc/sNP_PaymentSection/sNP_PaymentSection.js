import { LightningElement } from 'lwc';
/**
* @slot CreditCardRegion
* @slot CreditCardRegion1
*@slot BillingAddress
*/

export default class SNP_PaymentSection extends LightningElement {
    value1 = '';
    value2 = '';
    property1=false;
    property2=false;

    get options1() {
        return [
            { label: 'Credit Card', value: 'option1' },
        ];
    }
    get options2() {
        return [
            { label: 'Purchase Order', value: 'option2' },
        ];
    }


    handleChangeCredit(event){
        this.value2='';
        this.value1=event.target.value;
        this.property2=false;
        this.property1=true;
        
    }

    handleChangePo(event){
        this.value1='';
        this.value2=event.target.value;
        this.property1=false;
        this.property2=true;
    }
    
}