import { LightningElement } from 'lwc';

export default class Looping extends LightningElement {
    checkone= true;
    checktwo= false;
    loop(){
        this.checktwo= true; 
    }
}