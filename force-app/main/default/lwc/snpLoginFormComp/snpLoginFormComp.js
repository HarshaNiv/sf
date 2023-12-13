import { LightningElement, track } from 'lwc';
import doLogin from '@salesforce/apex/CommunityAuthController.doLogin';
import { NavigationMixin } from 'lightning/navigation';


export default class SnpLoginFormComp extends NavigationMixin(LightningElement) {
    username="";
    password="";
    @track errorCheck=false;
    @track errorMessage;
    ispassword=true;
    emailerrormsg=false;
    emailerrormsg2=false;
    passerrormsg=false;
    connectedCallback(){

        // var meta = document.createElement("meta");
        // meta.setAttribute("name", "viewport");
        // meta.setAttribute("content", "width=device-width, initial-scale=1.0");
        // document.getElementsByTagName('head')[0].appendChild(meta);
        this.clearLoginData();
    }
    clearLoginData() {
    //   window.localStorage.removeItem('loginData');
      window.localStorage.clear();

    }


    handleUserNameChange(event){

        this.username = event.target.value;
    }

    handlePasswordChange(event){
        
        this.password = event.target.value;
        console.log('***'+this.password);
    }

    forgotpasswordhandler(event){
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name:'Forgot_Password',
            }
        });
    }

    signuphandler(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name:'Register',
            }
        });
    }

    passwordtoggle(event){
        console.log("hode");
        var passwordField = this.template.querySelector('input[data-id="inputPassword"]');
        var eyeSign = this.template.querySelector('.fa');
        console.log(eyeSign);
        // toggle the type attribute
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        // toggle the eye / eye slash icon
        //eyeSign.classList.toggle('fa-eye');
        if (passwordField.type === "password") {
            this.ispassword=true;
        } else {
            this.ispassword=false;;
        }
    }
    
    handleLogin(event){

        if(this.username==="" && this.password===""){
            this.errorCheck=false;
            this.emailerrormsg=true;
            this.emailerrormsg2=false;
            this.passerrormsg=true;
        }else if(this.username===""){
            this.emailerrormsg=true;
            this.passerrormsg=false;
            this.emailerrormsg2=false;
        }else if(this.password===""){
            this.passerrormsg=true;
            this.emailerrormsg=false;
        }
        else if(this.username && this.password){
            const emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let email = this.template.querySelector('input[data-id="inputUsername"]');
             let emailVal=email.value ? email.value.trim() : '';
            if(emailVal.match(emailRegex)){
                event.preventDefault();
                doLogin({ username: this.username, password: this.password })
                    .then((result) => {
                        console.log('**'+result);
                        window.location.href = result;
                        // new
                        window.localStorage.setItem('loginData', JSON.stringify({ username: this.username, password: this.password }))

                    })
                    
                    .catch((error) => {
                        console.log('&&'+JSON.stringify(error));
                        this.error = error;      
                        this.errorCheck = true;
                        this.errorMessage = error.body.message;
                    });
                        this.emailerrormsg=false;
                        this.passerrormsg=false;
                        this.emailerrormsg2=false;
                }else {
                    // this.errorCheck=false;
                    this.emailerrormsg=false;
                    this.emailerrormsg2=true;
                    this.passerrormsg=false;
                }
               
            }
        }
        
           
    }