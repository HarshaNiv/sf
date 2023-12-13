import { LightningElement,wire } from 'lwc';
import getRecent from '@salesforce/apex/Rich_text.getRecent';

export default class Richtext extends LightningElement {

    imagevar1;
    @wire(getRecent)  
    imagevar({data,error}){
        if(data){
            console.log('data'+ data);
             const res =JSON.parse(data)
            // this.imagevar1 = res;
           // console.log('res'+ res);
           this.imagevar1= res.url_path__c;
           console.log('this.imagevar1'+ JSON.stringify(this.imagevar1));
           //this.imagevar1 = res.attributes.Photo__c;
        //    let splitimg = this.imagevar1.split(" ");
        //    console.log('splitimg - ', splitimg);

        }
        if(error){
            this.error = error;
        }
    }
        
    }