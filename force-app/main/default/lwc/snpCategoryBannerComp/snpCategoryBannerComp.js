import { LightningElement, api, track, wire } from 'lwc';
import basePath from '@salesforce/community/basePath';
import communityId from '@salesforce/community/Id';
import getCategoryBannerImageById from '@salesforce/apex/SNP_CategoryBannerController.getCategoryBannerImageById';
import updateCategoryMediaSortOrder from '@salesforce/apex/SNP_CategoryBannerController.updateCategoryMediaSortOrder';
export default class SnpCategoryBannerComp extends LightningElement {
    @api categoryId; // Property to receive the category ID from category page
    @track imageUrl; // Property to track the category banner image URL
    @track categoryName;
    @track categoryDescription;
    @api headTextColor;     // Head text color property value
    @api subHeadTextColor; // Sub-heading text color property value

    connectedCallback() {
        updateCategoryMediaSortOrder()
            .then(result => {

            })
            .catch(error => {
                console.log(error);
            });
    }

        // set Head Text Color
        get getHeadTextColorStyle(){
            return `color:${this.headTextColor}`
        }
    
        // set Subhead Text color
        get getSubHeadTextColorStyle(){
            return `color:${this.subHeadTextColor}`
        }

    @wire(getCategoryBannerImageById, {
        currentCommunityId: communityId,
        categoryId: '$categoryId' // Reactive binding to the categoryId property
    })
    wiredCategoryImages({ data, error }) {
        if (data) {
            console.log('category data --', data);
            this.categoryName = data?.categoryListResponse?.[0]?.Name ?? '';
            console.log('categoryName -- ', this.categoryName);
            this.categoryDescription = data?.categoryListResponse?.[0]?.Description ?? '';
            console.log('categoryDescription --', this.categoryDescription);
            this.imageUrl = `${basePath}/sfsites/c${data?.contentNodesResponse?.source?.unauthenticatedUrl ?? ''}`;
            console.log('category img url --', this.imageUrl);


        }
        else if (error) {

            console.error(JSON.stringify(error));
        }
    }


}