import { LightningElement, track, api, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import COUNTRY_CODE from '@salesforce/schema/Account.BillingCountryCode';
import BILLING_STATE_CODE from '@salesforce/schema/Account.BillingStateCode';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import getCountryAndDialCode from '@salesforce/apex/snp_address_form_dialNumbers.countryDialCode';
import pointaddress from '@salesforce/apex/snp_address_form_dialNumbers.pointaddress';
import Updateaddress from '@salesforce/apex/snp_address_form_dialNumbers.Updateaddress';
import UserId from '@salesforce/user/Id';
//import { NavigationMixin } from 'lightning/navigation';
import editaddress from '@salesforce/apex/snp_address_form_dialNumbers.editaddress';
// import AddressemessageChannel from '@salesforce/messageChannel/AddressemessageChannel__c';
// import { subscribe, MessageContext } from 'lightning/messageService';
export default class Snp_AddressForm extends LightningElement {

    // 
    addressRequried = '*';
    FirstNameRequried = '*';
    LastNameRequried = '*';
    CompanyRequried = '*';
    CountryRequried = '*';
    StreetRequried = '*';
    cityRequried = '*';
    zipRequried = '*';
    PhoneRequried = '*';
    stateRequried = '*';
    state = '';

    // subscription = null;
    // @wire(MessageContext) messageContext;
    addressidurl;
    connectedCallback() {
        //let addressidurl=window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        this.addressidurl = urlParams.get('addressId');
        if (this.addressidurl != null) {
            this.handledata();
        }

    }
    handledata() {

        editaddress({ formid: this.addressidurl })
            .then((result) => {
                if (result.AddressType != null) {
                    this.Addresslabel = result.AddressType;
                    this.addressRequried = '';
                }
                if (result.AddressFirstName != null) {
                    this.FirstName1 = '';
                    this.FirstNameRequried = '';
                    this.firstName = result.AddressFirstName;

                }
                if (result.AddressLastName != null) {
                    this.LastName1 = '';
                    this.LastNameRequried = '';
                    this.LastName = result.AddressLastName;
                }
                if (result.City != null) {
                    this.cityRequried = '';
                    this.city1 = '';
                    this.city = result.City;

                }
                if (result.State != null) {
                    this.stateRequried = '';
                    this.StateLabel = result.State;
                } else {
                    this.stateRequried = '';
                    this.StateLabel = this.newlist.label;
                }
                if (result.PostalCode != null) {
                    this.zipRequried = '';
                    this.ZIP1 = '';
                    this.zip = result.PostalCode;

                }
                if (result.PhoneNumber != null) {
                    this.PhoneRequried = '';
                    this.Phone = result.PhoneNumber;
                    this.Phone1 = '';

                }
                if (result.CompanyName != null) {
                    this.CompanyRequried = '';
                    this.Company = result.CompanyName
                    this.Company1 = '';
                }
                if (result.Street != null) {
                    this.StreetRequried = '';
                    this.StreetAddress = result.Street;
                    this.StreetAddress1 = '';
                }
                if (result.Country != null) {
                    this.CountryRequried = '';
                    this.Countrylabel = result.Country;
                    getCountryAndDialCode({ countrylabel: this.Countrylabel })
                        .then((result) => {
                            this.dialcode = '+' + result;
                        })
                        .catch((error) => {
                            console.log('error' + error);
                        })
                    //this.itemhandlerCountry(event);
                    this.countryvalue = result.CountryCode;
                }

                if (result.IsDefault != null) {
                    this.checkval = result.IsDefault;
                }

            })

            .catch((error) => {
                console.log('error-->' + error);
            })
    }

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

    FirstName1 = 'First Name';
    LastName1 = 'Last Name';
    StreetAddress1 = 'Street Address';
    city1 = 'City';
    ZIP1 = 'ZIP/Postal Code';
    Phone1 = 'Phone Number';
    Company1 = 'Company';

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo({ data, error }) {
        if (data) {
            const rtis = data.recordTypeInfos;
            this.Recordtype = data.defaultRecordTypeId;
        }
        if (error) {
            console.log('error' + error);
        }
    }
    @wire(getPicklistValues, {
        recordTypeId: '$Recordtype',
        fieldApiName: COUNTRY_CODE
    }) wiredCountires({ data }) {
        this.listCountry = data.values;
    }


    @wire(getPicklistValues, { recordTypeId: '$Recordtype', fieldApiName: BILLING_STATE_CODE })
    wiredStates({ data }) {
        if (!data) {
            return;
        }

        const validForNumberToCountry = Object.fromEntries(Object.entries(data.controllerValues).map(([key, value]) => [value, key]));
        this._countryToStates = data.values.reduce((accumulatedStates, state) => {
            const countryIsoCode = validForNumberToCountry[state.validFor[0]];
            return { ...accumulatedStates, [countryIsoCode]: [...(accumulatedStates?.[countryIsoCode] || []), state] };
        }, {});
        if (this.countryvalue != null) {
            this.stateData1 = false;
            this.listState = this._countryToStates[this.countryvalue];
            this.listState1 = this.listState;
        }
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
    handleZipValidError = false;

    showOptions = false;
    showOptionsState=false;
    showOptionsCountry=false;
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

        event.currentTarget.focus();
        this.addressData = !this.addressData;
        this.showOptions = !this.showOptions;
        // let target = this.template.querySelector(".list-options-address");
        // target.classList.toggle('show-toggle');
        setTimeout(() => {
            var selectedaAddress = this.template.querySelectorAll('.options-list');
            var selectedaAddress1 = selectedaAddress[0].dataset.item;
            for (var i = 0; i < selectedaAddress.length; i++) {
                if (selectedaAddress[i].dataset.item == this.Addresslabel) {
                    selectedaAddress[i].classList.add('selected-option');
                }
            }
        }, 0);

    }

    //for country
    Countrylabel = 'Country';
    listCountry = ['india', 'usa', 'China'];
    itemhandlerCountry(event) {
        this.showOptionsCountry = !this.showOptionsCountry;
        let selectedCountry = event.currentTarget.dataset.item;
        this.Countrylabel = selectedCountry;
        this.countryvalue = event.currentTarget.dataset.item1;
        this.listState1 = this._countryToStates[this.countryvalue]
        this.handleCountryError = false;
        getCountryAndDialCode({ countrylabel: selectedCountry })
            .then((result) => {
                this.dialcode = '+' + result;
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
        this.Countrydata = !this.Countrydata;
        this.showOptionsCountry = !this.showOptionsCountry;
        setTimeout(() => {
            var selectedaAddress = this.template.querySelectorAll('.options-list');
            var selectedaAddress1 = selectedaAddress[0].dataset.item;
            for (var i = 0; i < selectedaAddress.length; i++) {
                if (selectedaAddress[i].dataset.item == this.Countrylabel) {
                    selectedaAddress[i].classList.add('selected-option');
                }
            }
        }, 0);
    }

    //for state
    @track StateLabel = 'State/Province';
    itemhandlerstate(event) {
        this.showOptionsState = !this.showOptionsState;
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
        this.showOptionsState = !this.showOptionsState;
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
        }, 300)

    }
    //for country
    handleInputCountry() {
        setTimeout(() => {
            this.Countrydata = false;
            this.showOptionsCountry = false;
        }, 300)

    }

    //for state
    handleInputState() {
        setTimeout(() => {
            this.stateData = false;
            this.stateData1 = false;
            this.showOptionsState = false;
        }, 250)

    }

    // for firstname
    handleInputLabelFirstname(event) {
        if (this.firstName == '') {
            this.FirstName1 = 'First Name';
            this.FirstNameRequried = '*';
        }
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".fname-label");
            targetLabel.classList.add("labelup");
        }
        else {
            //this.FN='';
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

        this.firstName = event.target.value;
        //this.FN=this.firstName
        // if(this.addressidurl != null){
        //     this.FN=this.firstName
        // }

        if (this.firstName == '' || this.firstName) {
            this.handleFirstNameError = false;
        } else {
            this.handleFirstNameError = true;

        }

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

    //for last-name
    handleInputLabelLastname(event) {
        if (this.LastName == '') {
            this.LastName1 = 'Last Name';
            this.LastNameRequried = '*';
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

    //Last Name Handler
    handleLastNameChange(event) {

        this.LastName = event.target.value;
        //if(this.addressidurl != null){
        //this.LN=this.LastName
        //}
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
        if (this.Company == '') {
            this.Company1 = 'Company';
            this.CompanyRequried = '*';
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
    //Company
    handleCompanyChange(event) {

        this.Company = event.target.value;
        // if(this.addressidurl != null){
        //this.comp=this.Company
        //  }
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
        if (this.StreetAddress == '') {
            this.StreetAddress1 = 'Street Address';
            this.StreetRequried = '*';
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

    //street address
    handleStreetAddressChange(event) {

        this.StreetAddress = event.target.value;
        //if(this.addressidurl != null){
        //this.str=this.StreetAddress;
        // }
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
        if (this.city == '') {
            this.city1 = 'City';
            this.cityRequried = '*';
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
    // City validation
    validateCity(inputValue) {
        const cityPattern = /^[a-zA-Z]+$/;
        return cityPattern.test(inputValue);
    }

    //for city
    handleCityChange(event) {
        this.city = event.target.value;
        // if(this.addressidurl != null){
        // this.cities=this.city
        //  }
        const isValidCity = this.validateCity(this.city)
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
        if (this.zip == '') {
            this.ZIP1 = 'ZIP/Postal Code';
            this.zipRequried = '*';
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
    validatezip(inputValue) {
        const zipPattern = /[^a-zA-Z0-9-]/g;
        return zipPattern.test(inputValue);
    }

    handleZipChange(event) {
        this.zip = event.target.value;
        //   if(this.addressidurl != null){
        // this.postal=this.zip
        //   }
        const isValidzip = this.validatezip(this.zip);
        if (isValidzip != true) {
            this.handleZipValidError = false;
        } else {
            this.handleZipValidError = true;
            this.handleZipError = false;
        }
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
        if (this.Phone == '') {
            this.Phone1 = 'Phone Number';
            this.PhoneRequried = '*';
        }
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
        // if(this.addressidurl != null){
        //this.phnum=this.Phone
        //  }
        const isValidPhoneNumber = this.validatePhoneNumber(this.Phone)
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
        //console.log('this.checkval');

    }
    checkboxValidation(event) {
        this.checkval = event.target.checked;
    }
    //on click of sumbit
    handlerSumbit() {
        this.showLoader = true;
        let submitPhoneCheck = this.validatePhoneNumber(this.Phone)
        let isValidzip = this.validatezip(this.zip);
        let submitCity = this.validateCity(this.city);
        //firstName filled or not
        if (isValidzip == true) {
            this.showLoader = false;
        }
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
        } else if (this.city) {
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
        if (this.firstName != '' && this.LastName != '' && this.StreetAddress != '' && this.city != '' && this.zip != '' && this.Phone != '' && this.city != '' && this.Countrylabel != 'Country' && (this.StateLabel != 'State/Province' || this.StateLabel == 'none') && this.Addresslabel != 'Address Type' && this.handlePhoneError == false && this.Company != '' && this.handelPhoneValidError == false && this.handleCityValidError == false && this.handleCityError == false && this.handlecompanyError == false && isValidzip == false) {
            // if(this.StateLabel =='none'){
            //     this.StateLabel=  this.selectedstate1;
            // }

            if (this.addressidurl == null) {
                pointaddress({
                    fname: this.firstName, lname: this.LastName, addresstype: this.Addresslabel, isdefault: this.checkval, country: this.Countrylabel, city: this.city,
                    state: this.StateLabel,
                    postalcode: this.zip, phonenum: this.Phone, companyname: this.Company,
                    address: this.StreetAddress, userId: UserId
                })
                    .then((result) => {
                        var newurl = window.location.pathname;
                        var orginurl = window.location.origin;
                        var newurl1 = newurl.replace('/addressForm', '')
                        var finalurl = newurl1;
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
                        // alert(JSON.stringify(error));
                        this.showLoader = false;

                    })
            }
            else {
                Updateaddress({
                    fname: this.firstName, lname: this.LastName, addresstype: this.Addresslabel, isdefault: this.checkval, country: this.Countrylabel, city: this.city,
                    state: this.StateLabel,
                    postalcode: this.zip, phonenum: this.Phone, companyname: this.Company,
                    address: this.StreetAddress, formid: this.addressidurl
                })
                    .then((result) => {
                        var newurl = window.location.pathname;
                        var orginurl = window.location.origin;
                        var newurl1 = newurl.replace('/addressForm', '')
                        var finalurl = newurl1;
                        window.location.href = orginurl + finalurl + '/addresses?addressType=' + this.Addresslabel;
                        window.location.href;
                    })
                    .catch((error) => {
                        this.showLoader = true;
                        //alert(JSON.stringify(error));
                        this.showLoader = false;

                    })
            }
        }

    }
    handlerCancel() {
        // this.url=window.location.href;
        // window.location.href=this.url;
        // window.location.href;
        var newurl = window.location.pathname;
        var orginurl = window.location.origin;
        var newurl1 = newurl.replace('/addressForm', '')
        var finalurl = newurl1;

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