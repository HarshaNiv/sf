import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id'; //gets Id of running user
import isGuest from '@salesforce/user/isGuest'; //true if unauthenticated, otherwise false
export default class SNP_Analytics extends LightningElement {

    connectedCallback()
{
    //build the event detail object in a structure that works for Google Analytics 
    let payload = { detail: 
        { 
            'user_id': Id, 
            'user_properties': {
                'user_id': Id,
                'user_type': (isGuest) ? 'Unauthenticated' : 'Authenticated',
                'account_rating': 'Silver'
            }
        }
    };
    //publish custom event for the listener in the head markup to handle
    document.dispatchEvent(new CustomEvent('analyticsSupport', payload));
}

}