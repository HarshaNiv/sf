import { LightningElement,track } from 'lwc';
import {NavigationMixin} from "lightning/navigation";
import SUNPOWERICONS from '@salesforce/resourceUrl/SUNPOWERICONS';

export default class SnpContactUs extends NavigationMixin(LightningElement) {

@track iconUrl=SUNPOWERICONS+'/contactusicon.png';
    
//Opens Internal Contact Us Page
handleContactUs(){
    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'Contact_Us__c'
      }
    });
}


}