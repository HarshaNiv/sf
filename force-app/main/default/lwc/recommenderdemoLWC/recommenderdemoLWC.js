import { LightningElement, wire } from 'lwc';
import getRec from '@salesforce/apex/recommenderDemo.getRec';
export default class RecommenderdemoLWC extends LightningElement {

    @wire(getRec)
    wiredData({ error, data }) {
      if (data) {
        console.log('recommender demo', data);
      } else if (error) {
        console.error('Recommender Error:', error);
      }
    }
}