import { LightningElement,api,track,wire } from 'lwc';
import getContent from '@salesforce/apex/ManagedContentController.getContent';
import basePath from '@salesforce/community/basePath';
// import communityId from '@salesforce/community/Id';
// import getCategoryBannerImageById from '@salesforce/apex/SNP_CategoryBannerController.getCategoryBannerImageById';

export default class SNP_TrustMessage_Icon_component extends LightningElement {
    @api recordId;  // Property to receive the record ID from category page
    @api contentId; // get the content Id to retrieve image from CMS
     imageUrl;    // Property to track the category banner image URL
     cmsData;
     checkCategoryID='';


     connectedCallback(){
        // Based on the page type image it is retrieve from CMS or Media Object
        this.getCmsContentImage(); // for other page it is retrieve from CMS
        // if(this.bannerPageType.toLowerCase() === 'category-hero-banner'){
        //     this.checkCategoryID = this.recordId;
        //     this.getCategoryContent(); // for Category it is return from Medai object
        // }
        // else{
            
        // }
    }

    // renderedCallback(){
    //     console.log("render call back",this.recordId,this.checkCategoryID);
    //     if(this.recordId !== this.checkCategoryID){
    //         this.checkCategoryID=this.recordId;
    //         this.getCategoryContent();
    //     }
    // }

     // retrieve the cms image url from CMS
     getCmsContentImage(){
        getContent( {
         contentId: this.contentId,
         page: 0,
         pageSize: 1,
         language: 'en_US',
         filterby: ''
        })
            .then(result => {
             console.log("Normal banner Called");
             this.cmsData=result;
             this.imageUrl =
                   basePath +
                   '/sfsites/c' +
                   this.cmsData.source.unauthenticatedUrl;
            })
            .catch(error => {
             console.log('Error: ' + JSON.stringify(error));
            });
     }
}