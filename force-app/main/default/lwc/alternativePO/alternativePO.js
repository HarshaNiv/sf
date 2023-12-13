import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { CheckoutInformationAdapter, placeOrder, simplePurchaseOrderPayment,CheckoutComponentBase,useCheckoutComponent,restartCheckout} from "commerce/checkoutApi";

import MAIN_TEMPLATE from "./alternativePO.html";
import STENCIL from "./alternativePOstencil.html";
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import COUNTRY_CODE from '@salesforce/schema/Account.BillingCountryCode';
import BILLING_STATE_CODE from '@salesforce/schema/Account.BillingStateCode';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import PoNumber from '@salesforce/apex/Snp_CustomerPO.PoNumber';
import UserId from '@salesforce/user/Id';
import guestUser from '@salesforce/user/isGuest';
import { RefreshEvent } from "lightning/refresh";
const CheckoutStage = {
    CHECK_VALIDITY_UPDATE: 'CHECK_VALIDITY_UPDATE',
    REPORT_VALIDITY_SAVE: 'REPORT_VALIDITY_SAVE',
    BEFORE_PAYMENT: 'BEFORE_PAYMENT',
    PAYMENT: 'PAYMENT',
    BEFORE_PLACE_ORDER: 'BEFORE_PLACE_ORDER',
    PLACE_ORDER: 'PLACE_ORDER'
};
export default class AlternativePO extends NavigationMixin(useCheckoutComponent(LightningElement)) {
    isLoading = false;
    firstLoad = false;
    _checkoutMode = 1;

    @track checkoutId;
     @track sampleValue='';
     @track listsize='';
    @track shippingAddress={};
    @track showError = false;
    @track error;
    @track ponum;
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
    @wire(PoNumber)
    wiredPoNumber({ error, data }) {
        if (data) {
            this.listsize= data;
            console.log('ponums------------> ' + JSON.stringify(data));
            console.log('ponum------------>' + this.listsize);
            // You can perform additional logic here if needed
        } else if (error) {
            console.log('Section id------------>' + error);
            // TODO: Handle error
        }
    }
    @wire(CheckoutInformationAdapter, {})
    checkoutInfo({ error, data }) {
        this.isPreview = this.isInSitePreview();
            if (!this.isPreview) {
                this.isLoading = true;
                console.log("simplePurchaseOrder checkoutInfo");
                if (data) {
                    this.checkoutId = data.checkoutId;
                    console.log("simplePurchaseOrder checkoutInfo checkoutInfo: " +JSON.stringify(data));
                    this.shippingAddress = data.deliveryGroups.items[0].deliveryAddress;
                    if (data.checkoutStatus == 200) {
                        console.log("simplePurchaseOrder checkoutInfo checkoutInfo 200");
                        this.isLoading = false;
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

    stageAction(PLACE_ORDER){
        this.sample=this.refs.poInput;
        this.sampleValue=this.sample.value;
        if(this.sample.value==''){
            this.sample.reportValidity();
            this.error='';
            restartCheckout();
         }
         debugger;
         for (let opportunityRecord of this.listsize){
            if(this.sampleValue == opportunityRecord.Name){
                this.ponum=1;
                console.log('this.ponum--->'+this.ponum);
            }
         }
        //else{
        //     this.placeOrder();
        // }
        if(this.checkval == false){
            this.country_Input=this.refs.countryInput;
              this.address_Input=this.refs.addressInput;
              this.city_Input=this.refs.cityInput;
              this.province_Input=this.refs.provinceInput;
              this.postal_Input=this.refs.postalInput;
              console.log('this.country_Input--->'+this.country_Input.value+'this.address_Input---->'+this.address_Input.value+'this.city_Input--->'+this.city_Input.value+'this.province_Input-->'+this.province_Input.value+'this.postal_Input--->+'+this.postal_Input.value);
              console.log('this.refs.poInput------->>>>>'+JSON.stringify(this.sample.value));
             console.log('this.city_Input-->'+JSON.stringify(this.city_Input));
              if(this.sample.value !='' && this.country_Input.value != '' && this.address_Input.value != '' && this.city_Input.value != '' && this.postal_Input.value != '' ){
                this.shippingAddress={
                    "city":this.city_Input.value,
                    "companyName":this.shippingAddress.companyName,
                   "country":this.country_Input.value,
                    "firstName":this.shippingAddress.firstName,
                    "lastName":this.shippingAddress.lastName,
                     "name":this.shippingAddress.name,
                     "postalCode":this.postal_Input.value,
                    "region":this.province_Input.value,
                     "street":this.address_Input.value
                }
                console.log('this.shippingAddress++------>'+this.shippingAddress)
                console.log('this.shippingAddress+++------>'+JSON.stringify(this.shippingAddress))
                if(this.statedata == true){
                    if(this.province_Input.value ==''){
                       this.province_Input.reportValidity();
                       restartCheckout();
                    }else{
                        this.placeOrder();
                    }
                   }else{
                    this.placeOrder();
                   }
                
              }
             
              if(this.city_Input.value == ''){
                  this.cityinp=true;
              let requriedField=this.template.querySelector('.city-input')
          console.log('requriedField--->'+requriedField);
          requriedField.classList.add('slds-has-error');
          restartCheckout();
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
          restartCheckout();
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
              restartCheckout();
           }
          }
          
              
              if(this.postal_Input.value ==''){
                  this.postalinp=true;
          let requriedField=this.template.querySelector('.postal-input');
          console.log('requriedField--->'+requriedField);
          requriedField.classList.add('slds-has-error');
          restartCheckout();
          }else{
              this.postalinp=false;
              let requriedField = this.template.querySelector('.postal-input');
              if (requriedField.classList.contains('slds-has-error')) {
                  requriedField.classList.remove('slds-has-error');
              }
          }
          if(this.country_Input.value == ''){
            this.country_Input.reportValidity();
            restartCheckout();
          }
        }else{
            this.placeOrder();
        }
    } 

    /**
     * The current checkout mode for this component
     *
     * @type {CheckoutMode}
     */
    @api
    get checkoutMode() {
        return this._checkoutMode;
    }

    /**
     * report validity
     *
     * @returns boolean
     */
    @api
    reportValidity() {
        debugger;
        console.log('simplePurchaseOrder: in reportValidity');
        const purchaseOrderInput = this.getPurchaseOrderInput().value;
        let isValid = false;

        if (this.ponum==0 || this.ponum=='' || this.ponum==null) {
            console.log('simplePurchaseOrder purchaseOrderInput: '+JSON.stringify(purchaseOrderInput));
            isValid = true;
            this.showError = false; 
        } else {
            console.log('simplePurchaseOrder purchaseOrderInput not found: '+JSON.stringify(purchaseOrderInput));
            this.showError = true;
            this.ponum=0;
            this.error = "Please enter a correct purchase order number.";
            restartCheckout();
        }
        return isValid;
    }

    /**
    * checkout save
    */
    @api
    async checkoutSave() {
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
               this.navigateToOrder(result.orderReferenceNumber);
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
        return this.checkoutSave();
    }

    /**
     * complete payment
     */
    @api
    async completePayment(){
        let address = this.shippingAddress;
        const purchaseOrderInputValue = this.getPurchaseOrderInput().value;
        console.log('this.refs.poInput.value--'+purchaseOrderInputValue);
        let po = await simplePurchaseOrderPayment(this.checkoutId, purchaseOrderInputValue, address);
        return po;
    }


    /**
     * Get purchase order input
     * @returns purchaseOrderInput - payment component
     */
    getPurchaseOrderInput() {
        console.log('this.refs.poInput--'+this.refs.poInput);
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
        console.log('provinceval--->'+provinceval);
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