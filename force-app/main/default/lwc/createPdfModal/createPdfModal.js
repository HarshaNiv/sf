/**
 * @description       :
 * @author            : Jonny Harte
 * @group             :
 * @last modified on  : 09-03-2021
 * @last modified by  : Jonny Harte
 * Modifications Log
 * Ver   Date         Author          Modification
 * 1.0   04-02-2021   Jonny Harte    Initial Version
 * 1.1   10-03-2021   Nitesh Jaruhar made into unmanaged package
 **/
 import { LightningElement, api, wire, track } from "lwc";
 import { ShowToastEvent } from "lightning/platformShowToastEvent";
 import { getRecord, getFieldValue, updateRecord } from "lightning/uiRecordApi";
 import createPdf from "@salesforce/apex/CreatePdfModalController.createPdf";
 import getContentDocuments from "@salesforce/apex/CreatePdfModalController.getContentDocuments";
 import sendPdf from "@salesforce/apex/CreatePdfModalController.sendPdf";
 
 export default class CreatePdfModal extends LightningElement {
     @api recordId;
     @api sObjectName;
     @track fields;
     hasPdf = false;
 
     @wire(getRecord, {
         recordId: "$recordId",
         fields: "$fields"
     })
     record;
 
     // get invoicingContactFieldApiName() {
     //     return `${this.sObjectName}.Account__r.Invoicing_Contact__r.Id`;
     // }
 
     get pageRefURL() {
         const visualForceName = this.sObjectName.replace("__c", "").replaceAll("_", "");
 
         return `${visualForceName}PDF`;
     }
 
     get idFieldApiName() {
         return `${this.sObjectName}.Id`;
     }
 
     get emailAddrFieldName() {
         if (this.sObjectName==='Opportunity')
             return `${this.sObjectName}.Email_Address__c`;
         else
             return `${this.sObjectName}.Email`;
     }
 
     // get pathFieldApiName() {
     //     return `${this.sObjectName}.Status__c`;
     // }
 
     // get pathValue() {
     //     return getFieldValue(this.record.data, this.pathFieldApiName);
     // }
 
     get invoicingContactId() {
          return getFieldValue(this.record.data, this.invoicingContactFieldApiName);
     }
 
     get emailAddr() {
         return getFieldValue(this.record.data, this.emailAddrFieldName);
    }
 
     // get ccAddress() {
     //     return getFieldValue(this.record.data, this.emailFieldApiName);
     // }
 
     get visualForceUrl() {
         return `/apex/${this.pageRefURL}?Id=${this.recordId}`;
     }
 
     connectedCallback() {
         // this.fields = [this.pathFieldApiName, this.invoicingContactFieldApiName, this.emailFieldApiName];
         //this.fields = [this.pathFieldApiName, this.invoicingContactFieldApiName];
        //  this.fields = [this.idFieldApiName, this.emailAddrFieldName];
         this.fields = [this.idFieldApiName];
         getContentDocuments({ recordId: this.recordId }).then((docs) => {
             if (docs.length > 0) {
                 this.hasPdf = true;
             }
         });
     }
 
     handleCancel() {
         this.dispatchEvent(new CustomEvent("close"));
     }
 
     handleSaveAndSend(event) {
         const sendEmail = event.target.dataset.sendEmail === "true";
         createPdf({ recordId: this.recordId, pageRefURL: this.pageRefURL })
             .then((docId) => {
                 if (!sendEmail) {
                     return null;
                 }
                 return sendPdf({
                     recordId: this.recordId,
                     emailAddr: this.emailAddr,
                     attachmentIds: [docId]
                 });
             })
             .then(() => {
                 if (!sendEmail) {
                     return null;
                 }
 
                 return null; //left this section to make it easier to extend functionality in the future
                 // return this.updatePath("Sent", ["Draft", "Pending Review"]);
             })
             .then(() => {
                 this.dispatchEvent(new CustomEvent("save"));
 
                 this.dispatchEvent(
                     new ShowToastEvent({
                         title: "Success",
                         message: `File has been ${sendEmail ? "sent" : "saved"}.`,
                         variant: "success"
                     })
                 );
 
                 this.dispatchEvent(new CustomEvent("close"));
             })
             .catch((error) => {
                 this.dispatchEvent(
                     new ShowToastEvent({
                         title: `Error ${sendEmail ? "Sending" : "Saving"} PDF`,
                         message: error.body.message,
                         variant: "error",
                         mode: "sticky"
                     })
                 );
             });
     }
 
     updatePath(newValue, previousSteps = []) { //left this functionality here to allow easy future usage if needed
         if (!previousSteps.includes(this.pathValue)) {
             return null;
         }
 
         const fields = {};
         fields.Id = this.recordId;
         fields.Status__c = newValue;
         const recordInput = { fields };
 
         return updateRecord(recordInput);
     }
 }