import { LightningElement, wire, api, track } from 'lwc';
import getContent from '@salesforce/apex/ManagedContentController.getContent';
import basePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';

export default class SnpNewlyLaunchedSection extends NavigationMixin(LightningElement) {
    @api contentId;
    @api title;
    @track url;
    _cmsData;

    // Wire method to fetch content based on the provided parameters
    @wire(getContent, {
        contentId: '$contentId',
        page: 0,
        pageSize: 1,
        language: 'en_US',
        filterby: ''
    })
    wiredContent({ data, error }) {
        if (data) {

            this._cmsData = data;
            this.url = `${basePath}/sfsites/c${this._cmsData.source?.unauthenticatedUrl ?? ''}`;

        }
        else if (error) {
            console.error('Error: ' + JSON.stringify(error));
        }
    }

    // Handles the product click action
    handleProductClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '01t7R000008PNPpQAO', //Fetch dynamically product id based on product image
                objectApiName: 'Product2',
                actionName: 'view'
            }
        });


    }
}