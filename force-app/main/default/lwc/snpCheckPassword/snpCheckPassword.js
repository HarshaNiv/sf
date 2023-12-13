import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SnpCheckPassword extends  NavigationMixin(LightningElement)  {

    backtologinhandler(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
            name:'Login',
            }
        });
    }
    
}