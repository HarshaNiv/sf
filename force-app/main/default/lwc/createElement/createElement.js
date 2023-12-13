import { LightningElement } from 'lwc';
//const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export default class CreateElement extends LightningElement {
    element;
    addClickListener() {
        document.addEventListener('click', this.handleClick);
      }
    
      removeClickListener() {
        document.removeEventListener('click', this.handleClick);
      }
    
      handleClick(event) {
       console.log(event);

}
}