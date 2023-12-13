import { LightningElement, track ,wire} from 'lwc';
import trans from '@salesforce/apex/Lan_Trans.trans';;

export default class GoogleTranslate extends LightningElement {
    options;
    currentValue;
    @wire(trans)
    translate({data,error}){
        console.log('data'+ data);
        if(data){
           this.googleTranslateElementInit();
        }
        else if(error){
            console.log('error'+error);
        }  
    }
    googleTranslateElementInit(){
         window.google.translate.TranslateElement({pageLanguage: 'en'},this.options);
        }
}