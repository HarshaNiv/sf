import { LightningElement, track, wire } from 'lwc';
import BOOTSTRAP from '@salesforce/resourceUrl/BOOTSTRAP';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { NavigationMixin } from "lightning/navigation";
import communityId from '@salesforce/community/Id';
import basePath from '@salesforce/community/basePath';
import getSubCategories from '@salesforce/apex/SNP_MultiLevelNavigationController.getSubCategories';
import getCmsImages from '@salesforce/apex/SNP_MultiLevelNavigationController.getCmsImages';



export default class LwcNavigation extends NavigationMixin(LightningElement) {

    @track displaySubCategoryContainer = false;

    @track mainCategoryItems = [];
    @track subCategoryItems = [];
    @track imageUrls = [];

    connectedCallback() {
        Promise.all([
            loadScript(this, BOOTSTRAP + '/bootstrap-5.0.2-dist/js/bootstrap.js'),
            loadStyle(this, BOOTSTRAP + '/bootstrap-5.0.2-dist/css/bootstrap.min.css'),
        ]).
            then(() => {

            }).catch((error => {
                console.error('Failed to load boot strap');
            }))
    }

    //Fetch main category items
    @wire(getSubCategories, { currentCommunityId: communityId, parentCategoryId: null })
    wiredContent({ data, error }) {
        if (data) {
            const items = data.map(item => {
                return {
                    id: item.Id,
                    name: item.Name
                };
            });
            this.mainCategoryItems = items;

        }
        else if (error) {

            console.error('Errors: ' + JSON.stringify(error));
        }
    }


    handleMainCategoryMouseEnter(event) {

        if (window.innerWidth > 1200) {
            const currentCategoryItemId = event.currentTarget.dataset.id;
            this.getSubCategoryItems(currentCategoryItemId);
            this.getImages(currentCategoryItemId);
            const element = this.template.querySelector('.modal-backgrounds');
            element.classList.add('modal-backgrounds-show');

            this.displaySubCategoryContainer = true;
        }

    }


    handleSubCategoryMouseEnter(event) {
        const currentSubCategoryItemId = event.currentTarget.dataset.id;
        this.getImages(currentSubCategoryItemId);
    }


    getSubCategoryItems(currentParentCategoryId) {
        getSubCategories({ currentCommunityId: communityId, parentCategoryId: currentParentCategoryId })
            .then(result => {

                const items = result.map(item => {
                    return {
                        id: item.Id,
                        name: item.Name
                    };
                });
                this.subCategoryItems = items;

            })
            .catch(error => {

                console.error('Error' + JSON.stringify(error));
            });
    }

    getImages(currentCategoryId) {
        getCmsImages({ currentCommunityId: communityId, categoryId: currentCategoryId })
            .then(result => {

                const images = result.map(item => {

                    return {
                        url: basePath + '/sfsites/c' + item.source.unauthenticatedUrl,

                        id: currentCategoryId
                    };
                });
                this.imageUrls = images.reverse();
            })
            .catch(error => {
                console.error(JSON.stringify(error));
            });

    }

    handleSubCategoryContainerMouseEnter(event) {
        if (window.innerWidth > 1200) {
            const element = this.template.querySelector('.modal-backgrounds');
            element.classList.add('modal-backgrounds-show');
            this.displaySubCategoryContainer = true;

        }

    }
    handleMouseLeave() {

        const element = this.template.querySelector('.modal-backgrounds');
        element.classList.remove('modal-backgrounds-show');
        this.displaySubCategoryContainer = false;





    }



    handleCategoryPage(event) {
        const categoryId = event.currentTarget.dataset.id;

        this[NavigationMixin.GenerateUrl]({

            type: 'standard__webPage',
            attributes: {
                url: ''
            }
        }).then(url => {

            window.open(`${basePath}/category/${categoryId}`, "_self");
        });

    }
}