import { LightningElement, wire, track, api } from 'lwc';
import { CartSummaryAdapter } from "commerce/cartApi";
import { CartItemsAdapter } from "commerce/cartApi";
import { deleteRecord } from 'lightning/uiRecordApi';

export default class PP_cartpage extends LightningElement {
    currentCartId;
 
    @wire(CartSummaryAdapter)
    setCartSummary({ data, error }) {
        if (data) {
            this.currentCartId = data.cartId;
            console.log('OUTPUT : cartID - ', this.currentCartId);
        } else if (error) {
            console.error(error);
        }
    }
    
    @wire(CartItemsAdapter)
    cartItemsInCurrentCart({ data, error }) {
        if (data) {
            console.log('OUTPUT cartItems: ', data);
        } else if (error) {
            console.error('Error CartItemsAdapter - ', JSON.stringify(error));
        }
    }
 
    handleClearCart(){
        deleteRecord(this.currentCartId)
        .then(result =>{
            console.log('OUTPUT : Current cart deleted');
        }).catch(error =>{  
            console.log('OUTPUT : Error', error);
        })
    }
}