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
        //console.log('userId : ', userId);
        //console.log('OUTPUT isguest user : ', isguest);
        // console.log('communityBasePath-- ',communityBasePath);
        let splitStoreName = basePath.split("/");
        // console.log('splitStoreName -- ', splitStoreName);
        // console.log('splitStoreName -- ', splitStoreName[0]);
        this.CurrentStoreName = splitStoreName[1];
        console.log('relatedProduct store Name : ', this.CurrentStoreName);
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
        // console.log('productToSend'+productToSend);
        trackClickReco(recName, uuid, productToSend);

        let storeName = this.CurrentStoreName;
        let productName = product.name || 'detail';
        let newHref = `/${storeName}/product/${productName}/${productId}`;
        // console.log('newHref'+newHref);
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
                    console.log('relatedProduct getRecords - ', result);
                    //console.log('recommendation result- ', result);
                        let data = JSON.parse(result);
                            console.log('relatedProduct result after Parse- ',data);
                            let pro = data.productPage.products;
                            if(pro.length > 0){
                                this.showRelatedProdcts=true;
                            }
                            // console.log('products- ', pro);
                            // console.log('pro lenght- ', pro.length);
                            let pro1 = pro.slice(0, 2);
                            let pro2 = pro.slice(pro.length - 2, pro.length);
                            // console.log('pro1 - ' , pro1.length ,' ', JSON.stringify(pro1));
                            // console.log('pro2 - ' , pro2.length ,' ', JSON.stringify(pro2));
                            let proList = pro1.concat(pro2); 
                            console.log('relatedProduct final product list- ', proList);
                            proList.forEach((item) => {
                                this.productIdListForPrice.push(item.id)
                            })
                            //console.log('this.productIdListForPrice- ', this.productIdListForPrice);
                            this.products = proList;
                            this.productList = this.products.map(item => {
                                return {
                                    url: basePath + '/sfsites/c' + item.defaultImage.url,
                                    Name: item.name,
                                    Id: item.id
                                };
                            });
                            this.getProductPrices();

                            // console.log('Slice Product- ', this.products);
                            this.uuid = data.uuid;
                            // console.log('uuid ', this.uuid);
                            this.loading = false;
                        let prolen =pro.length > 0;
                        if (prolen) {
                            this.sendViewRecoActivity();
                        }
                        // this.showProducts = true;

                    })
                    .catch ((error) => {
                        console.error('Error fetching recommendations', error);
                        this.loading = false;
                    })
        } catch (error) {
            console.error('Failed to load recommendations: ', error);
            this.loading = false;
        }
    }

    sendViewRecoActivity() {
        let recName = this.recommenderNames();
        //console.log('recname-'+recName);
        let products = this.products.map(p => ({ id: p.id }));
        //console.log('products-'+ products);
        let uuid = this.uuid;
        //console.log('uuid-'+ uuid);
        trackViewReco(recName, uuid, products);
        //console.log('trackViewReco(recName, uuid, products)'+ trackViewReco(recName, uuid, products));
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
                console.log('Condition is not  a recomender');
                break;
        }
    }

    getProductPrices(){
        // debugger;
        // console.log('Product Prices UserId- ', userId);
        // console.log('this.productIdListForPrice in getProductPrices method- ', this.productIdListForPrice);
        // let prodIdList = ['01t0Y00000Bg4YtQAJ','01t1n00000Cky8qAAB','01t7Y00000Au3L3QAJ'];
        console.log('relatedProduct Inside getProductPrices : ');
        ProductPrice({userId: userId, productIds: this.productIdListForPrice, isGuest: isguest, communityId: communityId})
        .then(result => {
            // debugger;
            let i = 0;
            this.priceList = result.pricingLineItemResults;
            console.log('relatedProduct Product Prices- ',result);
            (result.pricingLineItemResults).forEach(item => {
                this.productIdPriceMap[item.productId] = item.listPrice;
                this.productList[i]['Price'] = item.listPrice;
                i++
            });
            //console.log('this.productIdPriceMap- ' , this.productIdPriceMap);
            //console.log('this.productList -- ', this.productList);
            this.showProducts = true;

            
        })
        .catch(error => {
            console.log('Error Product Prices- ', error);
        });
    }
}