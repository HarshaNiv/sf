import { LightningElement, } from 'lwc';   
import prod_details from '@salesforce/apex/navigationclass.prod_details';
export default class Navigationmenu extends LightningElement {
    namelabel;
    home(){
        debugger;
        window.location.href;
    }
    Products(event){
        debugger;
        this.namelabel = event.target.label;
        prod_details({name : this.namelabel})
        .then((result)=>{
            console.log('result'+ result);
          var url= window.location.href
          window.location.href = url+'category/'+this.namelabel + '/'+ result.id;
          window.location.href;
        })
        
    }
    
}