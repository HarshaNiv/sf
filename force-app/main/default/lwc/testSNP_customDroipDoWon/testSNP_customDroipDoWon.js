import { LightningElement, track } from 'lwc';

export default class TestSNP_customDroipDoWon extends LightningElement {
    @track isOpen = false;
    @track isOptionSelected = false;
    @track selectedLabel = 'Select Option';
    @track isOptionOneSelected = false;
    @track isOptionTwoSelected = false;

    cars=['Martine','lamborgini','Ferrari'];

    handleOptions(event){
        console.log('event is triggered',event);
    }
    opneDropDown()
    {   
        setTimeout(()=>{
          this.isOpen=true;
        },0)
    }
    closeDrowDown()
    {
        setTimeout(()=>{
            this.isOpen=false;
        },300)
      
    }
    items(event)
    {
        let ResultLabel= event.currentTarget.dataset.item;
        console.log(ResultLabel);
        this.selectedLabel=ResultLabel;
        setTimeout(()=>{
            this.isOpen=false;
        },0)
    }
   
}