/* eslint-disable no-console */
import { LightningElement, api, track, wire } from "lwc";
import getAccountProducts from "@salesforce/apex/r3AccountProductController.getAccountProducts";
// import { getRecord } from "lightning/uiRecordApi";
//import { registerListener, unregisterAllListeners } from 'c/pubsub';
//import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from "@salesforce/apex";

// const fields = [
//     "PriceBookEntry.Name",
//     "PriceBookEntry.CurrencyIsoCode",
//     "PriceBookEntry.UnitPrice",
//     "PriceBookEntry.ProductCode",
//     "PriceBookEntry.Product2.Name",
//     "PriceBookEntry.Product2.Description",
//     "PriceBookEntry.Sell_Price_1__c",
//     "PriceBookEntry.Sell_Price_2__c",
//     "PriceBookEntry.Sell_Price_3__c",
//     "PriceBookEntry.Sell_Price_4__c",
//     "PriceBookEntry.Sell_Price_5__c",
//     "PriceBookEntry.Sell_Price_6__c",
//     "PriceBookEntry.Sell_Price_7__c",
//     "PriceBookEntry.Sell_Price_8__c",
//     "PriceBookEntry.Sell_Price_9__c",
//     "PriceBookEntry.Sell_Price_10__c",
//     "PriceBookEntry.Volume_1__c",
//     "PriceBookEntry.Volume_2__c",
//     "PriceBookEntry.Volume_3__c",
//     "PriceBookEntry.Volume_4__c",
//     "PriceBookEntry.Volume_5__c",
//     "PriceBookEntry.Volume_6__c",
//     "PriceBookEntry.Volume_7__c",
//     "PriceBookEntry.Volume_8__c",
//     "PriceBookEntry.Volume_9__c",
//     "PriceBookEntry.Volume_10__c"
// ];

export default class r3AccountProducts extends LightningElement {
    @api recordId;
    @track prods;
    @track errorMsg;
    // @track property;
    // @track price;
    // @track beds;
    @track searchCriteria = "";
    //@api priceRange = '100000';
    @track cardTitle;
    @track noData;
    wiredRecords;

    @wire(
        getAccountProducts, // fires before component render
        {
            recordId: "$recordId", // account Id (reactive '$')
            searchCriteria: "$searchCriteria"
        }
    )
    wiredProps(value) {
        this.wiredRecords = value;
        if (value.error) {
            this.errorMsg = value.error;
            console.error(this.errorMsg);
        } else if (value.data) {
            this.prods = value.data;
            if (this.prods && this.prods.length === 0) {
                this.noData = true;
            } else {
                this.noData = false;
            }
        }
    }

    // @wire(getRecord, { recordId: "$recordId", fields })
    // wiredProperty(value) {
    //     if (value.data) {
    //         this.property = value.data;
    //         this.price = this.property.fields.Price__c.value;
    //         this.beds = this.property.fields.Beds__c.value;
    //     } else if (value.error) {
    //         console.error(value.error);
    //     }
    // }

    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.searchCriteria = evt.target.value;
            refreshApex(this.wiredRecords);
        }
    }

    //@wire(CurrentPageReference) pageRef;

    //connectedCallback() {
    //registerListener('propertyUpdated', this.refreshSelection, this);
    //}

    //disconnectedCallback() {
    //unregisterAllListeners(this);
    //}

    //refreshSelection() {
    //refreshApex(this.wiredRecords);
    //}

    //renderedCallback() {
    //this.cardTitle = 'Similar Properties by ' + this.searchCriteria;
    //}
}