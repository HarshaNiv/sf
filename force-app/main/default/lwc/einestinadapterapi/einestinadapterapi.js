import { LightningElement ,wire} from 'lwc';
import { ProductRecommendationsAdapter, ANCHOR_TYPES } from 'commerce/recommendationsApi';

export default class Einestinadapterapi extends LightningElement {
    productdata;
    @wire(ProductRecommendationsAdapter, { recommenderName: 'similar-products', anchorType: ANCHOR_TYPES.PRODUCT,anchorValue: ['01t7R000007l0Z4QAI']})
    wiredProductData({ data, error }) {
        if (data) {
            debugger;
            this.productdata = data;
            console.log('this.productdata-->'+JSON.stringify(this.productdata));
            // Handle successful data retrieval here
        } else if (error) {
            // Handle error
            console.error('Error fetching product recommendations:', error);
        }
    }

}