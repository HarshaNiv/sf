import { LightningElement ,track,wire} from 'lwc';
import insertfields from '@salesforce/apex/Projectrec.insertfields';

export default class Taskcmp1 extends LightningElement {
 /**    @track data;
    @track error;
    name;
    description;
    start;
    end;**/
        nameevent(event)
        {
           var name = event.target.value ;
        }
        descriptionevent(event)
        {
            var description = event.target.value ;
        }
        startevent(event)
        {
            var start = event.target.value;
        }
        endevent(event)
        {
            var end = event.target.value;
        }
    

          @wire(insertfields,
            {
            Name : name,
            Description: description,
            Start : start,
            Enddate : end
           }
          ) 
          inserttask({ error, data })
          {
            if(data){
                console.log(data);
            }
            if(error){
                console.log(error);
            }
          }
    
        }