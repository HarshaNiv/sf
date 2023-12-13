import { LightningElement, api, wire, track } from 'lwc';
import checkProductsInventory from '@salesforce/apex/SNP_CheckInventoryController.getAvailableProductQuantity';
export default class SnpCheckInventory extends LightningElement {


    @api productId;
    @track showStockAvailabilityLabel = false;

    @wire(checkProductsInventory, { currentProductId: '$productId' })  //01t0Y00000BgalCQAR
    wiredProduct({ data, error }) {

        const availableQuantity = data !== null ? parseFloat(data) : 0;

        if (availableQuantity <= 0) {
            this.showStockAvailabilityLabel = true;
        }
        else if (error) {
            console.log(JSON.stringify(error));
        }



    }
}