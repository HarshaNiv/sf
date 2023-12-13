import { LightningElement,wire } from 'lwc';
import { loadScript} from "lightning/platformResourceLoader";
import Stripejs from "@salesforce/resourceUrl/Stripejs";
import {CartSummaryAdapter} from "commerce/cartApi";
import {CheckoutInformationAdapter,placeOrder,authorizePayment} from "commerce/checkoutApi";
import authorizepayments from '@salesforce/apex/Snp_Checkout_Controller.authorizepayments';
import createPaymentIntent from '@salesforce/apex/Snp_Checkout_Controller.createPaymentIntent';



export default class SNP_PaymentComponent extends LightningElement {
isStripeInitialized = false;
stripeLoadedInSession = false;
amount;
currencycode;
stripe_client_secret
elements;
paymentElement;
stripe;
paymentdone=true;
paymentIntentClientSecret;
billingAddress={
  name:"John Doe",
  street:"123 Acme Drive",
  city:"Los Angeles",
  region:"CA",
  //regionCode:"CA",
  country:"US",
  //countryCode:"US",
  postalCode:"90001"
}


connectedCallback() {
  debugger;
      loadScript(this, Stripejs + "/stripe.js")
          .then(() => {
              console.log('Stripe.js is loaded');
          })
          .catch(error => {
              console.error('Error loading Stripe.js', error);
          });
}

@wire(CartSummaryAdapter,{})
    checkoutInfo({ error, data }) {
                if (data) {
                    console.log("simplePurchaseOrder checkoutInfo checkoutInfo stripe: " +JSON.stringify(data));
                    this.currencycode=String(data.currencyIsoCode);
                    console.log(this.currencycode);
                    this.amount=parseInt(parseFloat(data.grandTotalAmount) * 100);
                    console.log(this.amount);
                    if(this.paymentdone){
                      this.getPaymentIntentID();
                      this.paymentdone=false;
                    }
                    
                    //data.grandTotalAmount;
                   
                } else if (error) {
                    console.log("##simplePurchaseOrder checkoutInfo Error stripe: " + error);
                }
    }

@wire(CheckoutInformationAdapter, {})
checkoutInfos({ error, data }) {
            if (data) {
                console.log("simplePurchaseOrder checkoutInfo checkoutInfo: " +JSON.stringify(data));
            } else if (error) {
                console.log("##simplePurchaseOrder checkoutInfo Error: " + error);
            }
        } 
 


renderedCallback(){

  //let params = this.getQueryParameters();
  //this.paymentIntentClientSecret = params['payment_intent_client_secret'];
  console.log('Payment Intent Client Secret:',this.paymentIntentClientSecret);
  //this.paymentdone=localStorage.getItem("paymentdone");
  //this.checkPaymentStatus();
 // if(this.paymentdone){
   // const { paymentIntent } =this.stripe.retrievePaymentIntent(paymentIntentClientSecret);
  // console.log(paymentIntent.status);  
 // }
 //this.authorizepayment();

        
}

 getPaymentIntentID(){
  debugger;
  createPaymentIntent({amount:this.amount,currencycode:this.currencycode})
            .then(result => {
              const resultJson = JSON.parse(result);
              //console.log('Payment Intent Created:', resultJson);
              //console.log('client_secret', resultJson.client_secret);
                this.stripe_client_secret=resultJson.client_secret;
                this.insertelement();
                // Handle the result as needed
            })
            .catch(error => {
                console.error('Error creating payment intent:', error);
                // Handle the error as needed
            });
    }


insertelement(){
  debugger;
   this.stripe =Stripe("pk_test_51NrjVHH1875OfnJj6UzE4XoGrZbf9J7cZKI5tWSpzDbqeVDkPY5Ry4gViOqFC7RYppFrcQiBzYCrrUsSKhFw2cuv002vkpASiI");
  const clientSecret  =this.stripe_client_secret;
  const appearance = {
    theme: 'stripe',
  };
  this.elements = this.stripe.elements({ appearance, clientSecret });
  // const paymentElementOptions = {
  //   layout: "tabs",
  // };
  const element = this.template.querySelector('.payment-element');
        if (element) {
        this.paymentElement = this.elements.create('payment');
          console.log(this.paymentElement);
          this.paymentElement.mount(element);
          //this.checkPaymentStatus()
        } else {
            console.error('Payment element not found in DOM');
        }
        
}





getQueryParameters() {
    let query = location.search.substr(1);
    let result = {};
    query.split("&").forEach(part => {
        let item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}



handlesubmit(event){
  event.preventDefault();
  authorizePayment('2z9JW00000007SvYAI')
  .then((result) => {
   console.log('****postAuthorizePayment'+JSON.stringify(result));
   //console.log('***'+result);
 })
 .catch((error) => {
 console.error('****postAuthorizePayment'+JSON.stringify(error));
 });
}
  //debugger;
  //    this.stripe.confirmPayment({
  //     elements: this.elements,
  //     payment_method: {
  //         card: this.paymentElement, // Use the specific payment Element
  //         // Add any other required payment method details here
  //     },
  //     confirmParams: {
  //         return_url: 'https://sunpowergroupholdingsltd--commsit.sandbox.my.site.com/PowerLEDQA/checkout',
  //     },
  // })
  // .then((result) => {
  //     if (result.error) {
  //         console.error(result.error.message);
  //         // Inform the customer that there was an error
  //     } else {
  //         // Handle next steps based on the result
  //     }
  // });
  // //postAuthorizePayment('2z9JW000000094vYAA','abc')
  // authorizePayment('2z9JW00000009UjYAI','03OJW0000000sGX2AY',this.billingAddress)
  //  .then(result => {
  //      console.log('Contact added with ID'+JSON.stringify(result));
  //      placeOrder()
  //      .then(result => {
  //       console.log('placeorder'+JSON.stringify(result));
  //       })
  //     .catch(error => {
  //       console.error('Erroradding placeorder'+ JSON.stringify(error));
  //     });
  //  })
  //  .catch(error => {
  //      console.error('Erroradding contact'+ JSON.stringify(error));
  //  });

//}
    // 
    //  //this.paymentdone=true;
    //  localStorage.setItem("paymentdone", "true");
    //  this.authorizepayments();

  //    this.stripe.confirmPayment({
  //     elements: this.elements,
  //     payment_method: {
  //         card: this.paymentElement, // Use the specific payment Element
  //         // Add any other required payment method details here
  //     },
  //     confirmParams: {
  //         return_url: 'https://sunpowergroupholdingsltd--commsit.sandbox.my.site.com/PowerLEDQA/checkout',
  //     },
  // })
  // .then((result) => {
  //     if (result.error) {
  //         console.error(result.error.message);
  //         // Inform the customer that there was an error
  //     } else {
  //         // Handle next steps based on the result
  //     }
  // });

//}

// async authorizepayments(){
//   debugger;
//   await authorizePayment('2z9JW00000007SvYAI')
//   //,'pi_3O67bCH1875OfnJj1fOtRaON_secret_LZtjzD7xZ6VDuhcGAQUDWyHpK',this.billingAddress)
//   .then((result) => {
//    console.log('****postAuthorizePayment'+JSON.stringify(result));
//    //console.log('***'+result);
//  })
//  .catch((error) => {
//  console.error('****postAuthorizePayment'+JSON.stringify(error));
//  });
// }

async checkPaymentStatus(){
  debugger;
  //this.paymentdone = localStorage.getItem("paymentdone");
  if (this.paymentdone) {
      try {
          console.log(this.stripe);
          await this.stripe.retrievePaymentIntent('pi_3O67bCH1875OfnJj1fOtRaON_secret_LZtjzD7xZ6VDuhcGAQUDWyHpK')
          .then((result) => {
            console.log('****'+result.paymentIntent.status);
            //console.log('***'+result); 
        })
        .catch((error) => {
          console.error(error);
        });
          //console.log(paymentIntent.status);
      } catch (error) {
          console.error('Error retrieving payment intent:', error);
      }
  }
}
    
    // This is your test publishable API key.


// The items the customer wants to buy
//const items = [{ id: "xl-tshirt" }];



// initialize();
//checkStatus();

// document
//   .querySelector("#payment-form")
//   .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
 //async function initialize() {
//   const response = await fetch("/create-payment-intent", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ items }),
//   });
  
//}
// 
// async function handleSubmit(e) {
//   e.preventDefault();
//   setLoading(true);

//   const { error } = await stripe.confirmPayment({
//     elements,
//     confirmParams: {
//       // Make sure to change this to your payment completion page
//       return_url: "http://localhost:4242/checkout.html",
//     },
//   });

//   // This point will only be reached if there is an immediate error when
//   // confirming the payment. Otherwise, your customer will be redirected to
//   // your `return_url`. For some payment methods like iDEAL, your customer will
//   // be redirected to an intermediate site first to authorize the payment, then
//   // redirected to the `return_url`.
//   if (error.type === "card_error" || error.type === "validation_error") {
//     showMessage(error.message);
//   } else {
//     showMessage("An unexpected error occurred.");
//   }

//   setLoading(false);
// }

// Fetches the payment intent status after payment submission
// async function checkStatus() {
//   const clientSecret = new URLSearchParams(window.location.search).get(
//     "payment_intent_client_secret"
//   );

//   if (!clientSecret) {
//     return;
//   }

//   const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

//   switch (paymentIntent.status) {
//     case "succeeded":
//       showMessage("Payment succeeded!");
//       break;
//     case "processing":
//       showMessage("Your payment is processing.");
//       break;
//     case "requires_payment_method":
//       showMessage("Your payment was not successful, please try again.");
//       break;
//     default:
//       showMessage("Something went wrong.");
//       break;
//   }
//}

// ------- UI helpers -------

// function showMessage(messageText) {
//   const messageContainer = document.querySelector("#payment-message");

//   messageContainer.classList.remove("hidden");
//   messageContainer.textContent = messageText;

//   setTimeout(function () {
//     messageContainer.classList.add("hidden");
//     messageContainer.textContent = "";
//   }, 4000);
// }

// // Show a spinner on payment submission
// function setLoading(isLoading) {
//   if (isLoading) {
//     // Disable the button and show a spinner
//     document.querySelector("#submit").disabled = true;
//     document.querySelector("#spinner").classList.remove("hidden");
//     document.querySelector("#button-text").classList.add("hidden");
//   } else {
//     document.querySelector("#submit").disabled = false;
//     document.querySelector("#spinner").classList.add("hidden");
//     document.querySelector("#button-text").classList.remove("hidden");
//   }
// }
}