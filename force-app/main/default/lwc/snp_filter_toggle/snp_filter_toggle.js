import { LightningElement,api ,wire} from 'lwc';
import getSubCategoryId from '@salesforce/apex/SNP_CheckingForSubCategory.getCategoryId';

 /**
 * @slot Filters
  *@slot SortBySlot
  *@slot PoductTileSlot
  *@slot PoductTileSlotOff
*/

export default class Snp_filter_toggle extends LightningElement {
  @api categoryId ;
  showSubCategryProducts = true;
  showSubCategory = false;
  
  @wire(getSubCategoryId,{
    catgoryIdFormJs:'$categoryId',
  })ShowFilterSection({ data, error }) {
    if (data) {
      this.showSubCategory = true;
    }else if (error) {
    }else{
      this.showSubCategory = false;
    }
  }

  toggleCheckbox(event){
    console.log(event.target.classList);
    this.template.querySelector(".filter-section").classList.toggle('filter-section-modify');
    this.template.querySelector(".toggle-wrapper").classList.toggle('toggle-wrapper-modify');
    this.template.querySelector(".filter-bottom").classList.toggle('filter-bottom-modify');
    this.template.querySelector(".filter-title").classList.toggle('filter-title-modify');
    // this.template.querySelector(".filter-title").classList.toggle('filter-title-modify');
    this.template.querySelector(".product-listing-section").classList.toggle('product-listing-section-modify');
    this.template.querySelector(".switch").classList.toggle('switch-off');
    this.showSubCategryProducts = !this.showSubCategryProducts;
    console.log(this.categoryId);
  }

}