import { LightningElement } from "lwc";
import { CloseActionScreenEvent } from "lightning/actions";

export default class CreateLeadModal extends LightningElement {
  closeAction() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }
}