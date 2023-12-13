import { LightningElement } from 'lwc';
import activeLanguages from '@salesforce/site/activeLanguages';
import sid from '@salesforce/community/Id';
//import LightningAlert from 'lightning/alert';
//import LightningPrompt from 'lightning/prompt';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import currentLanguage from '@salesforce/i18n/lang';
import userlang from '@salesforce/apex/Langswitch.userlang';
//import checkoutlang from '@salesforce/apex/Langswitch.checkoutlang';
import changeCurrency from '@salesforce/apex/Langswitch.changeCurrency';
//import cart from '@salesforce/apex/Langswitch.cart';
import guestUser from '@salesforce/user/isGuest';
import UserId from '@salesforce/user/Id';
export default class Multilang extends LightningElement {
    currentValue;
    selectedLanguageCode;
    checkuser=true;
    hasCheckout;
    get options() {
        debugger;
        console.log('activeLanguages'+JSON.stringify(activeLanguages));
        return activeLanguages.map((x) => ({ value: x.code, ...x }));
    }
    
//    connectedCallback(){
//     const url = window.location.href;
//     const pathname = window.location.pathname;
// this.hasCheckout = pathname.includes('checkout');
// console.log('hasCheckout----->+'+ hasCheckout);
//    }

    guestUserChangeCurrency(){
       changeCurrency()
            .then(result => {
                alert('Section id------------>'+JSON.stringify(result));
                console.log('Section id------------>' +result);
                
            })
            .catch(error => {
                // TODO Error handling
                alert('Section id------------>'+JSON.stringify(error));
                console.log('Section id------------>' +error);
            });
    }
   
    //currentValue= currentLanguage;
     handleLanguageSelect(evt) {
        debugger;
        console.log('id'+sid);
        this.selectedLanguageCode = evt.detail.value;
        this.guestUserChangeCurrency();
        if(!guestUser){
            this.checkuser= true;
            userlang({locale :this.selectedLanguageCode, userId : UserId})
           .then((result)=>{
            //this.currentValue=this.selectedLanguageCode;
            var url =window.location.href;
            window.location.href=url;
            window.location.href;
            //console.log("result"+ result);
           })
           .catch((error)=>{
            console.log("error"+ JSON.stringify(error));
           })
        }else{
            this.checkuser= false;
            // LightningPrompt.open({
            //     message: "For guest user currency cannot be changed",
            //     theme: "error",
            //     label: "Prompt Header",
            //     defaultValue: "Test"
            //   }).then((result) => {
            //     console.log("🚀 ~ result", result);
            //   });
            // await LightningAlert.open({
            //     message: 'For guest user currency cannot be changed',
            //     theme: 'error', // a red theme intended for error states
            //     label: 'Error!', // this is the header text
            // });
            // const event = new ShowToastEvent({
            //     title: 'Error!',
            //     message: 'For guest user currency cannot be changed',
            //     variant: 'error',
            //     mode: 'dismissable'
            // });
            //this.dispatchEvent(event);
            //console.log('For guest user currency cannot be chnaged');
        }
        
        //console.log('this.selectedLanguageCode'+this.selectedLanguageCode);
        this.newcart();   
        // if(this.hasCheckout== true){
        //     this.Checkoutcurrency();
        // }       
}
newcart(){
    cart({locale :this.selectedLanguageCode, userId : UserId})
    .then((result)=>{
        //alert('New cart created');
                console.log('New cart created');
    })
    .catch((error)=>{
       // alert('cart was not created');
                console.log('cart was not created');
    })
}
Checkoutcurrency(){
    if(!guestUser){
        this.checkuser= true;
        checkoutlang({locale :this.selectedLanguageCode, userId : UserId})
       .then((result)=>{
        //this.currentValue=this.selectedLanguageCode;
        var url =window.location.href;
        window.location.href=url;
        window.location.href;
        //console.log("result"+ result);
       })
       .catch((error)=>{
        console.log("error"+ error);
       })
    }else{
        this.checkuser= false;
    }
}
}