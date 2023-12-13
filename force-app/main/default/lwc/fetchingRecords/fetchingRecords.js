import { LightningElement,wire} from 'lwc';
//import './fetchingRecords.css';
import project1 from '@salesforce/apex/testing.project1';
export default class FetchingRecords extends LightningElement {
    searchkey;
    colour;
    inpevent(eve){
        this.searchkey=eve.target.value;
    }
    @wire(project1,{accname :'$searchkey'})
      accounts;  
      clrevent(event){
        this.colour = event.target.value;
        console.log(this.colour);
      }

      cssevent(){
        const item = this.template.querySelector(".var")
        item.style.color = this.colour;
        console.log(this.template.querySelector(".var").style)
      }
}