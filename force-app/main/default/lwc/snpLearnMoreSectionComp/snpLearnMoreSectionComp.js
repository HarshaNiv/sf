import { LightningElement,api,track,wire } from 'lwc';
import getContent from '@salesforce/apex/ManagedContentController.getContent';
import basePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';
export default class SnpLearnMoreSectionComp extends NavigationMixin(LightningElement) {
    @api contentId;
    @track imageUrl;


    @wire(getContent, {
      contentId: '$contentId',
      page: 0,
      pageSize: 1,
      language: 'en_US',
      filterby: ''
     })
   wiredContent({ data, error }) {
      if (data) {
         // alert(JSON.stringify(data));
          this._cmsData=data;
           
           this.imageUrl =
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
            type:'comm__namedPage',
            attributes: {
                name: 'Read_More__c'
            }
        });
    }

   

}