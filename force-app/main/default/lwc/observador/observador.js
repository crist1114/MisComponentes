import { LightningElement,api } from 'lwc';
import {
    subscribe,
    unsubscribe,
    onError,
} from 'lightning/empApi';

export default class Observador extends LightningElement {
    channelName = '/event/refresh__e';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    @api recordId;

    subscription = {};

    // Tracks changes to channelName text field
    handleChannelName(event) {
        this.channelName = event.target.value;
    }

    // Initializes the component
    connectedCallback() {
        // Register error listener
        this.registerErrorListener();
        this.handleSubscribe();
    }

    handleSubscribe() {
        const messageCallback = function (response) {
            alert('mensaje recibido')
            location.reload();
            console.log('New message received: ', JSON.stringify(response));
         
        };

        subscribe(this.channelName, -1, messageCallback).then((response) => {
            
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
            this.subscription = response;
            this.toggleSubscribeButton(true);
        });
    }

   
    handleUnsubscribe() {
        this.toggleSubscribeButton(false);

     
        unsubscribe(this.subscription, (response) => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
         
        });
    }

    toggleSubscribeButton(enableSubscribe) {
        this.isSubscribeDisabled = enableSubscribe;
        this.isUnsubscribeDisabled = !enableSubscribe;
    }

    registerErrorListener() {
      
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
         
        });
    }
}
