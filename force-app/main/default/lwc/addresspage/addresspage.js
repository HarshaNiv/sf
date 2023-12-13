import { LightningElement,track } from 'lwc';

export default class Addresspage extends LightningElement {
    stateData=false;

    addressData=false;

    Countrydata=false;

    @track firstName = null;

    @track LastName= null;

    @track StreetAddress=null;

    @track city=null;

 

    //for Address

    Addresslabel='Address Type';

    listaddress=['billing','shipping'];

    itemhandler(event){

        let selectedAddress = event.currentTarget.dataset.item;

        this.Addresslabel=selectedAddress;

        let requriedField= this.template.querySelector('.address-requried-field')

        requriedField.classList.add('label-remove');

        this.addressData=false;

    }

    buttonevent(){

        this.addressData=true;

    }

    //for country

    Countrylabel='country';

    listCountry=['india','usa','China'];

    itemhandlerCountry(event){

        let selectedCountry = event.currentTarget.dataset.item;

        this.Countrylabel=selectedCountry;

        let requriedField1= this.template.querySelector('.country-requried-field')

        requriedField1.classList.add('label-remove');

        this.Countrydata=false;

    }

    buttoneventCountry(){

        this.Countrydata=true;

    }

 

 

    //for state

    StateLabel='state/Province'

    listState=['Maharashtra','Gujrat','Telengana','Rajasthan'];

    itemhandlerstate(event){

        let selectedstate = event.currentTarget.dataset.item;

        this.StateLabel=selectedstate;

        let requriedField2= this.template.querySelector('.state-requried-field')

        requriedField2.classList.add('label-remove');

        this.stateData=false;

    }

    buttoneventState(){

        this.stateData=true;

    }

 

     // for address

     handleInputAddress() {

       

        this.addressData=false;

       

    }

    //for country

    handleInputCountry()

    {

     

        this.Countrydata=false;

        }

       

        //for state

    handleInputState()

        {

     this.stateData=false;

        }

 

    // for firstname

      handleInputLabelFirstname(event) {

        if (event.target.value !== "") {

            var targetLabel = this.template.querySelector(".fname-label");

            targetLabel.classList.add("labelup");

        }

        else {

            if (this.template.querySelector(".fname-label").classList.contains("labelup")) {

                this.template.querySelector(".fname-label").classList.remove("labelup");

            }

        }

    }

    //First Name Handler

    handleFirstNameChange(event)

    {

        console.log('i am code' , event.target.value);

 

        this.firstName = event.target.value;

        console.log(this.firstName)

        if (this.firstName == '' || this.firstName) {

            this.handelfnameError = false;

        } else {

            this.handelfnameError = true;

 

        }

 

        if (event.target.value !== "") {

            var targetLabel = this.template.querySelector(".fname-label");

            console.log('I am first -->');

            targetLabel.classList.add("labelup");

        }

        else {

            if (this.template.querySelector(".fname-label").classList.contains("labelup")) {

                this.template.querySelector(".fname-label").classList.remove("labelup");

            }

        }

    }

 

       //for last-name

       handleInputLabelLastname(event) {

        if (event.target.value !== "") {

            var targetLabel = this.template.querySelector(".lname-label");

            targetLabel.classList.add("labelup");

        }

        else {

            if (this.template.querySelector(".lname-label").classList.contains("labelup")) {

                this.template.querySelector(".lname-label").classList.remove("labelup");

            }

        }

    }

   

    //Last Name Handler

    handleLastNameChange(event) {

 

        this.LastName = event.target.value;

        console.log(this.LastName)

        if (this.LastName == '' || this.LastName) {

            this.handellnameError = false;

 

        } else {

            this.handellnameError = true;

 

        }

 

        if (event.target.value !== "") {

            var targetLabel = this.template.querySelector(".lname-label");

            targetLabel.classList.add("labelup");

        }

        else {

            if (this.template.querySelector(".lname-label").classList.contains("labelup")) {

                this.template.querySelector(".lname-label").classList.remove("labelup");

            }

        }

    }

 

     //for street address

     handleInputLabeStreetAddress(event) {

        if (event.target.value !== "") {

            var targetLabel = this.template.querySelector(".street-label");

            targetLabel.classList.add("labelup");

        }

        else {

            if (this.template.querySelector(".street-label").classList.contains("labelup")) {

                this.template.querySelector(".street-label").classList.remove("labelup");

            }

        }

    }

   

    //street address

    handleStreetAddressChange(event) {

 

        this.StreetAddress = event.target.value;

        console.log(this.StreetAddress)

        if (this.StreetAddress == '' || this.StreetAddress) {

            this.handellnameError = false;

        } else {

            this.handellnameError = true;

        }

 

        if (event.target.value !== "") {

            var targetLabel = this.template.querySelector(".street-label");

            targetLabel.classList.add("labelup");

        }

        else {

            if (this.template.querySelector(".street-label").classList.contains("labelup")) {

                this.template.querySelector(".street-label").classList.remove("labelup");

            }

        }

    }

 

//for city

handleInputLabeCity(event)

{

    if (event.target.value !== "") {

    var targetLabel = this.template.querySelector(".city-label");

    targetLabel.classList.add("labelup");

}

else {

    if (this.template.querySelector(".city-label").classList.contains("labelup")) {

        this.template.querySelector(".city-label").classList.remove("labelup");

    }

}

}

//for city

handleCityChange(event)

{

    this.city = event.target.value;

    console.log(this.city)

    if (this.city == '' || this.city) {

        this.handellnameError = false;

    } else {

        this.handellnameError = true;

    }

   

    if (event.target.value !== "") {

        var targetLabel = this.template.querySelector(".city-label");

        targetLabel.classList.add("labelup");

    }

    else {

        if (this.template.querySelector(".city-label").classList.contains("labelup")) {

            this.template.querySelector(".city-label").classList.remove("labelup");

        }

    }

  
}

 

 
}