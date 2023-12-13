import { LightningElement,wire} from 'lwc';
import Id from '@salesforce/user/Id'; //gets Id of running user
import isGuest from '@salesforce/user/isGuest';
//import { getRecord,getFieldValue } from 'lightning/uiRecordApi';
//import 	loginuser from "@salesforce/apex/username.loginuser";
//const fields = User_Name;

export default class AnalyticsSupport extends LightningElement {
    connectedCallback(){
         setTimeout(()=>{
            let payload = { detail: 
                { 
                    'user_id': Id, 
                    'user_properties': {
                        'user_id': Id,
                        'user_type': (isGuest) ? 'Unauthenticated' : 'Authenticateddd',
                        'account_rating': 'Silver'
                    }
                }
            };
            document.dispatchEvent(new CustomEvent('analyticsSupport', payload));
         },2000);

        
        //publish custom event for the listener in the head markup to handle
       
     //build the event detail object in a structure that works for Google Analytics 
    
}

}