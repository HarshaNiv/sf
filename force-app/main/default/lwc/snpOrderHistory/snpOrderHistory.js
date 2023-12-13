import { LightningElement,api,track } from 'lwc';
import getSageIdsFromOrderIds from '@salesforce/apex/SNP_OrderHistoryController.getSageIdsFromOrderIds';
/**
 * @slot Order-history-std-comp
 */

export default class SnpOrderHistory extends LightningElement {
    _accountSageIds;

   connectedCallback(){
        setTimeout(()=>{
            // all Span Elemeents inside all the order line items div
            let allTragetSpanElement = this.template.querySelectorAll(".order-custom-slot commerce-field-display .slds-rich-text-editor__output span");
            let allOrderElement = Array.from(allTragetSpanElement).filter((item,index,arr)=> index%2==0);
            let allOrderId=[];
            allOrderElement.forEach((element)=>{
                allOrderId.push(element.innerText.toString());
            });
            console.log("My all order id"+allOrderId);
            this.getSageId(allOrderId);
        },1000);
        
    }

     getSageId(allOrderId){
        // imperative apex call
        getSageIdsFromOrderIds({allOrderIds:allOrderId})
        .then(result => {
            this._accountSageIds = result;
            // Get the sageId From Result and create div element with sageid value and append it to multiple order-line-item
            let allSageIdParent = this.template.querySelectorAll('.order-custom-slot commerce_my_account-order-line-item-fields > .commerce_my_account-orderLineItemFields_orderLineItemFields > div:nth-child(3)');
            Array.from(allSageIdParent).forEach((element)=>{
                var tempEle = document.createElement("div");
                tempEle.innerText = `Sold to account : ${this._accountSageIds[0].Sage_ID__c}`;
                element.appendChild(tempEle);
            });
        })
        .catch(error => {
            // TODO Error handling
            console.log('Error'+error);
        });
        }




}