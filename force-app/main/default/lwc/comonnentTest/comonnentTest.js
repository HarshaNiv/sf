import { LightningElement } from 'lwc';

export default class ComonnentTest extends LightningElement {
    checkTheword = true
    value = '';
    apple = true;
    buttonclicked(){
        this.checkTheword = !this.checkTheword;
    }
    handelChange(event){
        this.value=event.target.value;
        // console.log(this.value);
        // alert(this.value)
        if(this.value.length > 0){
            this.apple = false;
        }else{
            this.apple = true;
        }
    }
    removeplaceholder(event){
        // alert('i')
        if(this.apple)
        this.apple = false;
    }
}