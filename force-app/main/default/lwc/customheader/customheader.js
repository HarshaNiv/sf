import { LightningElement,api } from 'lwc';
/**
 * @slot PromotionBanner
 * @slot Logo
 * @slot Search
 * @slot Navigation
 * @slot ProfileMenu
 * @slot CartBadge
 */
export default class Customheader extends LightningElement {
    @api textColor;
    get getTextStyle(){
        return `background-color:${this.textColor}`;
      }
}