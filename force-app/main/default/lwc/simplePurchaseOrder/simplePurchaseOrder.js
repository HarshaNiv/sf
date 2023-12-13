import { LightningElement,track,api,wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { CheckoutInformationAdapter, placeOrder, simplePurchaseOrderPayment } from "commerce/checkoutApi";

import MAIN_TEMPLATE from "./simplePurchaseOrder.html";
import STENCIL from "./simplePurchaseOrderStencil.html";
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import COUNTRY_CODE from '@salesforce/schema/Account.BillingCountryCode';
import BILLING_STATE_CODE from '@salesforce/schema/Account.BillingStateCode';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import PoNumber from '@salesforce/apex/Snp_CustomerPO.PoNumber';
import UserId from '@salesforce/user/Id';
import guestUser from '@salesforce/user/isGuest';

export default class SimplePurchaseOrder extends useCheckoutComponent(
    LightningElement
  ) {
    isLoading = false;
    firstLoad = false;
    _checkoutMode = 1;

    @track checkoutId;
    @track shippingAddress={};
    @track showError = false;
    @track error;
    @track sample;
    @track ordernumber;
    @track checkinp1;
    @track cityinp=false;
    @track addressinp=false;
    @track provinceinp=false;
    @track postalinp=false;
    @track postal_Input;
    @track province_Input;
    @track city_Input;
    @track address_Input;
    @track country_Input ='';
    @track checkval=true;
    @track countryinp1=false;
    @track options=[];
    @track objectInfo;
    // @track listCountry;
    @track Recordtype;
    @track _countryToStates;
    @track _countries;
    @track selectedCountry;
    @track statelist;
    @track statedata=false;
     @track ponum='';
    @api headerLabel;
    @api inputLabel;
    @api placeholderLabel;
    @api hideHeading = false;
    @api recordId;
    @api objectApiName;

    render() {
        if(this.isLoading){
            return STENCIL;
        }else{
            return MAIN_TEMPLATE;
        }
    }

    /**
     * 
     * Get the CheckoutData from the standard salesforce adapter
     * Response is expected to be 202 while checkout is starting
     * Response will be 200 when checkout start is complete and we can being processing checkout data 
     * 
     */
    // options = 
    //     [
    //         { label: 'New', value: 'new' },
    //         { label: 'In Progress', value: 'inProgress' },
    //         { label: 'Finished', value: 'finished' },
    //     ];
    @wire(CheckoutInformationAdapter, {})
    checkoutInfo({ error, data }) {
        this.isPreview = this.isInSitePreview();
        console.log('this.isPreview------->+'+this.isPreview);
            if (!this.isPreview) {
                this.isLoading = true;
                console.log("simplePurchaseOrder checkoutInfo");
                if (data) {
                    this.checkoutId = data.checkoutId;
                    console.log("simplePurchaseOrder checkoutInfo checkoutInfo: " +JSON.stringify(data));
                    this.shippingAddress = data.deliveryGroups.items[0].deliveryAddress;
                    console.log(' this.shippingAddress---------->'+ this.shippingAddress );
                    if (data.checkoutStatus == 200) {
                        console.log("simplePurchaseOrder checkoutInfo checkoutInfo 200");
                        this.isLoading = false;
                        debugger;
                    }
                } else if (error) {
                    console.log("##simplePurchaseOrder checkoutInfo Error: " + error);
                }
            } else {
                this.isLoading = false;
            }
    }
    /*objectInfo*/
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo({ data, error }) {
        if (data) {
            const rtis = data.recordTypeInfos;
            this.Recordtype = data.defaultRecordTypeId;
            console.log('sample------------>' + this.Recordtype);
        }
        if (error) {
            console.log('error' + error);
        }
    }
    @wire(getPicklistValues, {
        recordTypeId: '$Recordtype',
        fieldApiName: COUNTRY_CODE
    }) wiredCountires({ data }) {
        console.log('datacountries1' + JSON.stringify(data));
        this._countries = data.values;
        console.log('datacountries' + this._countries);
    }


    @wire(getPicklistValues, { recordTypeId: '$Recordtype', fieldApiName: BILLING_STATE_CODE })
    wiredStates({ data }) {
        if (!data) {
            return;
        }
        console.log('data' + JSON.stringify(data));
        const validForNumberToCountry = Object.fromEntries(Object.entries(data.controllerValues).map(([key, value]) => [value, key]));
        console.log('validForNumberToCountry' + JSON.stringify(validForNumberToCountry));
        this._countryToStates = data.values.reduce((accumulatedStates, state) => {
            const countryIsoCode = validForNumberToCountry[state.validFor[0]];
            return { ...accumulatedStates, [countryIsoCode]: [...(accumulatedStates?.[countryIsoCode] || []), state] };
        }, {});
        console.log('this._countryToStates' + JSON.stringify(this._countryToStates));
    }
      /*objectInfo*/
    // 

    /**
     * The current checkout mode for this component
     *
     * @type {CheckoutMode}
     */
    @api
    get checkoutMode() {
        debugger;
        return this._checkoutMode;
    }

    /**
     * report validity
     *
     * @returns boolean
     */
    @api
    reportValidity() {
        console.log('simplePurchaseOrder: in reportValidity');
        debugger;
        const purchaseOrderInput = this.sample.value;
        let isValid = false;

        if (purchaseOrderInput ==this.ponum) {
            console.log('simplePurchaseOrder purchaseOrderInput: '+JSON.stringify(purchaseOrderInput));
            isValid = true;
            this.showError = false;
        } else {
            console.log('simplePurchaseOrder purchaseOrderInput not found: '+JSON.stringify(purchaseOrderInput));
            this.showError = true;
            this.error = "Please enter a correct purchase order number.";
        }
        return isValid;
    }

    /**
    * checkout save
    */
    @api
    async checkoutSave() {
        debugger;
        console.log('simplePurchaseOrder: in checkout save');

        if (!this.reportValidity()) {
            throw new Error('Required data is missing');
        }

        try {
            console.log('simplePurchaseOrder checkoutSave in try');
            await this.completePayment();
            const result = await placeOrder();

            console.log('simplePurchaseOrder checkoutSave result: '+JSON.stringify(result));

            if (result.orderReferenceNumber) {
                this.ordernumber=result.orderReferenceNumber;
              this.navigateToOrder(this.ordernumber);
               
            } else {
                throw new Error("Required orderReferenceNumber is missing");
            }
        } catch (e) {
            throw e;
        }
    }
   
    /**
     * place order
     */
    @api
    async placeOrder() {
        debugger;
        return this.checkoutSave();
    }

    /**
     * complete payment
     */
    @api
    async completePayment(){
        debugger;
        let address=[];
        address = this.shippingAddress;
        const purchaseOrderInputValue = this.ponum;
       console.log('address--->'+address);
       console.log('this.shippingAddress-->'+this.shippingAddress);
       console.log('purchaseOrderInputValue'+purchaseOrderInputValue);
        let po = await simplePurchaseOrderPayment(this.checkoutId, purchaseOrderInputValue, address);
        return po;
    }


    /**
     * Get purchase order input
     * @returns purchaseOrderInput - payment component
     */
    getPurchaseOrderInput() { 
        debugger;
        console.log('this.refs.poInput------->'+JSON.stringify(this.refs.poInput));
        return this.refs.poInput;
       
    } 

    /**
     * Determines if you are in the experience builder currently
     */
    isInSitePreview() {
        let url = document.URL;

        return (
        url.indexOf("sitepreview") > 0 ||
        url.indexOf("livepreview") > 0 ||
        url.indexOf("live-preview") > 0 ||
        url.indexOf("live.") > 0 ||
        url.indexOf(".builder.") > 0
        );
    }

    /**
     * Naviagte to the order confirmation page
     * @param navigationContext lightning naviagtion context
     * @param orderNumber the order number from place order api response
     */
    navigateToOrder(orderNumber) {
        this[NavigationMixin.Navigate]({
        type: "comm__namedPage",
        attributes: {
            name: "Order"
        },
        state: {
            orderNumber: orderNumber
        }
        });
    }
    // rendercallback(){
    //     let sample=this.refs.poInput;
    //     console.log('this.refs.poInput------->'+sample);
    // }
    changeinp(){ 
        this.sample=this.refs.poInput;
        debugger;
        if(this.sample.value==''){
            this.sample.reportValidity();
            this.error='';
        }
        if(this.checkval == false){
      this.country_Input=this.refs.countryInput;
        this.address_Input=this.refs.addressInput;
        this.city_Input=this.refs.cityInput;
        this.province_Input=this.refs.provinceInput;
        this.postal_Input=this.refs.postalInput;
        console.log('this.country_Input--->'+this.country_Input.value+'this.address_Input---->'+this.address_Input.value+'this.city_Input--->'+this.city_Input.value+'this.province_Input-->'+this.province_Input.value+'this.postal_Input--->+'+this.postal_Input.value);
        console.log('this.refs.poInput------->>>>>'+JSON.stringify(this.sample.value));
       console.log('this.city_Input-->'+JSON.stringify(this.city_Input));
        if(this.sample.value !='' && this.country_Input.value != '' && this.address_Input.value != '' && this.city_Input.value != '' && this.province_Input.value != '' && this.postal_Input.value != '' ){
        this.handleorder();
        }
       
        if(this.city_Input.value == ''){
            this.cityinp=true;
        let requriedField=this.template.querySelector('.city-input')
    console.log('requriedField--->'+requriedField);
    requriedField.classList.add('slds-has-error');
}else{
    this.cityinp=false;
    let requriedField = this.template.querySelector('.city-input');
    if (requriedField.classList.contains('slds-has-error')) {
        requriedField.classList.remove('slds-has-error');
    }
}
if(this.address_Input.value ==''){
    this.addressinp=true;
    let requriedField=this.template.querySelector('.area-inp')
    console.log('requriedField--->'+requriedField);
    requriedField.classList.add('slds-has-error');
    }else{
        this.addressinp=false;
        let requriedField = this.template.querySelector('.area-inp');
        if (requriedField.classList.contains('slds-has-error')) {
            requriedField.classList.remove('slds-has-error');
        }
    }
    if(this.statedata == true){
     if(this.province_Input.value ==''){
        this.province_Input.reportValidity();
     }
    }else if(this.statedata == false){
        if(this.province_Input.value ==''){
            this.provinceinp=true;
            let requriedField=this.template.querySelector('.province-inp');
            console.log('requriedField--->'+requriedField);
            requriedField.classList.add('slds-has-error');
            }else{
                this.provinceinp=false;
                let requriedField = this.template.querySelector('.province-inp');
                if (requriedField.classList.contains('slds-has-error')) {
                    requriedField.classList.remove('slds-has-error');
                }
         }
     }
    
        
        if(this.postal_Input.value ==''){
            this.postalinp=true;
    let requriedField=this.template.querySelector('.postal-input');
    console.log('requriedField--->'+requriedField);
    requriedField.classList.add('slds-has-error');
    }else{
        this.postalinp=false;
        let requriedField = this.template.querySelector('.postal-input');
        if (requriedField.classList.contains('slds-has-error')) {
            requriedField.classList.remove('slds-has-error');
        }
    }
    debugger;
    // if(this.country_Input.value == ''){
    //     // let requriedField1 = this.template.querySelector('.country-class .slds-combobox__input');
    //     // console.log('requriedField1-----+>'+requriedField1);
    //     // requriedField1.classList.add('sample');
    //     this.country_Input.setCustomValidity('Complete this field.');
    //     //this.countryinp1=true;
    //     // let requriedField = this.template.querySelectorAll('.slds-combobox__input');
    //     // console.log('requriedField-----+>'+requriedField);
    //     // requriedField.classList.add('slds-has-error');
    // }else{
    //     this.country_Input.setCustomValidity('');
    // }
   this.country_Input.reportValidity();
    debugger;
    // if(this.opt != 'inProgress'){
    //     const item = this.template.querySelector(".selectclass1")
    //     item.style.border = '1px solid red';
    //     // item.setCustomValidity('Complete this field.');
    //     // item.reportValidity();
    //     this.countryinp1=true;
    // }
    }else{
        this.handleorder();
    }
   
    }
    handleorder(){
        PoNumber({userid:UserId})
        .then((result) => {
            this.ponum=result;
            this.placeOrder(); 
            console.log('ponums------------>'+JSON.stringify(result));
            console.log('ponum------------>' +this.ponum);
    })
    .catch((error) => {
        // TODO Error handling
        //alert('Section id------------>'+JSON.stringify(error));
        console.log('Section id------------>' +error);
    });
}
    orderpage(){
        this.navigateToOrder(this.ordernumber);
    }
    checkinp(event){
        let cityval=event.target.value;
        console.log('cityval---'+cityval);
        if(cityval==''){
        this.checkinp1="form-error-01"
        this.cityinp=true;
        let requriedField=this.template.querySelector('.city-input')
        console.log('requriedField--->'+requriedField);
        requriedField.classList.add('slds-has-error');
        }else{
            this.cityinp=false;
            let requriedField = this.template.querySelector('.city-input');
            if (requriedField.classList.contains('slds-has-error')) {
                requriedField.classList.remove('slds-has-error');
            }
        }
    }
    textareainp(event){
        let addressval=event.target.value;
        if(addressval==''){
        this.addressinp=true;
        let requriedField=this.template.querySelector('.area-inp')
        console.log('requriedField--->'+requriedField);
        requriedField.classList.add('slds-has-error');
        }else{
            this.addressinp=false;
            let requriedField = this.template.querySelector('.area-inp');
            if (requriedField.classList.contains('slds-has-error')) {
                requriedField.classList.remove('slds-has-error');
            }
        }
    }
    provinceinp1(event){
        debugger;
        let provinceval=event.target.value;
        if(provinceval==''){
        this.provinceinp=true;
        let requriedField=this.template.querySelector('.province-inp');
        console.log('requriedField--->'+requriedField);
        requriedField.classList.add('slds-has-error');
        }else{
           this.provinceinp=false;
            let requriedField = this.template.querySelector('.province-inp');
            if (requriedField.classList.contains('slds-has-error')) {
                requriedField.classList.remove('slds-has-error');
            }
        }
    }
    postalinp1(event){
        let postalval=event.target.value;
        if(postalval==''){
        this.postalinp=true;
        let requriedField=this.template.querySelector('.postal-input');
        console.log('requriedField--->'+requriedField);
        requriedField.classList.add('slds-has-error');
        }else{
            this.postalinp=false;
            let requriedField = this.template.querySelector('.postal-input');
            if (requriedField.classList.contains('slds-has-error')) {
                requriedField.classList.remove('slds-has-error');
            }
        }
    }
    checkboxinp(event) {
        // debugger;
        this.checkval = event.target.checked;
        console.log('this.checkval----------->' + this.checkval);

    }

    get countries() {
        return this._countries;
    }

    get states() {
        console.log('this._countryToStates[this.selectedCountry]--->'+JSON.stringify(this._countryToStates[this.selectedCountry]));
        return this._countryToStates[this.selectedCountry] || [];
    }

    handleCountry(e) {
        debugger;
        this.selectedCountry = e.detail.value;
        console.log('this.selectedCountry'+ this.selectedCountry);
        this.checkstates();
        
    }

    handleState(e) {
        this.selectedState = e.detail.value;
    }
    checkstates(){
        this.statelist=this._countryToStates[this.selectedCountry] ||[]
        if(this.statelist == ''){
            this.statedata=false;
        }else{
            this.statedata=true;
        }
        console.log("this.statelist-->"+JSON.stringify(this.statelist));
    }
}