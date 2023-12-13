import { LightningElement, wire, api } from 'lwc';
import getProductData from '@salesforce/apex/Snp_pdp_productDetailsController.getProductData';
  /**
  * @slot productName
  * @slot varients
  * @slot tierDiscount
  * @slot SKU
  * @slot Price
  *@slot quantity
  *@slot GetQuote
*/
export default class Snp_pdp_productDetails extends LightningElement {
  @api recordId;
  @api Product;
  productFullDescription;
  productDescription;
  showDetailSection = false;
  showMore = true;
  showLess = false;
  showTierDiscountSection = false;

  renderedCallback(){
    // debugger;
    const trierDiscountSection = this.template.querySelector('.commerce_product_details-pricingTiers_pricingTiers');
    if(trierDiscountSection !== null){
      this.showTierDiscountSection = true;
    }

    const options = this.template.querySelectorAll('select');
    console.log('options- ' + options);
  }

  connectedCallback(){    
    // console.log('Snp_pdp_productDetails recordId- ', this.recordId);
    // console.log('Snp_pdp_productDetails product Details- ', this.ProductDetails);
    getProductData({productId : this.recordId})
    .then(result => {
      this.productFullDescription = result.Description;
      if(result.Description.length > 225){
        let desc = result.Description.slice(0, 225);
        this.productDescription = desc;
      }else{
        this.showMore = false;
        this.showLess = false;
        this.productDescription = result.Description;
      }
      this.showDetailSection = true;       
    })
    .catch(error => {
        // console.log('Snp_pdp_productDetails Error- ',JSON.stringify(error));
    });
  }
  handleSeeMore(){
    this.showMore = false;
    this.showLess = true;
    this.productDescription = this.productFullDescription;
  }
  handleSeeLess(){
    this.showMore = true;
    this.showLess = false;
    this.productDescription = this.productFullDescription.slice(0, 225);
  }
}