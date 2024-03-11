import { LightningElement, wire, track, api } from 'lwc';
import { CartSummaryAdapter } from "commerce/cartApi";
import { CartItemsAdapter } from "commerce/cartApi";
import { deleteRecord } from 'lightning/uiRecordApi';
import{refreshCartSummary} from "commerce/cartApi";
import cartItemsList from '@salesforce/apex/PP_CartClass.cartItemsList'
export default class Pp_Cartpagecmp extends LightningElement {
    currentCartId;
     cartItems=[];
     cartitems1=[];
     cartItemsData=[];
     parentChildList=[];
     itemslist=[];
     finalProductData;
    @wire(CartSummaryAdapter)
    setCartSummary({ data, error }) {
        if (data) {
            this.currentCartId = data.cartId;
            console.log('cartsummary---'+data)
            console.log('OUTPUT : cartID - ', this.currentCartId);
        } else if (error) {
            console.error(error);
        }
    }
    
    @wire(CartItemsAdapter)
    cartItemsInCurrentCart({ data, error }) {
        if (data) {
            console.log('OUTPUT cartItems: ', data);
            this.cartItems = data.cartItems;
            this.fetchCartItems();
   this.cartItemsData = this.cartItems.map(item => {
        return {
            cartId: item.cartItem.cartId,
            cartItemId: item.cartItem.cartItemId,
            name: item.cartItem.name,
            thumbnailImageUrl: item.cartItem.productDetails.thumbnailImage.url,
            quantity: item.cartItem.quantity,
            totalPrice: item.cartItem.totalPrice,
            salesPrice: item.cartItem.salesPrice
        };
    });
    console.log('extractedData---'+JSON.stringify(this.cartItemsData));
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
        async fetchCartItems() {
            console.log('cartid---'+this.cartItems[0].cartItem.cartId);
            const cart_id=this.cartItems[0].cartItem.cartId;
        await cartItemsList({cartid:cart_id})
            .then(result => {
                this.cartitems1= result;
                console.log('result---'+JSON.stringify(this.cartitems1));
                this.cartItemsData.forEach(resultItem => {
                    const parentId = resultItem.cartItemId;

                    // Use filter to find matching cart items in extracted data
                    const matchingItems = this.cartitems1.filter(
                        Item => Item.Parent_Cart_Item__c === parentId
                    );
                    console.log('matchingItems---'+JSON.stringify(matchingItems));
                    if (matchingItems.length > 0) {
                        // Add the parent with an array of matching children to the list
                        var childCartItems=this.cartItemsData.filter(
                        item => matchingItems.some(product => product.Id === item.cartItemId)   
                        )
                        this.parentChildList.push({
                ...resultItem,
                child_Products: (childCartItems)?[childCartItems]:[]
                        });  
                        console.log('childCartItems--'+JSON.stringify(childCartItems));
                    }else{
                         const isResultItemPresent = this.parentChildList.some(parent => 
                        parent.child_Products.some(Item =>Item.some(childItem=> childItem.cartItemId === resultItem.cartItemId))
                    );
                          console.log('isResultItemPresent---'+isResultItemPresent)
                    if (!isResultItemPresent) {
                        // Add resultItem with an empty child_Products array
                         this.parentChildList.push({
                            ...resultItem,
                            child_Products: []
                        });
                    }
                }

               const filteredList = this.parentChildList.filter(parent =>
  !parent.child_Products.some(innerArray =>
    innerArray.some(childItem => childItem.cartItemId !== parent.cartItemId)
             )
                   );
                console.log('filterList--'+JSON.stringify(filteredList));
                        // var existingParentEntry = this.parentChildList.find(entry =>entry.child_Products && 
                        //         entry.child_Products.some(childEntry => childEntry.cartItemId === parentId));
                //console.log('this.parentChildList.child_Products --'+this.parentChildList.child_Products );       
          debugger;              
    //  if(!existingParentEntry){
    //      this.parentChildList.push(resultItem);
    //  }else{
    //  this.parentChildList.push({
    //         resultItem,
    //         child_Products: (childCartItems)?[childCartItems]:[]
    //     });  
    //  }
                     
            });
             console.log('this.parentChildLists--'+JSON.stringify(this.parentChildList));
            // this.finalProductData = JSON.stringify(JSON.parse(this.parentChildList));

            //  console.log('this.parentChildList--'+this.finalProductData);
            // console.log('OUTPUT : parent', this.finalProductData[0].parent_product);
            // console.log('OUTPUT : parent.name', this.finalProductData[0].parent_product.name);

            // //Child product
            // console.log('OUTPUT : child.cartId', this.finalProductData[0].child_Products[0].cartId);


            
          // console.log('this.itemslist--'+JSON.stringify(this.itemslist));
           // return result;
        })
         .catch(error => {
        // TODO Error handling
        console.log('error --> ', error);
        return error;
      });
    }
}