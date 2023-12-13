import { LightningElement ,track} from 'lwc';
import {showToastEvent} from 'lightning/platformshowToastEvent';

export default class LWC extends LightningElement {

    myTitle = "salesforce";

    connectedCallback(){
let callMyFunction = this.myFunction(10,2);
window.alert("callMyFunction:" +callMyFunction);
    }

    myFunction(dividend , divisor){
        return (dividend/divisor);
    }
    handleClick(){
        window.alert("Hello Salesforce")
    }
    showToast(){
        const event = new showToastEvent({
            title: 'show toast demo',
            message : 'want to display toast example',
            variant : 'success',

        })
        this.dispatchEvent(event);

        
    } 
    myFunction = (dividend,divisor) =>{
       return (dividend/divisor);
    }

@track fullname;


}