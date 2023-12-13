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

export default class Snp_ImageWithAboutUsButton extends NavigationMixin(LightningElement) {
    @api contentId 
    @api title
    @track imageSource

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