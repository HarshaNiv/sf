import { LightningElement,wire} from 'lwc';
import project1 from '@salesforce/apex/project1.project1';

const columns = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    { label: 'Type', fieldName: 'Type', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' }
]

export default class DataTable extends LightningElement {

    data=[];

    columns=columns; 
    ischeck= false;
    handler(){
        this.ischeck=true;
    project1()
        .then(result=>{
             this.data =result;
        }
        )
        .catch(error=>{
            console.log(error);
        }
        )
    }
    finish(){
        this.ischeck= false; 
    }
}