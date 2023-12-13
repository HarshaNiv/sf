import { LightningElement,api, track } from 'lwc';
import fields from "@salesforce/apex/Projectrec.fieldsdisplay";
export default class Taskcmp extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track data;
    @track error;
    
    projectevent(){
        fields({proid : this.recordId})
        .then((result)=>{
           // console.log(result);
            this.data = result;
            this.error = undefined;
        })
        .catch((error)=>{
            this.error = error;
            this.data = undefined;
           // console.log(error);
        })
    }
}