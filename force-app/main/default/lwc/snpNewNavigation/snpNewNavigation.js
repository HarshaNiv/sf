import { LightningElement, track, wire } from 'lwc';
import communityId from '@salesforce/community/Id';
import basePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';
import getCategories from '@salesforce/apex/SNP_MultiLevelNavigationController.getSubCategories';
import getCmsImages from '@salesforce/apex/SNP_MultiLevelNavigationController.getCmsImages';

export default class SnpNewNavigation extends NavigationMixin(LightningElement) {

    parentCategoryName;
    parentCategoryId;
    subCategories;
    imageUrls;

    //Why PowerLed > Our Approach Sub Items
    whyPowerledSubItems = [
        {
            name: 'Application Support',
            link: 'Application_Support__c',

        },
        {
            name: 'Market Expectations',
            link: 'Market_Expectations__c',

        },
        {
            name: 'Market Forces',
            link: 'Market_Forces__c',

        },
        {
            name: 'Operational Performance ',
            link: 'Operational_Performance__c',

        },
        {
            name: 'LED Product Design',
            link: 'LED_Product_Design__c',

        },
    ];

    // Solutions sub-items array

    solutionsSubItems = [
        {
            name: 'Architectural Lighting',
            link: 'architectural_led_lighting_manufacturers__c',

        },
        {
            name: 'Cabinet LED Lighting',
            link: 'cabinet_led_lighting_1__c',

        },
        {
            name: 'Commercial Lighting',
            link: 'commercial_led_lighting__c',

        },
        {
            name: 'Construction Site LED Lighting',
            link: 'Construction_Site_LED_Lightning__c',

        },
        {
            name: 'LED Area Lighting',
            link: 'LED_Area_Lightning__c',

        },
        {
            name: 'Marine & Harsh Environments',
            link: 'Marine_and_harsh_environments__c',

        },
        {
            name: 'Point of Sale LED Lighting',
            link: 'Point_of_Sale_LED_Lighting__c',

        },
        {
            name: 'LED Sign Manufacturing',
            link: 'LED_Sign_Manufacturing__c',

        },
        {
            name: 'Vapour Proof LED Lights',
            link: 'vapour_proof_led_lights__c',

        },
        {
            name: 'Warehouse LED Lighting',
            link: 'Warehouse_LED_Lights__c',

        },
    ];

    // Explore More sub-items array

    exploreMoreSubItems = [
        {
            name: 'LED Lighting OEM',
            link: 'LED_Lighting_OEM__c',

        },
        {
            name: 'Become a Distributor',
            link: 'Become_a_Distributor__c',

        },
        {
            name: 'Mean Well Authorized Resellers',
            link: 'MEAN_WELL_Authorised_Resellers__c',

        },
        {
            name: 'Point-of-sale Displays',
            link: 'Point_of_sale_Displays__c',

        },
        {
            name: 'How To Power Your Sign and Display Solutions',
            link: 'How_To_Power_Sign_And_Display_Solutions__c',

        }
    ];

    //Get Sunpower Parent Category
    @wire(getCategories, { currentCommunityId: communityId, parentCategoryId: null })
    wiredContent({ data, error }) {
        if (data) {

            this.parentCategoryName = data[0]?.Name ?? '';
            this.parentCategoryId = data[0]?.Id ?? '';


        }
        else if (error) {

            console.error('Errors: ' + JSON.stringify(error));
        }
    }

    //Get Sunpower Sub Categories
    getSubCategories(event) {

        const currentParentCategoryId = event.currentTarget.dataset.id;
        getCategories({ currentCommunityId: communityId, parentCategoryId: currentParentCategoryId })
            .then(result => {
                const items = result.map(item => {
                    return {
                        id: item?.Id ?? '',
                        name: item?.Name ?? ''

                    };
                });
                this.subCategories = items;

            })
            .catch(error => {

                console.error('Error' + JSON.stringify(error));
            });
        this.getSubCategoryImages(currentParentCategoryId);


    }

    handleSubcategoryImage(event) {
        const currentSubCategoryId = event.currentTarget.dataset.id;
        this.getSubCategoryImages(currentSubCategoryId);
    }

    //Get Sun Power Sub Category Images
    getSubCategoryImages(currentSubCategoryId) {

        getCmsImages({ currentCommunityId: communityId, categoryId: currentSubCategoryId })
            .then(result => {

                const images = result.map(item => {

                    return {
                        url: `${basePath}/sfsites/c${item?.source?.unauthenticatedUrl ?? ''}`,

                        id: currentSubCategoryId
                    };
                });
                this.imageUrls = images.reverse();
            })
            .catch(error => {
                console.error(JSON.stringify(error));
            });

    }

    // Go to Sub category Page
    handleCategoryPage(event) {
        const categoryId = event.currentTarget.dataset.id;
        this.addDisplayNoneProperty();
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: categoryId, //Fetch dynamically product id based on product image
                objectApiName: 'ProductCategory',
                actionName: 'view'
            }
        });


    }


    addDisplayNoneProperty() {
        const subNavs = this.template.querySelectorAll('.sub-nav, .sub-nav-wrapper, .sub-sub-nav');
        subNavs.forEach(subNav => {
            subNav.style.display = 'none';
        });
    }
    removeDisplayNoneProperty() {
        setTimeout(() => {
            const subNavs = this.template.querySelectorAll('.sub-nav, .sub-nav-wrapper, .sub-sub-nav');
            subNavs.forEach(subNav => {
                subNav.style.removeProperty('display');
            });
        }, 200);


    }

    navigateToPage(event) {
        const pageApiName = event.currentTarget.dataset.id;
        this.addDisplayNoneProperty();
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageApiName
            }
        });
    }



}