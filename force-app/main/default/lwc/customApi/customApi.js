import { LightningElement,api,track} from 'lwc';
import { trackViewReco, trackClickReco } from 'commerce/activitiesApi';
import getRecs from '@salesforce/apex/recsController.getRecs';
import LANG from '@salesforce/i18n/lang';
import DIR from '@salesforce/i18n/dir';

export default class MyComponent extends LightningElement {
    lang = LANG;
    dir = DIR;
@api sample;
@api inputrecommender;
    title = '';
    recommender = 'RecentlyViewed';
    anchorValues = '';
    uuid = '';
    loading = false;
    showProducts = false;
    products = [];
// @track pro={};
connectedCallback() {
    
    this.onLoadComponent();

}

onLoadComponent() {
    let pageProductId = this.getProductDetailProductId();
    if (pageProductId) {
        this.title = this.inputrecommender;
        this.recommender = this.inputrecommender;
        this.anchorValues = pageProductId;
    } else {
        this.title = 'Recently Viewed';
        this.recommender = 'RecentlyViewed';
        this.anchorValues = '';
    }      
    this.loadProductRecommendations();
}

handleClickProduct(event) {    
    let productId = event.currentTarget.dataset.pid;
    let recName = this.recommenderNames();
    let uuid = this.uuid;
    let products = this.products;
    let product = products.filter(p => p.id === productId)[0];
    let productToSend = {
        id: product.id,
        price: product.prices ? product.prices.listPrice : undefined,
    };
    console.log('productToSend'+productToSend);
    trackClickReco(recName, uuid, productToSend);

    let storeName = 'Flipkart';
    let productName = product.name || 'detail';
    let newHref = `/${storeName}/product/${productName}/${productId}`;
    console.log('newHref'+newHref);
    window.location.href = newHref;
}

loadProductRecommendations(){
    try {
        this.loading = true;
        getRecs({
            recommender: this.recommender,
            anchorValues: this.anchorValues,
            cookie: document.cookie
        })
            .then((result) => {
                console.log(result);
                console.log('result- ', result);
                    let data = JSON.parse(result);
                        console.log('Data after Parse- ',data);
                        let pro = data.productPage.products;
                        console.log('products- ', pro);
                    // // Keep it simple, only show 4 products
                        this.products = pro.slice(0, 4);
                        console.log('Slice Product- ', this.products);
                        this.uuid = data.uuid;
                        console.log('uuid ', this.uuid);
                        this.loading = false;
                    let prolen =pro.length > 0;
                    if (prolen) {
                        this.sendViewRecoActivity();
                    }
                    
                    this.showProducts = true;
                    this.updateRecentlyViewedProducts();
                        
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
    console.log('recname-'+recName);
    let products = this.products.map(p => ({ id: p.id }));
    console.log('products-'+ products);
    let uuid = this.uuid;
    console.log('uuid-'+ uuid);
    trackViewReco(recName, uuid, products);
    console.log('trackViewReco(recName, uuid, products)'+ trackViewReco(recName, uuid, products));
}

getProductDetailProductId() { 
    let pid = this.sample;
    return pid;
}
//formatPrice(price, curr) {
 //   return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr}).format(price);
//}
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

}