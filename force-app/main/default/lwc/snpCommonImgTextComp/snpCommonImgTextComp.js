import { LightningElement,api,track,wire } from 'lwc';
import getContent from '@salesforce/apex/ManagedContentController.getContent';
import basePath from '@salesforce/community/basePath';

/**
 * @slot htmlEditorStandartCompRight
 * @slot htmlEditorStandartCompLeft
 * @slot redirectCmsPageBtn
*/

export default class SnpCommonImgTextComp extends LightningElement {

    // @api leftTopImage;
    // @api leftBottomTextSlot;
    // @api rightTopImage;
    // @api rightBottomTextSlot;
    @track leftImgUrl;
    @track rightImgUrl;
    @api rightImageContentId;
    @api leftImageContentId;
    // @api buttonVisibleSlot;
    // @api imageViewType;
    // @api buttonPosition;
    _cmsDataOne;
    _cmsDataTwo;
    
    @api pageType
    
    // get leftTopImageStyle(){
    //     if(this.leftTopImage.toLowerCase() === 'display') {
    //         return `display:block`;
    //     } else {
    //         return `display:none`;
    //     }
    // }

    // get leftBottomTextSlotStyle(){
    //     if(this.leftBottomTextSlot.toLowerCase() === 'display') {
    //         return `display:block`;
    //     } else {
    //         return `display:none`;
    //     }
    // }

    // get rightTopImageStyle()
    // {
    //     if(this.rightTopImage.toLowerCase() === 'display') {
    //         return `display:block`;
    //     } else {
    //         return `display:none`;
    //     }
    // }

    //   get rightBottomTextSlotStyle()
    //   {
    //     if(this.rightBottomTextSlot.toLowerCase() === 'display') {
    //         return `display:block`;
    //     } else {
    //         return `display:none`;
    //     }
    //   }
 
    //   get getSpecificRightStyle()
    //   {
    //     if(this.buttonVisibleSlot.toLowerCase() === 'display' && this.rightTopImage.toLowerCase() === 'hide'){
    //         return `display: flex;
    //                 flex-direction: column;
    //                 justify-content: center;
    //                 align-items: center;`;
    //     } else if(this.rightTopImage.toLowerCase() === 'hide') {
    //         return `display: flex;
    //                 justify-content: center;
    //                  align-items: center;`;
    //     } else {
    //         return `display:block`;
    //     }
    //   }
    //   get getSpecificLeftStyle()
    //   {
    //     if(this.leftTopImage.toLowerCase() === 'hide') {
    //         return `display: flex;
    //                 justify-content: center;
    //                  align-items: center;`;
    //     } else {
    //         return `display:block`;
    //     }
    //   }
    //   get rightBottomButtonSlot() {
    //     if(this.buttonVisibleSlot.toLowerCase() === 'hide') {
    //         return `display:none;`;
    //     } else if(this.buttonPosition.toLowerCase() === 'right' && this.buttonVisibleSlot.toLowerCase() === 'display'){
    //         return `display:block; align-self: end`;
    //     } else if(this.buttonPosition.toLowerCase() === 'left' && this.buttonVisibleSlot.toLowerCase() === 'display'){
    //         return `display:block; align-self: start`;
    //     }else if(this.buttonPosition.toLowerCase() === 'center' && this.buttonVisibleSlot.toLowerCase() === 'display'){
    //         return `display:block;align-self: centre`;
    //     } else {
    //         return `display:block;`
    //     }
    //   }

    
    // get getStyleBasedOnImageViewType(){
    //     if(this.imageViewType.toLowerCase() === 'landscape' && this.rightTopImage.toLowerCase() === 'hide'){
    //         return `content-common-inner-wrapper custom-container landscape-wrapper landscape-reverse`;
    //     }
    //     if(this.imageViewType.toLowerCase() === 'landscape') {
    //         return `content-common-inner-wrapper custom-container landscape-wrapper`;
    //     } else {
    //         return `content-common-inner-wrapper custom-container potrait-wrapper`;
    //     }
    // }
/* HomePage-Img-Txt,CmsPage-Industy-Report,CmsPage-Our-Company,CmsPage-Our-Company-Reverse,CmsPage-Our-Approach,CmsPage-Our-Approach-Reverse */
/* "homepage-img-txt,cmspage-industy-report,cmspage-our-company,cmspage-our-company-reverse,cmspage-our-approach,cmspage-our-approach-reverse"  */
    get getStyleBasedOnPageType(){
        if(this.pageType.toLowerCase() === 'homepage-img-txt') {
            return `content-common-inner-wrapper custom-container homepage-img-txt`;
        } else if(this.pageType.toLowerCase() === 'cmspage-industy-report') {
            return `content-common-inner-wrapper custom-container cmspage-industy-report`;
        } else if(this.pageType.toLowerCase() === 'cmspage-our-company') {
            return `content-common-inner-wrapper custom-container cmspage-our-company`;
        } else if(this.pageType.toLowerCase() === 'cmspage-our-company-reverse'){
            return `content-common-inner-wrapper custom-container cmspage-our-company-reverse`;
        } else if(this.pageType.toLowerCase() === 'cmspage-our-approach'){
            return `content-common-inner-wrapper custom-container cmspage-our-approach`;
        } else if(this.pageType.toLowerCase() === 'cmspage-our-approach-reverse'){
            return `content-common-inner-wrapper custom-container cmspage-our-approach-reverse`;
        }
    }


    @wire(getContent, {
        contentId: '$leftImageContentId',
        page: 0,
        pageSize: 1,
        language: 'en_US',
        filterby: ''
       })
     wiredContent({ data, error }) {
        if (data) {
           // alert(JSON.stringify(data));
            this._cmsDataOne=data;
             
             this.leftImgUrl =
                    basePath +
                    '/sfsites/c' +
                    this._cmsDataOne.source.unauthenticatedUrl;
                    console.log('left image url - ', this.leftImgUrl);       
            //alert(this._cmsData.source.unauthenticatedUrl);
            this.showCmsImsge();
          }
            else if (error) {
            console.log('89 Error: ' + JSON.stringify(error));
          }
      }


      //two
      showCmsImsge(){
        console.log('called');
        getContent({contentId:this.rightImageContentId,page: 0,
            pageSize: 1,
            language: 'en_US',
            filterby: ''})
             .then(result => {
                this._cmsDataTwo=result;
             
                this.rightImgUrl =
                       basePath +
                       '/sfsites/c' +
                       this._cmsDataTwo.source.unauthenticatedUrl;  
                       console.log('right image url --', this.rightImgUrl); 
             })
             .catch(error => {
                 // TODO Error handling
                 console.log(JSON.stringify(error));
             });
      }


      
}