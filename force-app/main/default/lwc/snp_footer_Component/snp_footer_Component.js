import { LightningElement } from 'lwc';
import LightningAlert from 'lightning/alert';
import { NavigationMixin } from 'lightning/navigation';
import SUNPOWERICONS from '@salesforce/resourceUrl/SUNPOWERICONS';
import Facebook from '@salesforce/resourceUrl/FaceBook_icon';
import Instagram from '@salesforce/resourceUrl/Instagram_icon';
import Twitter from '@salesforce/resourceUrl/twitter_icon';
import Youtube from '@salesforce/resourceUrl/youtube_icon';
import LinkedIn_Icon from '@salesforce/resourceUrl/LinkedIn_Icon';


export default class Footer_Component extends NavigationMixin(LightningElement) {
    facebookImg=Facebook;
    instagramImage=Instagram;
    twitterImage=Twitter;
    youtubeImage=Youtube;
    LinkedIn_Icon = LinkedIn_Icon;
    inputvalue=' ';
    contactUsIcon=SUNPOWERICONS+'/contactusicon.png';
    modelSuccess=false;
    modelFail=false;

    inputHandler(event){
        this.inputvalue=event.target.value;
        console.log('++'+this.inputvalue);
    }
    handleAlertClick(event) {
        debugger;
        event.preventDefault();

        if (this.inputvalue.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
            const form = this.template.querySelector('form');
            form.submit();
            // LightningAlert.open({
            //     message: 'Please enter a valid email id',
            //     theme: 'error', // a red theme intended for error states
            //     label: 'error!', // this is the header text
            // });
            this.modelSuccess=true;
        }else{
            // LightningAlert.open({
            //     message: 'Thank you for subscribing',
            //     theme: 'warning', // a red theme intended for error states
            //     label: 'SUCCESS!', // this is the header text
            // });
            this.modelFail=true;
        }

        // Commented to add validations for the email input.

        // if(this.inputvalue==null||this.inputvalue==' '){
        //     LightningAlert.open({
        //         message: 'Please enter a valid email id',
        //         theme: 'error', // a red theme intended for error states
        //         label: 'error!', // this is the header text
        //     });
        // }else{
        //     LightningAlert.open({
        //         message: 'Thank you for subscribing',
        //         theme: 'warning', // a red theme intended for error states
        //         label: 'SUCCESS!', // this is the header text
        //     });
            
        //     //Alert has been closed
        // }
        this.inputvalue=' ';
       
    }

    handleNavigateToCmsPage(event){
        console.log('Navigate to - ', event.currentTarget.dataset.name);       
        let navigationTab = event.currentTarget.dataset.name;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: navigationTab
            },
        });
        
    }
    modelHandlerSuccess()
    {
        this.modelSuccess=false;
    }
    modelHandlerFail()
    {
        this.modelFail=false;
    }

}