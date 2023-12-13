import { LightningElement,api } from 'lwc';
import multiCurrencyIconImage from '@salesforce/resourceUrl/multiCurrencyIconImage';

 /**
  *@slot Redirection-Home-Button
  *@slot Result-Page
*/

export default class Snp_No_serchresultPage extends LightningElement {

    @api totalResultInPage;
   image = multiCurrencyIconImage
   apple = 0;
   showNoResultImage = false;

    renderedCallback(){
    console.log('one');
    setTimeout(()=>{
        console.log('two');
        console.log("Krishnamurthy -->",this.totalResultInPage);
    this.apple = this.totalResultInPage;
    // console.log(this.totalResultInPage);

    if(this.apple == undefined || this.apple == 0){
        this.apple = -1;
    }

    if(this.apple == -1   ){
        this.showNoResultImage = true;
        console.log('I am working ----->Krishna');
    }
    },3000)
}
}