import { LightningElement, wire } from 'lwc';
import { getListInfosByName } from 'lightning/uiListsApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
export default class Getallaccounts extends LightningElement {
    listInfos;
    @wire(getListInfosByName, {
        names: ['${ACCOUNT_OBJECT.objectApiName}.AllAccounts']
    })
    listInfo({ error, data }) {
        if (data) {
            this.listInfos = data.results.map(({ result }) => result);
        }
    }
}