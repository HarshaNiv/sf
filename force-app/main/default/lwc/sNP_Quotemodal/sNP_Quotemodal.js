import LightningModal from 'lightning/modal';
import { api } from 'lwc';
import getProductdetails from '@salesforce/apex/ManagedContentController.getProductdetails';
import { NavigationMixin } from 'lightning/navigation';

export default class SNP_Quotemodal extends NavigationMixin(LightningModal) {

    @api content;
    showQuoteModel = false;
    showError1 = false;
    showError2 = false;
    showError3 = false;
    showError4 = false;
    successModel = false;
    //showError5=false;
    myvalue;
    url;
    spliturl;
    productname;
    product;
    productid;
    productsku;
    name;
    company;
    ProductClass;
    // email;
    description;
    property1 = false;
    mobwidth;


    renderedCallback() {
        this.url = window.location.href;
        this.spliturl = this.url.split('/');
        this.productname = this.spliturl[this.spliturl.length - 2];
        this.product = this.spliturl[this.spliturl.length - 1];
        this.productid = this.product.substring(0, 18);
        this.mobwidth = window.innerWidth;
        if (this.mobwidth < 400) {
            this.property1 = true;
        }
        getProductdetails({ productid: this.productid })
            .then((result) => {
                this.productsku = result.StockKeepingUnit;
                this.ProductClass = result.ProductClass;
                console.log("sku" + JSON.stringify(this.ProductClass));
            })
            .catch((error) => {
                console.log("sku" + JSON.stringify(error));
            });
    }
    productnamehandler(event) {
        event.target.value = this.productname;
    }
    skuhandler(event) {
        event.target.value = this.productsku;
    }

    namehandler(event) {
        const inputText = event.target.value;
        if (inputText === '') {
            this.showError1 = true;
            this.name = inputText;
        } else {
            this.showError1 = false;
            this.name = inputText;
        }
    }
    companyhandler(event) {
        const inputText = event.target.value;
        if (inputText === '') {
            this.showError2 = true;
            this.company = inputText;
        } else {
            this.showError2 = false;
            this.company = inputText;
        }
    }
    quantityhandler(event) {
        const inputText = event.target.value.replace(/[^0-9]/g, '');
        if (inputText === '') {
            this.showError3 = true;
            this.myvalue = '';
        } else {
            this.showError3 = false;
            this.myvalue = inputText;
        }
    }
    emailhandler(event) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let email1 = event.target.value;
        console.log('email1' + email1);
        let emailVal = email1 ? email1.trim() : '';
        console.log('emailVal' + emailVal);
        if (emailVal.match(emailRegex)) {
            this.showError4 = false;
            this.email = event.target.value;
            // console.log('emaimatched'+this.email);
        } else {
            this.showError4 = true;
            this.email = event.target.value;
            //   console.log('emailnotmatched'+this.email);
        }

    }

    submitForm(event) {
        event.preventDefault();
        if (!this.name || !this.myvalue || !this.company || !this.email) {
            if (!this.name) {
                this.showError1 = true;
            }
            if (!this.myvalue) {
                this.showError3 = true;
            }
            if (!this.company) {
                this.showError2 = true;
            }
            if (!this.email) {
                this.showError4 = true;
            }
            this.property1 = false;
            // console.log( this.name);
            // console.log(this.myvalue);
            // console.log(this.mail);
            // console.log(this.company);
            // this.showError5=true;
            console.log('formnotsubmitted');
            return false;
        } else {
            //this.showError5=false;
            this.showError1 = false;
            this.showError2 = false;
            this.showError3 = false;
            this.showError4 = false;
            // this.property1 = false;
            //debugger;
            // const form = this.template.querySelector('form');
            // form.submit();
            sessionStorage.setItem('productid', this.productid);
            const id = sessionStorage.getItem('productid');
            console.log('id-->' + id);
            console.log('fromsubmitted');
            debugger;

            if(true){
                this.successModel = true;
            }
            
            // LightningAlert.open({
            //     // console.log('krishna');
            //     message: "Thank you ! Our team will get back to you soon !",
            //     theme: "success",
            //     label: "Quote Sent Successfully"
            // }).then(() => {
            //     console.log("###Alert Closed");``
            // });
            //     setTimeout(() => {
            // window.location.href = this.url;
            //     }, 5000);
            // //    window.location.href=this.url;
            // console.log('url' + this.url);
            // this.redirctToSamePage();
        }
}

    //  async redirctToSamePage(){
    //     alert('Metbhod Called');
    //  await this[NavigationMixin.GenerateUrl]({
    //     type: 'standard__webPage',
    //     attributes: {
    //     url: ''
    //     }
    //     }).then(url => {
    //     window.open("https://www.google.com", "_self");
    //     });
    //     }

    hideModalBoxGuest(){
        this.successModel = false;
    }
}

// formreset(event){
//     const form=event.target;
//     form.reset();

// }



// async handleAlert() {
// await LightningAlert.open({
// message: "Thank you ! Our team will get back to you soon !",
// theme: "success",
// label: "Quote Sent Successfully"
// }).then(() => {
// console.log("###Alert Closed");
// });
// }