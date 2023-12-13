import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import forgotPassword from '@salesforce/apex/CommunityAuthController.forgotPassword'

export default class SnpForgotPasswordComp extends NavigationMixin(LightningElement) {
    username;
    emailerrormsg=false;

    usernamehandler(event){
        this.username= event.target.value;

    }
    resetHandler(){
        const emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let email = this.template.querySelector('input[data-id="forgotpassinputUsername"]');
        let emailVal=email.value.trim();
        if(emailVal.match(emailRegex)){
            this.emailerrormsg=false;
            forgotPassword({ username:this.username})
                    .then((result) => {
                        console.log('forgotPassword'+result);

                    })
                    .catch((error) => {
                        console.log('&&'+JSON.stringify(error));
                        this.error = error;      
                        this.errorCheck = true;
                        this.errorMessage = error.body.message;
                    });

            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                name:'Check_Password',
                }
            });
        }else{
            this.emailerrormsg=true;
        }
        
    }

    cancelHandler(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
            name:'Login',
            }
        });
    }

}