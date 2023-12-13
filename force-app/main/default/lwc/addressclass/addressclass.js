import { LightningElement,wire,api,track} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import COUNTRY_CODE from '@salesforce/schema/Account.BillingCountryCode';
import BILLING_STATE_CODE from '@salesforce/schema/Account.BillingStateCode';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from "@salesforce/schema/Account"

export default class Addressclass extends LightningElement {
    _countries = [];
    _countryToStates = {};

    @track selectedCountry;
    selectedState;

    @api recordId;
    @api objectApiName;
  
    @track objectInfo;
  
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo({data,error}){
        if(data){
        debugger;
      // Returns a map of record type Ids
      const rtis = data.recordTypeInfos;
      const sample= data.defaultRecordTypeId;
      console.log('sample------------>'+sample);      
      return Object.keys(rtis).find((rti) => rtis[rti].name === "Special Account");
    }
    if(error){
        console.log('error'+ error);
    }
}

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: COUNTRY_CODE
    })
    wiredCountires({ data }) {
        console.log('datacountries'+ JSON.stringify( data ) );
        this._countries = data?.values;
    }
    @wire(getPicklistValues, { recordTypeId: '0125h000000C2gyAAC', fieldApiName: BILLING_STATE_CODE })
    wiredStates({ data }) {
        if (!data) {
            return;
        }
        console.log('data'+JSON.stringify(data));
        // console.log('controllervalues'+Object.entries(JSON.stringify(data).controllerValues));
        // console.log('map'+Object.entries(JSON.stringify(data).controllerValues).map(([key, value]) => [value, key]));
        const validForNumberToCountry = Object.fromEntries(Object.entries(data.controllerValues).map(([key, value]) => [value, key]));
        console.log('validForNumberToCountry'+JSON.stringify(validForNumberToCountry));
        this._countryToStates = data.values.reduce((accumulatedStates, state) => {
            console.log('state---------'+JSON.stringify(state));
            const countryIsoCode =  
            console.log('countryIsoCode---------'+countryIsoCode);
            return { ...accumulatedStates, [countryIsoCode]: [...(accumulatedStates?.[countryIsoCode] || []), state] };
        }, {});
        console.log('this._countryToStates'+JSON.stringify(this._countryToStates));
    }

    get countries() {
        return this._countries;
    }

    get states() {
        return this._countryToStates[this.selectedCountry] || [];
    }

    handleCountry(e) {
        debugger;
        this.selectedCountry = e.detail.value;
        console.log('this.selectedCountry'+ this.selectedCountry);
        
    }

    handleState(e) {
        this.selectedState = e.detail.value;
    }
   
}