import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Tasks from '@salesforce/schema/Tasks__c';
import NAME_FIELD from '@salesforce/schema/Tasks__c.Name';
import Project_FIELD from '@salesforce/schema/Tasks__c.Project__c';
import Completed_FIELD from '@salesforce/schema/Tasks__c.Completed__c';
export default class TaskComponent1 extends LightningElement {
    objectApiName= Tasks;
    fields = [NAME_FIELD, Project_FIELD, Completed_FIELD];
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Task created',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
}