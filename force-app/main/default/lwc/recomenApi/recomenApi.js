import { LightningElement,api,track,wire} from 'lwc';
import { trackViewReco, trackClickReco } from 'commerce/activitiesApi';
import { NavigationMixin } from 'lightning/navigation';
import getRecs from '@salesforce/apex/recsController.getRecs';
import getRecent from '@salesforce/apex/Recent_Pro.getRecent';
//c/fetchingRecordsimport getrecent from '@salesforce/apex/RecsController.getRecs';

export default class RecomenApi extends NavigationMixin(LightningElement) {
    @api sample;
    @api inputrecommender;
     title = '';
     recommender = 'RecentlyViewed';
     anchorValues = '';
     uuid = '';
     loading = false;
     showProducts = false;
     recentproducts;
     products = [];
    @track recentlyViewedProducts;
    productImg='';
    textcon='';
    prodId ='';
    @track pro={}
    protext;
    @track pdpData={};
     //data={};
    
    connectedCallback() {
        
        this.onLoadComponent();
        //this.getrecentviewed();
        // debugger
        // try{
        // getRecent({productid:this.sample})
        // .then((result) => {
        //  console.log('clickedproducts'+result);
        // let recentdata ={
        //     proid : result.id,
        //     productImg : result.defaultImage.url,
        //     productname : result.name
        // }
        // let proArr = [];
        //  proArr.push(recentdata)
        //  console.log('productArr'+ productArr);
        //  let recentDataString = JSON.stringify(proArr);
        // console.log('pdpDataString'+ recentDataString);
        // localStorage.setItem('recently_viewed', recentDataString)
        // })
        // .catch((error) => {
        //     console.error('Error fetching recommendations', error);
        //  } )
        // }
        // catch(error){
        //     console.error('Error fetching recommendations', error);
        // }
        //this.getrecentviewed();
        //this.recentlyViewedProducts= this.updateRecentlyViewedProducts();
       // this.recentproducts = true;
       //this.recentlyViewedProducts=this.getRecentlyViewedProducts();
       //console.log('getRecentlyViewedProducts()'+this.getRecentlyViewedProducts());
        //this.trackViewReco = trackViewReco;
        //this.trackClickReco = trackClickReco;

    }

    onLoadComponent() {
        let pageProductId = this.getProductDetailProductId();
        // if(pageProductId == null){
        //     pageProductId = this.prodId;
        // }
        // try{
        // getRecent({productid:pageProductId})
        // .then((result) => {
        //  console.log('result'+result);
        // let recentdata ={
        //     proid : result.id,
        //     productImg : result.defaultImage.url,
        //     productname : result.name
        // }
        // let proArr = [];
        //  proArr.push(recentdata)
        //  console.log('productArr'+ productArr);
        //  let recentDataString = JSON.stringify(proArr);
        // console.log('pdpDataString'+ recentDataString);
        // localStorage.setItem('recently_viewed', recentDataString)
        // })
        // .catch((error) => {
        //     console.error('Error fetching recommendations', error);
        //  } )
        // }
        // catch(error){
        //     console.error('Error fetching recommendations', error);
        // }
        if (pageProductId) {
            this.title = this.inputrecommender;
            this.recommender = this.inputrecommender;
            this.anchorValues = pageProductId;
        } else {
            this.title = 'Recently Viewed';
            this.recommender = 'RecentlyViewed';
            this.anchorValues = '';
        }  
        //console.log(document.cookie);
        this.loadProductRecommendations();
    }

    handleClickProduct(event) {
       // localStorage.clear();
       let productId = event.currentTarget.dataset.pid;
        this.prodId = productId;
        let img ='';
        let text='';
        //localStorage.getItem('recently_viewed');
        //console.log("localStorage.getItem('recently_viewed')" + localStorage);
        console.log('event.target.dataset.idevent.target.dataset.id'+ event.target.dataset.id);
        if(event.target.dataset.id == 'text'){
         img = event.target.name;
         text = event.target.textContent;
        console.log("img " + img );
        console.log("text" + text);
    }
    if(event.target.dataset.id == 'image'){
        img = event.target.src;
        text = event.target.name;
       console.log("img " + img );
       console.log("text" + text);
   }
   this.protext = text;
    this.pdpData = {
    proid : productId,
   productImg : img,
   productname : text 
    }
   console.log("pdpData" + this.pdpData);
   let productArr = [];
   productArr.push(this.pdpData)
   console.log('productArr'+ productArr);
   const pdpDataString = JSON.stringify(productArr);
   console.log('pdpDataString'+ pdpDataString);
   let localData = localStorage.getItem('recently_viewed');
   console.log('localData'+ localData);
   if(localData != null){
    let  jsonResp = JSON.parse(localData);
    let  jsonRespArr =[];
    //let filteredProducts = jsonResp.filter(item => item.hasOwnProperty('proid'));
    jsonRespArr = jsonResp.concat(productArr);
    console.log('jsonRespArr'+ jsonRespArr);
    let  jsonRespArrStr = JSON.stringify(jsonRespArr);
   localStorage.setItem('recently_viewed', jsonRespArrStr);
     console.log('localStorage'+ localStorage);
   }
   if(localData == null){
      localStorage.setItem('recently_viewed', pdpDataString);
   }
   //this.updateRecentlyViewedProducts();
    if((this.recommender =='RecentlyViewed')){
       // this.anchorValues =  this.sample;
//     this.recommender =='SimilarProducts';
       this.navigateToProductDetail();
    }
    if((this.recommender =='SimilarProducts'|| this.recommender == 'CustomersWhoBoughtAlsoBought' || this.recommender == 'ComplementaryProducts')){
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
        //console.log('this.addRecentlyViewedProduct(product.id)'+ this.addRecentlyViewedProduct(product.id));
    }
    }

    loadProductRecommendations(){
        try{
            getRecent({productid:this.anchorValues})
            .then((result) => {
             console.log('clickedproducts'+result);
             let clickedproducts = JSON.parse(result);
             this.pdpData ={
                proid : clickedproducts.id,
                productImg : clickedproducts.defaultImage.url,
                productname : clickedproducts.fields.Name
            }
            console.log('this.pdpData'+ this.pdpData);
            let proArr = [];
             proArr.push(this.pdpData)
             console.log('proArr'+ proArr);
             let recentDataString = JSON.stringify(proArr);
            console.log('recentDataString'+ recentDataString);
            let localData1 = localStorage.getItem('recently_viewed');
            console.log('localData'+ localData1);
            if(localData1 != null){
              let  jsonResp1 = JSON.parse(localData1);
              let  jsonRespArr1 =[];
              //let filteredProducts = jsonResp.filter(item => item.hasOwnProperty('proid'));
              jsonRespArr1 = jsonResp1.concat(proArr);
             console.log('jsonRespArr'+ jsonRespArr1);
             let  jsonRespArrStr1 = JSON.stringify(jsonRespArr1);
             console.log('jsonRespArrStr1'+ jsonRespArrStr1);
            localStorage.setItem('recently_viewed', jsonRespArrStr1);
            console.log('localStorage'+ localStorage);
   }
          if(localData1 == null){
             localStorage.setItem('recently_viewed', recentDataString);
               } 
            })
            .catch((error) => {
                console.error('Error fetching recommendations', error);
             } )
            }
            catch(error){
                console.error('Error fetching recommendations', error);
             }
        console.log('this.recommender- ', this.recommender, 'this.anchorValues- ', this.anchorValues, 'document.cookie- ', document.cookie);
        if(this.recommender =='SimilarProducts' || this.recommender =='CustomersWhoBoughtAlsoBought' || this.recommender == 'ComplementaryProducts'){
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
                        // this.showProducts = products.length > 0;
                        let prolen =pro.length > 0;
                        if (prolen) {
                            this.sendViewRecoActivity();
                        }                       
                        this.showProducts = true;
                        this.recentproducts= false;                        
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
    else if(this.recommender =='RecentlyViewed'){
        this.products= this.updateRecentlyViewedProducts();
        //this.sendViewRecoActivity();
        this.loading = false;
        this.showProducts = true;
        this.recentproducts= true; 
    }
    }

    sendViewRecoActivity() {
        //let trackViewReco = this.template.querySelector('[data-id="activitiesApi"]').trackViewReco;
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
        //let pageProductIdMatch = window.location.href.match(new RegExp('01t[a-zA-Z0-9]{15}'));
        //console.log(pageProductIdMatch);
         //let pid = pageProductIdMatch ? pageProductIdMatch[0] : null;
       // let pid = '01t5h000008dbKvAAI';
        //let pid = null;
        //console.log(pageProductIdMatch);
       //return pid;
    //   let  url = new URL(window.location.href);
    //   console.log('url' + url);
    //   let pathnameParts = url.pathname.split('/');
    //   console.log('pathnamePart' + pathnameParts);
    //   let productId = pathnameParts[pathnameParts.length - 1];
    //   console.log('productId' + productId);
    //   return productId;
    }
    formatPrice(price, curr) {
       return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: curr}).format(price);
   }
    recommenderNames() {
        // return{
        // 'RecentlyViewed' : "recently-viewed",
        // "SimilarProducts" : "similar-products",
        // "MostViewedByCategory" : "most-viewed-by-category",
        // "TopSelling" : "top-selling",
        // "Upsell" : "upsell"
        // }  
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
    updateRecentlyViewedProducts(){
        //localStorage.clear();
        let recentpro= JSON.parse(localStorage.getItem('recently_viewed'));
        let filteredProducts = recentpro.filter(item => item.hasOwnProperty('proid'));
        let uniqueProducts = filteredProducts.filter(
            (item, index) => index === filteredProducts.findIndex((p) => p.proid === item.proid)
          );
          
       console.log('recentpro'+ uniqueProducts);
      // var prod= new set();
      // prod.add(filteredProducts);
      // console.log('prod'+ prod);
      //recentlyViewedProducts = [];
       //this.recentproducts=true;
       console.log('this.recentlyViewedProducts'+ uniqueProducts);
       return uniqueProducts;
    }
    // getrecentviewedproducts(){
    //     try {
    //         //this.loading = true;
    //         getRecs({
    //             recommender: this.recommender,
    //             anchorValues: this.anchorValues,
    //             cookie: document.cookie
    //         })
    //         .then((result) => {
    //             console.log(result);
    //             console.log('result- ', result);
    //                 let data = JSON.parse(result);
    //                  console.log('Data after Parse- ',data);
    //                  console.log('Slice Product- ', this.products);
    //                  this.uuid = data.uuid;
    //                  this.sendViewRecoActivity();
    //         })
    //         .catch ((error) => {
    //             console.error('Error fetching recommendations', error);
    //         })
    //     }
    //         catch (error) {
    //             console.error('Failed to load recommendations: ', error);
    //         }
        
    // }
    navigateToProductDetail(){
        let storeName = 'Flipkart';
        let proid = this.prodId;
        let productName = this.protext || 'detail';
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/${storeName}/product/${productName}/${proid}`
            }
        },
        true
        );
    }
    // getrecentviewed(){
    //     debugger;
        

    //  }
}