import { LightningElement, track } from 'lwc';
 /**
 * @slot categoryGrid
  *@slot filterSection
*/

export default class Snp_category_page extends LightningElement {
    @track showCategoryFilter = true;
    showGrid(){
        console.log('Hi');
    }
}