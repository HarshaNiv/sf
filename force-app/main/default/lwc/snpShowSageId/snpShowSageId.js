import { LightningElement,wire,track } from 'lwc';
import Id from '@salesforce/user/Id';
import getSageId from '@salesforce/apex/SNP_ShowSageIdController.getSageId';
/**
 * @slot Order-history-std-comp
 */

export default class SnpShowSageId extends LightningElement {
    @track sageId;


    reflectSageId(){
        setTimeout(()=>{
            let allTarget = this.template.querySelectorAll(".order-list-wrapper [role='grid'] [role='row'] div.slds-grid >* >.slds-grid");

            Array.from(allTarget).map((element)=>{
                let tempElement = document.createElement("div");
                tempElement.setAttribute("class","sage-id");
                tempElement.innerText=`Sold to account : ${this.sageId}`;
                //console.log("my ele is "+ele+this.sageId+tempElement);
                element.appendChild(tempElement);
            });
        },900);
    }

    @wire(getSageId, {userId:Id})
    sageId ({error, data}) {
        if (error) {
            // TODO: Error handling
            alert(JSON.stringify(error));
        } else if (data) {
            //alert(JSON.stringify(data));
            this.sageId=data;
            this.reflectSageId();

        }
    }

    renderedCallback(){
        this.reflectSageId();
    }
}