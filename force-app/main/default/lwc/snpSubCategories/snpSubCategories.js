import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import basePath from '@salesforce/community/basePath';
import communityId from '@salesforce/community/Id';
import getSubCategory from '@salesforce/apex/SNP_SubCategoriesController.getSubCategories';
import getSubCategoryTileImageById from '@salesforce/apex/SNP_SubCategoriesController.getSubCategoryTileImageById';
import checkParentOrSubCategory from '@salesforce/apex/SNP_SubCategoriesController.checkParentOrSubCategory';


const ITEMS_PER_PAGE = 8;
export default class SnpSubCategories extends NavigationMixin(LightningElement) {

    @api categoryId;
    @track categoryDetails = []; //contains id and name of categories
    @track showSubCategoryGrid = false;
    currentPage = 1;

    renderedCallback() {
        this.highlightSelectedPage();
    }

    @wire(checkParentOrSubCategory, {
        categoryId: '$categoryId' // Reactive binding to the categoryId property
    })
    wiredCategoryDetails({ data, error }) {
        if (data) {
            this.showSubCategoryGrid = true;
            this.getSubCategories();
        }
        else if (error) {
            console.error('Error' + JSON.stringify(error));
        }
        else {

            this.showSubCategoryGrid = false;
        }
    }
    async getSubCategories() {
        try {
            const result = await getSubCategory({ currentCommunityId: communityId });
            const categoryDetails = await Promise.all(
                result.map(async item => {
                    const imageUrl = await this.getImageUrl(item.Id);
                    return {
                        id: item.Id,
                        name: item.Name,
                        url: imageUrl
                    };
                })
            );

            this.categoryDetails = categoryDetails;
            this.updatePage(1); // Update the page to the first page

        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }


    async getImageUrl(currentCategoryId) {

        const result = await getSubCategoryTileImageById({
            currentCommunityId: communityId,
            subCategoryId: currentCategoryId
        });

        if (result === null) {
            return null;            //No image found for category
        }
        return `${basePath}/sfsites/c${result.source.unauthenticatedUrl}`;
    }


    handleCategoryPage(event) {
        const categoryId = event.currentTarget.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: categoryId, //Fetch dynamically product id based on product image
                objectApiName: 'ProductCategory',
                actionName: 'view'
            }
        });

    }


    //To display pagination section
    get showPagination() {
        return this.categoryDetails.length > ITEMS_PER_PAGE;
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.updatePage(this.currentPage - 1);
            this.highlightSelectedPage();
        }
    }

    handleNextPage() {
        const totalPages = Math.ceil(this.categoryDetails.length / ITEMS_PER_PAGE);
        if (this.currentPage < totalPages) {
            this.updatePage(this.currentPage + 1);
            this.highlightSelectedPage();
        }
    }
    updatePage(pageNumber) {
        this.currentPage = pageNumber;
    }

    get displayedImages() {
        const startIndex = (this.currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return this.categoryDetails.slice(startIndex, endIndex);
    }


    get pages() {
        const totalPages = Math.ceil(this.categoryDetails.length / ITEMS_PER_PAGE);
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    handlePageClick(event) {
        const selectedPage = parseInt(event.target.value);
        this.updatePage(selectedPage);
        this.highlightSelectedPage();
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        const totalPages = Math.ceil(this.categoryDetails.length / ITEMS_PER_PAGE);
        return this.currentPage === totalPages;
    }

    highlightSelectedPage() {
        const buttons = this.template.querySelectorAll('.btn-number-pages');
        if (buttons.length > 0) {
            buttons.forEach((button) => {
                button.classList.remove('selected-page');
                if (parseInt(button.value) === this.currentPage) {
                    button.classList.add('selected-page');
                }
            });
        }
    }
}