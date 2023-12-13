import { LightningElement } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ANNUALREVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import BillingAddress_FIELD from '@salesforce/schema/Account.BillingAddress'

export default class RecordForm extends LightningElement {
    objectApiName = ACCOUNT_OBJECT;
    fields = [NAME_FIELD, PHONE_FIELD, ANNUALREVENUE_FIELD,BillingAddress_FIELD];
}