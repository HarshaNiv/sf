import { LightningElement, track, api, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import COUNTRY_CODE from '@salesforce/schema/Account.BillingCountryCode';
import BILLING_STATE_CODE from '@salesforce/schema/Account.BillingStateCode';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
//import getCountryAndDialCode from '@salesforce/apex/snp_address_form_dialNumbers.countryDialCode';
import pointaddress from '@salesforce/apex/snp_address_form_dialNumbers.pointaddress';
import UserId from '@salesforce/user/Id';
import { NavigationMixin } from 'lightning/navigation';
// import AddressemessageChannel from '@salesforce/messageChannel/AddressemessageChannel__c';
// import { subscribe, MessageContext } from 'lightning/messageService';
export default class Snp_AddressForm extends NavigationMixin(LightningElement) {

    // subscription = null;
    // @wire(MessageContext) messageContext;
    addressidurl;
    connectedCallback() {
        //let addressidurl=window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        this.addressidurl = urlParams.get('addressId');
        console.log('this.addressidurl --',  this.addressidurl);
        // this.handleSubscribe();
    }
    // handleSubscribe() {
    //     if (this.subscription) {
    //         return;
    //     } 
    //     debugger;
    //     this.subscription = subscribe(this.messageContext, AddressemessageChannel, (addressformId) => {
    //         console.log('addressformId----'+JSON.stringify(addressformId));
    //         //this.publisherMessage = message.message;
    //         //this.ShowToast('Success', message.message, 'success', 'dismissable';
    //     });
    // }

    @api Recordtype;
    listCountry;
    listState;
    listState1;
    countryvalue
    _countries = [];
    _countryToStates = {};
    dialcode;
    checkval = false;
    url;

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo({ data, error }) {
        if (data) {
            const rtis = data.recordTypeInfos;
            this.Recordtype = data.defaultRecordTypeId;
            console.log('sample------------>' + this.Recordtype);
        }
        if (error) {
            console.log('error' + error);
        }
    }
    @wire(getPicklistValues, {
        recordTypeId: '$Recordtype',
        fieldApiName: COUNTRY_CODE
    }) wiredCountires({ data }) {
        console.log('datacountries1' + JSON.stringify(data));
        this.listCountry = data.values;
        console.log('datacountries' + this.listCountry);
    }


    @wire(getPicklistValues, { recordTypeId: '$Recordtype', fieldApiName: BILLING_STATE_CODE })
    wiredStates({ data }) {
        if (!data) {
            return;
        }
        console.log('data' + JSON.stringify(data));
        const validForNumberToCountry = Object.fromEntries(Object.entries(data.controllerValues).map(([key, value]) => [value, key]));
        console.log('validForNumberToCountry' + JSON.stringify(validForNumberToCountry));
        this._countryToStates = data.values.reduce((accumulatedStates, state) => {
            const countryIsoCode = validForNumberToCountry[state.validFor[0]];
            return { ...accumulatedStates, [countryIsoCode]: [...(accumulatedStates?.[countryIsoCode] || []), state] };
        }, {});
        console.log('this._countryToStates' + JSON.stringify(this._countryToStates));
    }
    // 
    // 
    //
    //  
    stateData;
    stateData1 = false;
    addressData = false;
    Countrydata = false;
    showLoader = false;

    @track handleCityValidError = false;
    @track handelPhoneValidError = false;
    @track handleAddressError = false;
    @track handleFirstNameError = false;
    @track handleLastNameError = false;
    @track handleCountryError = false;
    @track handleStreetError = false;
    @track handleCityError = false;
    @track handleStateError = false;
    @track handleZipError = false;
    @track handlePhoneError = false;
    @track handlecompanyError = false;
    showOptions = false;
    selectedstate1;




    @track firstName = null;
    @track LastName = null;
    @track StreetAddress = null;
    @track city = null;
    @track zip = null;
    @track Phone = null;
    @track Company = null;

    //for Address
    Addresslabel = 'Address Type';
    newlist = { 'label': '--None--', 'value': null };
    listaddress = ['Billing', 'Shipping'];
    itemhandler(event) {
        // debugger;
        // console.log("ok");
        let selectedAddress = event.currentTarget.dataset.item;
        this.Addresslabel = selectedAddress;
        this.showOptions = !this.showOptions;
        let requriedField = this.template.querySelector('.address-requried-field')
        requriedField.classList.add('label-remove');
        this.handleAddressError = false;
        setTimeout(() => {
            this.addressData = false
        }, 0)
    }


    buttonevent(event) {
        // console.log('hi');
        // debugger;
        event.currentTarget.focus();
        this.addressData = !this.addressData;
        this.showOptions = !this.showOptions;
        setTimeout(() => {
            var selectedaAddress = this.template.querySelectorAll('.options-list');
            var selectedaAddress1 = selectedaAddress[0].dataset.item;
            console.log('selectedaAddress--->' + selectedaAddress);
            console.log('selectedaAddress------->' + selectedaAddress1);
            for (var i = 0; i < selectedaAddress.length; i++) {
                if (selectedaAddress[i].dataset.item == this.Addresslabel) {
                    selectedaAddress[i].classList.add('selected-option');
                }
            }
        }, 1);

    }

    //for country
    Countrylabel = 'Country';
    listCountry = ['india', 'usa', 'China'];
    itemhandlerCountry(event) {
        //  debugger;
        this.showOptions = !this.showOptions;
        let selectedCountry = event.currentTarget.dataset.item;
        this.Countrylabel = selectedCountry;
        this.countryvalue = event.currentTarget.dataset.item1;
        this.listState1 = this._countryToStates[this.countryvalue]
        this.handleCountryError = false;
        getCountryAndDialCode({ countrylabel: selectedCountry })
            .then((result) => {
                console.log('result----------->' + result);
                this.dialcode = '+' + result;
                console.log('this.dialcode----------->' + this.dialcode);
            })
            .catch((error) => {
                console.log('error' + error);
            })
        let requriedField1 = this.template.querySelector('.country-requried-field')
        requriedField1.classList.add('label-remove');
        if (this.listState1 != null) {
            this.stateData1 = false;
            this.listState = this.listState1;
            this.StateLabel = 'State/Province';
            let statevar = this.template.querySelector('.state-requried-field');
            if (statevar.classList.contains('label-remove')) {
                statevar.classList.remove('label-remove');
            }
        } else {
            this.StateLabel = this.newlist.label;
            let statevar = this.template.querySelector('.state-requried-field');
            statevar.classList.add('label-remove');
            // this.stateData1=true;
        }
        this.Countrydata = false
    }
    buttoneventCountry(event) {
        event.currentTarget.focus();
        //console.log('-------------------->Ok');
        this.Countrydata = !this.Countrydata;
        this.showOptions = !this.showOptions;
        setTimeout(() => {
            var selectedaAddress = this.template.querySelectorAll('.options-list');
            var selectedaAddress1 = selectedaAddress[0].dataset.item;
            console.log('selectedaAddress--->' + selectedaAddress);
            console.log('selectedaAddress------->' + selectedaAddress1);
            for (var i = 0; i < selectedaAddress.length; i++) {
                if (selectedaAddress[i].dataset.item == this.Countrylabel) {
                    selectedaAddress[i].classList.add('selected-option');
                }
            }
        }, 0);
    }

    //for state
    StateLabel = 'State/Province';
    listState = ['Maharashtra', 'Gujrat', 'Telengana', 'Rajasthan'];
    itemhandlerstate(event) {
        //  debugger;
        this.showOptions = !this.showOptions;
        let selectedstate = event.currentTarget.dataset.item;
        this.StateLabel = selectedstate;

        let requriedField2 = this.template.querySelector('.state-requried-field')
        requriedField2.classList.add('label-remove');
        this.stateData = false;
        this.stateData1 = false;
        this.handleStateError = false;

    }
    buttoneventState(event) {
        event.currentTarget.focus();
        this.showOptions = !this.showOptions;
        if (this.listState1 != null) {
            //this.stateData1=!this.stateData1;  
            this.stateData = !this.stateData;
        } else {
            //this.stateData=!this.stateData;
            this.stateData1 = !this.stateData1;
        }
        setTimeout(() => {
            var selectedaAddress = this.template.querySelectorAll('.options-list');
            var selectedaAddress1 = selectedaAddress[0].dataset.item;
            console.log('selectedaAddress--->' + selectedaAddress);
            console.log('selectedaAddress------->' + selectedaAddress1);
            for (var i = 0; i < selectedaAddress.length; i++) {
                if (selectedaAddress[i].dataset.item == this.StateLabel) {
                    selectedaAddress[i].classList.add('selected-option');
                }
            }
        }, 0);
    }

    // for label AddressFo

    // for address
    handleInputAddress() {

        setTimeout(() => {
            this.addressData = false;
            this.showOptions = false;
        }, 300)

    }
    handleInputAddress1() {

        // const removelable= this.template.querySelector('list-options-address')
        // removelable.classList.add('')
        setTimeout(() => {
            this.addressData = false;
            this.showOptions = false;
        }, 200)

    }
    //for country
    handleInputCountry() {
        //console.log('------------------------------> okoko');
        setTimeout(() => {
            this.Countrydata = false;
            this.showOptions = false;
        }, 300)

    }

    //for state
    handleInputState() {
        setTimeout(() => {
            this.stateData = false;
            this.stateData1 = false;
            this.showOptions = false;
        }, 300)

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

    //address handler
    // addressChangeErrorGoes()
    // {
    //     if(this.Addresslabel!=='Address Type')
    //     {
    //        this.handleAddressError= false;
    //     } else
    //     {
    //         this.handleAddressError= true;
    //     }
    // }

    //First Name Handler
    handleFirstNameChange(event) {
        // console.log('i am code' , event.target.value);

        this.firstName = event.target.value;
        console.log(this.firstName)
        if (this.firstName == '' || this.firstName) {
            this.handleFirstNameError = false;
        } else {
            this.handleFirstNameError = true;

        }

        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".fname-label");
            // console.log('I am first -->');
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
            this.handleLastNameError = false;

        } else {
            this.handleLastNameError = true;

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
    //for Company
    handleInputCompany(event) {
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".company-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".company-label").classList.contains("labelup")) {
                this.template.querySelector(".company-label").classList.remove("labelup");
            }
        }
    }

    // 
    //Company
    handleCompanyChange(event) {

        this.Company = event.target.value;
        console.log(this.Company)
        if (this.Company == '' || this.Company) {
            this.handlecompanyError = false;

        } else {
            this.handlecompanyError = true;

        }

        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".company-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".company-label").classList.contains("labelup")) {
                this.template.querySelector(".company-label").classList.remove("labelup");
            }
        }
    }
    // 

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
            this.handleStreetError = false;
        } else {
            this.handleStreetError = true;
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
    handleInputLabeCity(event) {
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
    // City validation
    validateCity(inputValue) {
        const cityPattern = /^[a-zA-Z]+$/;
        return cityPattern.test(inputValue);
    }

    //for city
    handleCityChange(event) {
        this.city = event.target.value;
        console.log(this.city)
        const isValidCity = this.validateCity(this.city)
        console.log('validateCity-------->' + isValidCity);
        if (isValidCity != false) {
            this.handleCityValidError = false;
        } else {
            this.handleCityValidError = true;
            this.handleCityError = false;
        }
        if (this.city == '') {
            this.handleCityError = true;
            this.handleCityValidError = false;
        } else {
            this.handleCityError = false;
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

    // for zip 
    handleInputLabeZip(event) {
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Zip-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".Zip-label").classList.contains("labelup")) {
                this.template.querySelector(".Zip-label").classList.remove("labelup");
            }
        }
    }

    handleZipChange(event) {
        this.zip = event.target.value;
        console.log(this.zip)
        if (this.zip == '' || this.zip) {
            this.handleZipError = false;
        } else {
            this.handleZipError = true;
        }

        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Zip-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".Zip-label").classList.contains("labelup")) {
                this.template.querySelector(".Zip-label").classList.remove("labelup");
            }
        }
    }

    //for Phone number

    handleInputLabePhone(event) {
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Phone-label");
            targetLabel.classList.add("labelup");
        }
        else {
            this.handelPhoneValidError = false;
            if (this.template.querySelector(".Phone-label").classList.contains("labelup")) {
                this.template.querySelector(".Phone-label").classList.remove("labelup");
            }
        }
    }

    // Phone-Number validation
    validatePhoneNumber(number) {
        const phonePattern = /^\d+$/;
        return phonePattern.test(number);
    }

    handlePhoneChange(event) {
        this.Phone = event.target.value;

        console.log(this.Phone)
        const isValidPhoneNumber = this.validatePhoneNumber(this.Phone)
        console.log('isValidPhoneNumber-------->' + isValidPhoneNumber);
        if (isValidPhoneNumber != false) {
            this.handelPhoneValidError = false;
        } else {
            this.handelPhoneValidError = true;
            this.handlePhoneError = false;
        }

        if (this.Phone != '') {
            this.handlePhoneError = false;
            var targetLabel = this.template.querySelector(".Phone-label");
            targetLabel.classList.add("labelup");
            //this.Phone = true;

        } else {
            // this.handelPhoneValidError=false;  
            if (this.template.querySelector(".Phone-label").classList.contains("labelup")) {
                this.template.querySelector(".Phone-label").classList.remove("labelup");
            }
        }
    }

    //checkbox
    handleInputLabel() {
        console.log('check');

    }
    checkboxValidation(event) {
        // debugger;
        this.checkval = event.target.checked;
        console.log('this.checkval----------->' + this.checkval);
    }
    //on click of sumbit
    handlerSumbit() {
        this.showLoader = true;
        let submitPhoneCheck = this.validatePhoneNumber(this.Phone)
        let submitCity = this.validateCity(this.city);
        //firstName filled or not
        if (this.firstName === '' || this.firstName === null) {
            this.handleFirstNameError = true;
            this.showLoader = false;
        } else if (this.firstName) {
            this.handleFirstNameError = false;

        }
        //Lastname filled or Not
        if (this.LastName === '' || this.LastName === null) {
            this.handleLastNameError = true;
            this.showLoader = false;
        } else if (this.LastName) {
            this.handleLastNameError = false;
        }

        //street filled or Not
        if (this.StreetAddress === '' || this.StreetAddress === null) {
            this.handleStreetError = true;
            this.showLoader = false;
        } else if (this.StreetAddress) {
            this.handleStreetError = false;
        }

        // for city Filled or Not
        if ((this.city === '' || this.city === null)) {
            this.handleCityError = true;
            this.handleCityValidError = false;
            this.showLoader = false;
        } else {
            this.handleCityError = false;
        }

        if (submitCity == true) {
            this.handleCityValidError = false;
        } else {
            this.handleCityValidError = true;
            this.handleCityError = false;
            this.showLoader = false;
        }
        // } else if (this.city != '' && submitCity == true ) {
        //     this.handleCityError = false;
        //     this.handleCityValidError=true;
        // }
        // for compnay
        if (this.Company === '' || this.Company === null) {
            this.handlecompanyError = true;
            this.showLoader = false;
        } else if (this.Company) {
            this.handlecompanyError = false;
        }

        // for zip Filled or Not
        if (this.zip === '' || this.zip === null) {
            this.handleZipError = true;
            this.showLoader = false;
        } else if (this.zip) {
            this.handleZipError = false;
        }
        // for phone Filled or Not
        if ((this.Phone === '' || this.Phone === null)) {
            this.handlePhoneError = true;
            this.handelPhoneValidError = false;
            this.showLoader = false;
        }
        else if (this.Phone) {
            this.handlePhoneError = false;
        }

        if (submitPhoneCheck == true) {
            this.handelPhoneValidError = false;
        } else {
            this.showLoader = false;
        }
        // else{
        //     this.handelPhoneValidError = true;
        //     this.handlePhoneError = false;
        //     this.showLoader =false;
        // }

        //
        //for address
        if (this.Addresslabel == 'Address Type') {
            this.handleAddressError = true;
            this.showLoader = false;
        } else {
            this.handleAddressError = false;
        }
        //for country
        if (this.Countrylabel == 'Country') {
            this.handleCountryError = true;
            this.showLoader = false;
        } else {
            this.handleCountryError = false;
        }
        //for state
        if (this.StateLabel == 'State/Province') {
            this.handleStateError = true;
            this.showLoader = false;
        }
        else {
            this.handleStateError = false;
        }
        if (this.firstName != '' && this.LastName != '' && this.StreetAddress != '' && this.city != '' && this.zip != '' && this.Phone != '' && this.city != '' && this.Countrylabel != 'Country' && (this.StateLabel != 'State/Province' || this.StateLabel == 'none') && this.Addresslabel != 'Address Type' && this.handlePhoneError == false && this.Company != '' && this.handelPhoneValidError == false && this.handleCityValidError == false && this.handleCityError == false && this.handlecompanyError == false) {
            // if(this.StateLabel =='none'){
            //     this.StateLabel=  this.selectedstate1;
            // }
            pointaddress({
                fname: this.firstName, lname: this.LastName, addresstype: this.Addresslabel, isdefault: this.checkval, country: this.Countrylabel, city: this.city,
                state: this.StateLabel,
                postalcode: this.zip, phonenum: this.Phone, companyname: this.Company,
                address: this.StreetAddress, userId: UserId
            })
                .then((result) => {
                    console.log('result----------->' + JSON.stringify(result));
                    var newurl = window.location.pathname;
                    var orginurl = window.location.origin;
                    var newurl1 = newurl.replace('/addressForm', '')
                    var finalurl = newurl1;
                    console.log('newurl----------->' + newurl);
                    console.log('orginurl----------->' + orginurl);
                    window.location.href = orginurl + finalurl + '/addresses?addressType=' + this.Addresslabel;
                    window.location.href
                    // this.url=window.location.href;
                    // window.location.href=this.url;
                    // window.location.href;
                    // this.showLoader =false;
                    // this[NavigationMixin.Navigate]({
                    //     type: 'standard__webPage',
                    //     attributes: {
                    //         url: `/powerleduk/en-US/addresses?addressType=`+ this.Addresslabel
                    //     }
                    // },
                    // true
                    // );
                })
                .catch((error) => {
                    this.showLoader = true;
                    console.log('error' + JSON.stringify(error));
                    this.showLoader = false;

                })
        }

    }
    handlerCancel() {
        // this.url=window.location.href;
        // window.location.href=this.url;
        // window.location.href;
        // debugger;
        var newurl = window.location.pathname;
        var orginurl = window.location.origin;
        var newurl1 = newurl.replace('/addressForm', '')
        var finalurl = newurl1;
        console.log('newurl----------->' + newurl);
        console.log('orginurl----------->' + orginurl);
        window.location.href = orginurl + finalurl + '/addresses';
        window.location.href
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__webPage',
        //     attributes: {
        //         url:  +`${orginurl}/${finalurl}/addresses`
        //     }
        // },
        // true
        // );
    }


}