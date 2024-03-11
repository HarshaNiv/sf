import { LightningElement ,wire} from 'lwc';
import { subscribe,unsubscribe,APPLICATION_SCOPE,MessageContext} from 'lightning/messageService';
import PeerlessMessageChannel from "@salesforce/messageChannel/PeerlessMessageChannel__c"
export default class Pdp_SKU_Peerlesspumps extends LightningElement {
    messageReceived;
    @wire(MessageContext)  
    context;
    connectedCallback(){                  //the subscription needs to be taked immediately, so we are using connected callback
        this.subscribeMessage();
    }
     
    subscribeMessage(){
        //context, channel reference, listener, subscriber options
         subscribe(this.context,PeerlessMessageChannel,(message)=>{this.handleIncomingMessage(message)},{scope:APPLICATION_SCOPE})
     
    }
     
    handleIncomingMessage(message)
    {
        this.messageReceived=message.sku.value? message.sku.value:'No Msg'; //if the data is there in lmsData, that data will be stored 
     
    }
}