import { LightningElement,wire,track } from 'lwc';
// import AddressemessageChannel from '@salesforce/messageChannel/AddressemessageChannel__c';
// import {publish, MessageContext} from 'lightning/messageService'
import contactpoint from '@salesforce/apex/SNP_Addresses.contactpoint';
import getid from '@salesforce/apex/SNP_Addresses.getid';
import UserId from '@salesforce/user/Id';
export default class SNP_Addesses extends LightningElement {
    // @wire(MessageContext)
    // messageContext;
    addressdata;
    addressTypeParam;
    @track addressType1;
    getid;
    finaldata;
    finaldata1=[];
    finaldata2=[];
    uniqueDataArray = [];
    uniqueDataArray1=[];
    additionaldata1;
    additionaldata2;
    shippingvalid=false
    buttonvalid=false;
    buttonvalid1=false;

    isModalOpen=false;
    deleteOpen(event)
    {
        this.getid=event.currentTarget.dataset.id;
        this.isModalOpen=true;
    }
    deleteform(){
        getid({recordid:this.getid})
        .then((result)=>{
            console.log('result---------->'+ result);
            let refreshurl=window.location.href;
            window.location.href=refreshurl;
            window.location.href;
        })
        .catch((error) =>{
            console.log('error---------->'+ error);
            alert('Error--->'+error);
            this.isModalOpen = false;
        })
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;   
    }
    
    // for show more and show less 
    value='Show More';
    showmore(){
        this.buttonvalid= !this.buttonvalid;
        this.additionaldata1=this.addressdata.slice(6);
        if(this.value=='Show More')
        {
            this.value='Show less';
        }
        else if(this.value=='Show less')
        {
            this.value='Show More';     
        }
    }

connectedCallback(){
    debugger;
    let formurl=window.location.href;   
    console.log(formurl);
    const urlParams = new URLSearchParams(window.location.search);
     this.addressTypeParam = urlParams.get('addressType');
     console.log('Address type --', this.addressTypeParam);
     //const addressTypeParam = formurl.state.c__addressType;
    console.log('addressTypeParam'+ this.addressTypeParam);
    if(this.addressTypeParam !=null){
        this.addressType1=this.addressTypeParam;
    }else{
        this.addressType1='Shipping'
    }
  
}
     
    //shippingvalid1=false
    @wire(contactpoint,{userid:UserId,addtype:'$addressType1'})
    contactpoint({data,error}){
        debugger;
    if(data){
        this.addressdata=data;
        if(this.addressdata != ''){
            this.finaldata=this.addressdata.slice(0,6);
            console.log('addressdata------------>'+ this.addressdata)
            if(this.addressType1 =='Shipping'){
                let activetab1=this.template.querySelector('.tab-1');
                console.log(activetab1);
                activetab1.classList.add('active');
            }else if(this.addressType1 =='Billing'){
                let activetab2=this.template.querySelector('.tab-2');
                console.log(activetab2);
                activetab2.classList.add('active');
            }
            this.shippingvalid=true;
        }else{
            this.shippingvalid=false;
        }
         
       
    }
    else if(error){
        console.log(error)
    }
}
// connectedCallback(){
//     this.tab1Handler();
// }
    tab1Handler(event) {
        this.addressType1=event.target.dataset.name;
        if(this.addressType1 =='Shipping'){
            let active_tab1=this.template.querySelector('.tab-1');
            console.log(active_tab1);
            active_tab1.classList.add('active');
            let tab2=this.template.querySelector('.tab-2');
        if(tab2.classList.contains('active')){
            tab2.classList.remove('active')
        }
        }else if(this.addressType1 =='Billing'){
            let active_tab2=this.template.querySelector('.tab-2');
            console.log(active_tab2);
            active_tab2.classList.add('active');
            let tab1=this.template.querySelector('.tab-1');
            if(tab1.classList.contains('active')){
                tab1.classList.remove('active')
            }
        } 
        this.buttonvalid=false
        console.log("tab1");
    } 
       
        editform(event){
            debugger;
            let formid = event.currentTarget.dataset.id;
            console.log('addressformId--->'+formid)
            var newurl = window.location.pathname;
            var pathurl=newurl.replace('/addresses', '')
            window.location.href= window.location.origin+ pathurl+ "/addressForm?addressId="+formid;
             window.location.href;
            // let formid = event.currentTarget.dataset.id;
            // let addressformId={addressformId: formid}
            // console.log('addressformId--->'+JSON.stringify(addressformId))
            // publish(this.messageContext, AddressemessageChannel, addressformId);
            
        }
}