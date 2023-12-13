import { LightningElement, track } from 'lwc';

export default class SnpStripePayment extends LightningElement {

    stripe;
    stripeInitialized = false;
    @track errorMsg = '';
    cardElement;

    renderedCallback() {
        if (!this.stripeInitialized) {
            this.checkStripeLoaded();
        }
    }

    checkStripeLoaded() {
        if (typeof window.Stripe !== "undefined") {
            this.initializeStripe();
        } else {
            // Retry or provide a user-friendly notification that Stripe didn't load
            console.error('Stripe library is not loaded.');
            this.errorMsg = 'Payment functionality is currently unavailable. Please try again later.';
        }
    }

    initializeStripe() {
        // Initialize Stripe only if it hasn't been already
        if (!this.stripe) {
            this.stripe = window.Stripe('pk_test_51NrjVHH1875OfnJj6UzE4XoGrZbf9J7cZKI5tWSpzDbqeVDkPY5Ry4gViOqFC7RYppFrcQiBzYCrrUsSKhFw2cuv002vkpASiI'); // replace with your actual key
            this.stripeInitialized = true;
            this.createCardElement();
        }
    }

    createCardElement() {
        // Assuming stripe is already initialized
        const elements = this.stripe.elements();

        // Create instance of card Element
        this.cardElement = elements.create('card');


        // Check if the container for the card element is rendered
        const cardElementContainer = this.refs.cardContainer;

        if (cardElementContainer) {

            this.cardElement.mount(cardElementContainer);
        } else {
            this.errorMsg = 'Unable to find element to mount card.';
        }
    }

    submitPayment() {
        if (!this.stripe || !this.cardElement) {
            this.errorMsg = 'Payment functionality not initialized. Please refresh the page.';
            return;
        }

        this.stripe.createToken(this.cardElement).then((result) => {
            if (result.error) {
                // Display error message
                this.errorMsg = result.error.message;
            } else {
                // Here you should send the token to your server or handle it according to your needs
                this.errorMsg = '';
                console.log(result.token);
            }
        }).catch(error => {
            // Don't forget to handle exceptions
            this.errorMsg = error.message;
        });
    }





}