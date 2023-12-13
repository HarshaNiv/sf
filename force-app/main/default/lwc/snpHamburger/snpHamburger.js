import { LightningElement, track, wire } from 'lwc';
import communityId from '@salesforce/community/Id';
import { NavigationMixin } from 'lightning/navigation';
import getCategories from '@salesforce/apex/SNP_MultiLevelNavigationController.getSubCategories';

export default class SnpHamburger extends NavigationMixin(LightningElement) {

    @track menuOpen = false;
    parentCategoryName;
    parentCategoryId;
    subCategories;

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

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        if (!this.menuOpen) {
            this.hideAllSubNavs();
        }
    }

    get menuIconClass() {
        return this.menuOpen ? 'menu-icon menu-open' : 'menu-icon';
    }

    get menuClass() {
        return this.menuOpen ? 'menu active' : 'menu';
    }

    //Shows navigation fly-out menu
    showSubNav(event) {
        const subNav = event.target.nextElementSibling;

        if (subNav && subNav.classList.contains('sub-nav')) {
            if (subNav.style.display === 'block') {
                subNav.style.display = 'none';
                this.navigateToPage(event);
            } else {
                this.hideAllSubNavs(subNav);  // Hide other sub-navs
                subNav.style.display = 'block';  // Show the current sub-nav
            }
        }

        event.stopPropagation();
    }
    //Shows navigation fly-out sub menu
    showSubSubNav(event) {
        const subSubNav = event.target.nextElementSibling;

        if (subSubNav && subSubNav.classList.contains('sub-sub-nav')) {
            // Toggle the display of the sub-submenu
            if (subSubNav.style.display === 'block') {
                subSubNav.style.display = 'none';
                this.navigateToPage(event);
            } else {
                subSubNav.style.display = 'block';
            }
        }

        // Stop propagation to prevent any parent handlers from being executed
        event.stopPropagation();
    }

    //Closes all navigation fly-out menu,sub menu except for the current nav-item
    hideAllSubNavs(exceptThisOne = null) {
        this.template.querySelectorAll('.sub-nav, .sub-sub-nav').forEach(menu => {
            if (menu !== exceptThisOne) {
                menu.style.display = 'none';
            }
        });
    }

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
    //Show Sunpower categories fly-out
    showOurProductSubNav(event) {
        const subNav = event.target.nextElementSibling;
        const currentParentCategoryId = event.currentTarget.dataset.id;
        this.getSubCategories(currentParentCategoryId);

        if (subNav && subNav.classList.contains('sub-nav')) {
            if (subNav.style.display === 'block') {
                subNav.style.display = 'none';
                this.handleCategoryPage(event);
            } else {
                this.hideAllSubNavs(subNav);  // Hide other sub-navs
                subNav.style.display = 'block';  // Show the current sub-nav
            }
        }

        event.stopPropagation();
    }

    //Get Sunpower Sub Categories
    getSubCategories(currentParentCategoryId) {


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
    }


    //Redirects to the respective sub category pages
    handleCategoryPage(event) {
        const categoryId = event.currentTarget.dataset.id;
        this.menuOpen = false;
        this.hideAllSubNavs();
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: categoryId, //Fetch dynamically product id based on product image
                objectApiName: 'ProductCategory',
                actionName: 'view'
            }
        });

    }

    //Redirects to the respective static/cms pages
    navigateToPage(event) {
        this.menuOpen = false;
        this.hideAllSubNavs();  //Close the open menu
        const pageApiName = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageApiName
            }
        });

    }
}