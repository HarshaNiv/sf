/**
 * @description          Search Bar 
 * @Author               Krishnamurthy Donta
 * @Createddate          17-06-2023
 * @ControllerClass      Product2Controller
 * @TestClass            Product2ControllerTest 
 * @modificationSummary  Nameofmodifier - modification date - modifications made
 */

import { LightningElement, track, api } from 'lwc';

export default class PromoBanner extends LightningElement {
  @track showBanner = true;
  @api backgroundColor;
  @api promoBannerMsg;
  @api fontSize;

  get dynamicStyleForText() {
    return `font-size: ${this.fontSize}px;`;
  }
  
  get dynamicStyleForColor() {
    return `background-color: ${this.backgroundColor};`
  }
  
  handleClose() {
    this.showBanner = false;

  }
  renderedCallback(){
    
  }
}