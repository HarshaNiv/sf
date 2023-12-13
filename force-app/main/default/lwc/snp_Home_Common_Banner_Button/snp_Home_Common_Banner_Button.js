/**
 * @description          On Hover Image With Discription #tiles
 * @Author               Krishnamurthy Donta
 * @Createddate          19-06-2023
 * @ControllerClass      
 * @TestClass            
 * @modificationSummary  Nameofmodifier - modification date - modifications made
 */

import { LightningElement ,api, track, wire} from 'lwc';
import ImageWithAboutButton from '@salesforce/resourceUrl/ImageWithAboutButton';
import getContent from '@salesforce/apex/ManagedContentController.getContent';
import basePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';
/**
 * @slot aboutUsStandardButton
*/

export default class Snp_Home_Common_Banner_Button extends LightningElement {
    @api contentId 
    @track imageSource
    @api bannerType
    @api buttonPosition


    get getBannerTypeClass(){
        if(this.bannerType.toLowerCase() === 'large'){
            return `banner-wrapper banner-large`;
        } else if(this.bannerType.toLowerCase() === 'medium'){
            return ` banner-wrapper banner-medium`;
        } else {
            return ` banner-wrapper banner-small`;
        }
    }

    get getButtonPositionStyleClass(){
        if(this.buttonPosition.toLowerCase() === 'center'){
            return `about-us-slot-wrapper about-us-button-center`;
        } else if(this.buttonPosition.toLowerCase() === 'right'){
            return `about-us-slot-wrapper about-us-button-right`;
        } else {
            return `about-us-slot-wrapper about-us-button-left`;
        }
    }

    @wire(getContent, {
        contentId: '$contentId',
        page: 0,
        pageSize: 1,
        language: 'en_US',
        filterby: ''
    })
     wiredContent({ data, error }) {
        if (data) {
            //alert(JSON.stringify(data));
            this._cmsData=data;
             
             this.imageSource =
                    basePath +
                    '/sfsites/c' +
                    this._cmsData.source.unauthenticatedUrl;       
            //alert(this._cmsData.source.unauthenticatedUrl);
        }
             if (error) {
            console.log('Error: ' + JSON.stringify(error));
        }
        }
    handelOnclick(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name:'About_Us__c',
            }
        });
    }
   
}