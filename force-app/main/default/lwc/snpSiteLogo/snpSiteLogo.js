import { LightningElement,api,track,wire } from 'lwc';
import getContent from '@salesforce/apex/ManagedContentController.getContent';
import basePath from '@salesforce/community/basePath';
export default class SnpSiteLogo extends LightningElement {
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


    logoClickHandler(){
        window.location.href=basePath;
    }

}