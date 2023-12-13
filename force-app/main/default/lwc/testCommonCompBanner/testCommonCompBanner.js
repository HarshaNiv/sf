import { LightningElement,api,track,wire } from 'lwc';
import getContent from '@salesforce/apex/ManagedContentController.getContent';
import basePath from '@salesforce/community/basePath';

import communityId from '@salesforce/community/Id';
//import getCategoryBannerImageById from '@salesforce/apex/SNP_CategoryBannerController.getCategoryBannerImageById';
// import getCategoryDescription from '@salesforce/apex/SNP_CategoryBannerController.getCategoryDescription';
import getCategoryBannerImageById from '@salesforce/apex/SNP_CategoryBannerController.getCategoryBannerImageById';
/**
 * @slot aboutUsStandardButton
*/
export default class TestCommonCompBanner extends LightningElement {
  @api contentId;
  @api contentFirstHeading;
  @api contentSecondHeading;
  @api headTextColor;
  @api subHeadTextColor;
  @api bannerPageType;
  @api buttonPosition;

  @api categoryId; // Property to receive the category ID from category page
  @track imageUrl; // Property to track the category banner image URL
  @track categoryDetails = []; // Property to track the category details data
   
    connectedCallback(){
       // alert("conected ncategory id "+this.categoryId);
        if(this.categoryId){
            this.getCategoryImage();
        }
        else{
            this.getHomeImage();
        }
    }
   

    // get getTextStyle(){
    //   return `color:${this.textColor}`;
    // }
    // 'cms-hero-banner,category-hero-banner,home-page-hero-banner,home-page-sub-banner'

    get getStyleClassBasedPageType(){
        if(this.bannerPageType.toLowerCase() === 'cms-hero-banner'){
            return `banner-wrapper cms-hero-banner`;
        } else if(this.bannerPageType.toLowerCase() === 'category-hero-banner'){
            return `banner-wrapper category-hero-banner`;
        }else if(this.bannerPageType.toLowerCase() === 'home-page-sub-banner'){
            return `banner-wrapper home-page-sub-banner`;
        } else {
            return `banner-wrapper home-page-hero-banner`;
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

    get getSubHeadTextColorStyle(){
        return `color:${this.subHeadTextColor}`
    }
    get getHeadTextColorStyle(){
        return `color:${this.subHeadTextColor}`
    }

    getHomeImage(){
       //alert('home inage');
       getContent( {
        contentId: '$contentId',
        page: 0,
        pageSize: 1,
        language: 'en_US',
        filterby: ''
       })
           .then(result => {
            this._cmsData=result;
            this.imageUrl =
                  basePath +
                  '/sfsites/c' +
                  this._cmsData.source.unauthenticatedUrl;       
           })
           .catch(error => {
            console.log('Error: ' + JSON.stringify(error));
           });
    }
    getCategoryImage(){
      getImageContent({
            currentCommunityId: communityId,
            categoryId: '$categoryId', // Reactive binding to the categoryId property
         })
          .then(result => {
            this.contentFirstHeading = data?.categoryListResponse?.[0]?.Name || '';
            this.contentSecondHeading = data?.categoryListResponse?.[0]?.Description || '';
            this.imageUrl = `${basePath}/sfsites/c${data?.contentNodesResponse?.source?.unauthenticatedUrl || ''}`;
          })
          .catch(error => {
            console.log('Error: ' + JSON.stringify(error));
          });


    }
//     @wire(getContent, {
//       contentId: '$contentId',
//       page: 0,
//       pageSize: 1,
//       language: 'en_US',
//       filterby: ''
//      })
//    wiredContent({ data, error }) {
//       if (data) {
//          // alert(JSON.stringify(data));
//           this._cmsData=data;
           
//            this.imageUrl =
//                   basePath +
//                   '/sfsites/c' +
//                   this._cmsData.source.unauthenticatedUrl;       
//           //alert(this._cmsData.source.unauthenticatedUrl);
//         }
//            if (error) {
//           console.log('Error: ' + JSON.stringify(error));
//         }
//     }



// @wire(getCategoryBannerImageById, {
//     currentCommunityId: communityId,
//     categoryId: '$categoryId', // Reactive binding to the categoryId property
// })
// wiredCategoryImages({ data, error }) {
//     if (data) {
//         this.imageUrl = basePath +
//             '/sfsites/c' +
//             data.source.unauthenticatedUrl; // Set the image URL based on the retrieved data
//     }
//     else if (error) {
//         // alert('error' + JSON.stringify(error));
//         //this.showToast('Error', 'vvvv', 'error');
//         console.error(error);
//     }
// }

// @wire(getCategoryDescription, {
//     categoryId: '$categoryId' // Reactive binding to the categoryId property
// })
// wiredCategoryDetails({ data, error }) {

//     if (data) {
//         this.categoryDetails = data.map(item => {

//             return {
//                 id: item.Id,
//                 name: item.Name,
//                 description: item.Description
//             }
//         });

//     }
//     else if (error) {
//         this.showToast('Error', 'bbbb', 'error');
//     }
// }

    
}