import { LightningElement, api, wire} from 'lwc';
import { trackViewReco, trackClickReco } from 'commerce/activitiesApi';
import communityId from '@salesforce/community/Id';
import getRecs from '@salesforce/apex/snp_pdp_relatedProductsController.getRecs';
import ProductPrice from '@salesforce/apex/snp_pdp_relatedProductsController.ProductPrice';
import basePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';
import userId from '@salesforce/user/Id';
import isguest from '@salesforce/user/isGuest';

export default class Snp_pdp_relatedProducts extends NavigationMixin(LightningElement) {
    @api sample;
    @api inputrecommender;
    title = '';
    recommender = '';
    anchorValues = '';
    uuid = '';
    loading = false;
    showProducts = false;
    products = [];
    productList = [];
    productIdListForPrice = [];
    productIdPriceMap = {};
    priceList = [];
    CurrentStoreName = '';
    showRelatedProdcts=false;

    connectedCallback() {
        let splitStoreName = basePath.split("/");
        this.CurrentStoreName = splitStoreName[1];
        this.onLoadComponent();
    }

    onLoadComponent() {
        let pageProductId = this.getProductDetailProductId();
        if (pageProductId) {
            this.title = this.inputrecommender;
            this.recommender = this.inputrecommender;
            this.anchorValues = pageProductId;
        }
        this.loadProductRecommendations();
    }

    handleClickProduct(event) {
        let productId = event.currentTarget.dataset.pid;
        let recName = this.recommenderNames();
        let uuid = this.uuid;
        let products = this.productList;
        let product = products.filter(p => p.Id === productId)[0];
        let productToSend = {
            id: product.Id,
            price: product.prices ? product.prices.listPrice : undefined,
        };
        trackClickReco(recName, uuid, productToSend);

        let storeName = this.CurrentStoreName;
        let productName = product.name || 'detail';
        var baseurl = window.location.origin;
        let newHref = `${baseurl}/product/${productName}/${productId}`;
        window.location.href = newHref;

    }
    
    loadProductRecommendations(){
        try {
            this.loading = true;
            getRecs({
                recommender: this.recommender,
                anchorValues: this.anchorValues,
                cookie: document.cookie,
                communityId : communityId
            })
                .then((result) => {
                        let data = JSON.parse(result);
                            let pro = data.productPage.products;
                            if(pro.length > 0){
                                this.showRelatedProdcts=true;
                            }
                         
                            let pro1 = pro.slice(0, 2);
                            let pro2 = pro.slice(pro.length - 2, pro.length);
                            let proList = pro1.concat(pro2); 
                            proList.forEach((item) => {
                                this.productIdListForPrice.push(item.id)
                            })
                            this.products = proList;
                            this.productList = this.products.map(item => {
                                return {
                                    url: window.location.origin +'/sfsites/c' + item.defaultImage.url,
                                    Name: item.name,
                                    Id: item.id
                                };
                            });
                            this.getProductPrices();

                            this.uuid = data.uuid;
                            this.loading = false;
                        let prolen =pro.length > 0;
                        if (prolen) {
                            this.sendViewRecoActivity();
                        }

                    })
                    .catch ((error) => {
                        this.loading = false;
                    })
        } catch (error) {
            this.loading = false;
        }
    }

    sendViewRecoActivity() {
        let recName = this.recommenderNames();
        let products = this.products.map(p => ({ id: p.id }));
        let uuid = this.uuid;
        trackViewReco(recName, uuid, products);
    }
    
    getProductDetailProductId() { 
        let pid = this.sample;
        return pid;
    }
    formatPrice(price, curr) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr}).format(price);
    }
    recommenderNames() {
        switch (this.recommender) {
            case 'RecentlyViewed':
                return "recently-viewed";
                break;
            case 'SimilarProducts':
                return "similar-products";
                break;
            case 'MostViewedByCategory':
                return "most-viewed-by-category";
                break;
            case "TopSelling":
                    return "top-selling";
                    break;
            case "Upsell":
                return "upsell"
                break;
            case "ComplementaryProducts" :
                return "complementary-products"
                break;
            case "CustomersWhoBoughtAlsoBought" :
                return "customers-who-bought-also-bought"
                break;
            default:
                break;
        }
    }

    getProductPrices(){    
        // let prodIdList = ['01t0Y00000Bg4YtQAJ','01t1n00000Cky8qAAB','01t7Y00000Au3L3QAJ'];
        ProductPrice({userId: userId, productIds: this.productIdListForPrice, isGuest: isguest, communityId: communityId})
        .then(result => {
            let i = 0;
            this.priceList = result.pricingLineItemResults;
            (result.pricingLineItemResults).forEach(item => {
                this.productIdPriceMap[item.productId] = item.unitPrice;
                this.productList[i]['Price'] = item.unitPrice;
                i++
            });
            this.showProducts = true;

            
        })
        .catch(error => {
            console.log('Error Product Prices- ', error);
        });
    }
}