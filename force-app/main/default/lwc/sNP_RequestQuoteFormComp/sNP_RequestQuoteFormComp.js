import { LightningElement } from 'lwc';
import MyModal from 'c/sNP_Quotemodal';
import isguest from '@salesforce/user/isGuest';
import getProductdetails from '@salesforce/apex/ManagedContentController.getProductdetails';

export default class SNP_RequestQuoteFormComp extends LightningElement {
    showRequestQuote=true;
    isGuestUser = isguest;
    url;
    spliturl;
    productname;
    product;
    productid;
    ProductClass;

    connectedCallback(){
        if(this.isGuestUser){
            this.showRequestQuote=false;
        }

    }

    renderedCallback(){
        this.url=window.location.href;
        this.spliturl=this.url.split('/');
        this.productname=this.spliturl[this.spliturl.length-2];
        this.product=this.spliturl[this.spliturl.length-1];
        this.productid=this.product.substring(0,18);
        
        getProductdetails({productid:this.productid})
        .then((result) => {
            this.ProductClass=result.ProductClass;
            console.log("sku"+JSON.stringify(this.ProductClass));
            this.productvariationhandler();
        })
        .catch((error) => {
            console.log("sku"+JSON.stringify(error));
        });
    }

    productvariationhandler(){
       
        if(this.ProductClass=='Simple'|| this.ProductClass=='Variation'){
            const btn= this.template.querySelector('.quote-Button1');
            console.log('button'+btn);
            btn.removeAttribute("disabled");
            const btnelement=this.template.querySelector('.quote-Button1').classList;

            btnelement.add("quote-Button2");
            btnelement.remove("quote-Button1")

        }
    }

    async handleClick() {
       
       const result = await MyModal.open({
           size: 'small',
           description: 'Accessible description of modal\'s purpose',
           content: 'hiiii',
       });
       
       
   }
}