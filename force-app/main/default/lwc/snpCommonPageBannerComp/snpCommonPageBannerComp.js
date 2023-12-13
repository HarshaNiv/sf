import { LightningElement,api,track,wire } from 'lwc';
import getContent from '@salesforce/apex/ManagedContentController.getContent';
import basePath from '@salesforce/community/basePath';
import communityId from '@salesforce/community/Id';
import getCategoryBannerImageById from '@salesforce/apex/SNP_CategoryBannerController.getCategoryBannerImageById';

/**
 * @slot aboutUsStandardButton
*/

export default class SnpCommonPageBannerComp extends LightningElement {
  @api recordId;  // Property to receive the record ID from category page
  @api contentId; // get the content Id to retrieve image from CMS
  @api contentFirstHeading;   // First Heading Text of Banner
  @api contentSecondHeading; // Sub Heading Text of Banner
  @api headTextColor;     // Head text color property value
  @api subHeadTextColor; // Sub-heading text color property value
  @api bannerPageType;  // define page Banner type
  @api buttonPosition; // if banner contain button define the position
  @track imageUrl;    // Property to track the category banner image URL
  @track categoryDetails = []; // Property to track the category details data
  @track cmsData;
    @track checkCategoryID="";


    connectedCallback(){
        // Based on the page type image it is retrieve from CMS or Media Object
        if(this.bannerPageType.toLowerCase() === 'category-hero-banner'){
            this.checkCategoryID = this.recordId;
            this.getCategoryContent(); // for Category it is return from Medai object
        }
        else{
            this.getCmsContentImage(); // for other page it is retrieve from CMS
        }
    }
    
    renderedCallback(){
        console.log("render call back",this.recordId,this.checkCategoryID);
        if(this.recordId !== this.checkCategoryID){
            this.checkCategoryID=this.recordId;
            this.getCategoryContent();
        }
    }

    //HomePage-LearMore-Banner,HomePage-AboutUs-Banner,HomePage-ReadMore-Banner
    //'homepage-learmore-banner,homepage-aboutus-banner,homepage-readmore-banner'
    // set class based on page type option selected from dropdown
    get getStyleClassBasedPageType(){
        if(this.bannerPageType.toLowerCase() === 'cms-hero-banner'){
            return `banner-wrapper cms-hero-banner`;
        } else if(this.bannerPageType.toLowerCase() === 'category-hero-banner'){
            return `banner-wrapper category-hero-banner`;
        }else if(this.bannerPageType.toLowerCase() === 'home-page-sub-banner'){
            return `banner-wrapper home-page-sub-banner`;
        }
        else if(this.bannerPageType.toLowerCase() === 'homepage-learmore-banner' ){
            return `banner-wrapper homepage-learmore-banner`;
        }
        else if(this.bannerPageType.toLowerCase() === 'homepage-aboutus-banner' ){
            return `banner-wrapper homepage-aboutus-banner`;
        }
        else if(this.bannerPageType.toLowerCase() === 'homepage-readmore-banner' ){
            return `banner-wrapper homepage-readmore-banner`;

        }else if(this.bannerPageType.toLowerCase() ==='about-us-company-banner'){
            return `banner-wrapper about-us-company-banner`;
        } 
        else {
            return `banner-wrapper home-page-hero-banner`;
        }
    }

    // Set Button Position
    get getButtonPositionStyleClass(){
        if(this.buttonPosition.toLowerCase() === 'center'){
            return `about-us-slot-wrapper about-us-button-center`;
        } else if(this.buttonPosition.toLowerCase() === 'right'){
            return `about-us-slot-wrapper about-us-button-right`;
        } else {
            return `about-us-slot-wrapper about-us-button-left`;
        }
    }

    // set Head Text Color
    get getHeadTextColorStyle(){
        return `color:${this.headTextColor}`
    }

    // set Subhead Text color
    get getSubHeadTextColorStyle(){
        return `color:${this.subHeadTextColor}`
    }

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

    // Retrieve the category Name and Description and images fro respective Object
    getCategoryContent(){
        getCategoryBannerImageById({
            currentCommunityId: communityId,
            categoryId:this.recordId // Reactive binding to the categoryId property
         })
          .then(result => {
            console.log("Category Called");
            this.contentFirstHeading = result?.categoryListResponse?.[0]?.Name || '';
            this.contentSecondHeading = result?.categoryListResponse?.[0]?.Description || '';
            this.imageUrl = `${basePath}/sfsites/c${result?.contentNodesResponse?.source?.unauthenticatedUrl || ''}`;
          })
          .catch(error => {
            console.log('Error: ' + JSON.stringify(error));
          });


    }

    
}