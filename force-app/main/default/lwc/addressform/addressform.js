import { LightningElement } from 'lwc';

export default class Addressform extends LightningElement {
    value = [];

    get options() {
        return [
            { label: 'Ross', value: 'option1' },
            { label: 'Rachel', value: 'option2' },
        ];
    }
    enabled(){
        this.template.querySelectorAll('.input').forEach(item=>{
            item.disabled=false;
    })
}
}