import { LightningElement, api, track, wire } from 'lwc';
import basePath from '@salesforce/community/basePath';
import communityId from '@salesforce/community/Id';
import getCategoryBannerImageById from '@salesforce/apex/SNP_CategoryBannerController.getCategoryBannerImageById';
import updateCategoryMediaSortOrder from '@salesforce/apex/SNP_CategoryBannerController.updateCategoryMediaSortOrder';


export default class SnpCategoryBanner extends LightningElement {

    @api categoryId; // Property to receive the category ID from category page
    @track imageUrl; // Property to track the category banner image URL
    @track categoryName;
    @track categoryDescription;

    connectedCallback() {
        updateCategoryMediaSortOrder()
            .then(result => {

            })
            .catch(error => {
                console.log(error);
            });
    }

    @wire(getCategoryBannerImageById, {
        currentCommunityId: communityId,
        categoryId: '$categoryId', // Reactive binding to the categoryId property
    })
    wiredCategoryImages({ data, error }) {
        if (data) {

            this.categoryName = data?.categoryListResponse?.[0]?.Name ?? '';
            this.categoryDescription = data?.categoryListResponse?.[0]?.Description ?? '';
            this.imageUrl = `${basePath}/sfsites/c${data?.contentNodesResponse?.source?.unauthenticatedUrl ?? ''}`;


        }
        else if (error) {

            console.error(JSON.stringify(error));
        }
    }




}