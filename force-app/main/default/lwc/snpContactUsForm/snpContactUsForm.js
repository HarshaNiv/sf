import { LightningElement,track ,wire ,api} from 'lwc';
import IndustryValue from '@salesforce/apex/snp_Contactus_industry.listIndustry'
import CoutryData from '@salesforce/apex/SNP_Sign_In_controller.countryDialCode'
import INDUSTRY from '@salesforce/schema/Account.Industry';
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

export default class SnpContactUsForm extends LightningElement {
    
    @track handelEmailValidError=false;
    @track handelfnameError = false;
    @track handellnameError = false;
    @track handelIndustryError = false;
    @track handelEmailError = false;
    @track handelCountryError = false;
    @track handelMessageError = false;
    @track handelPhoneValidError=false;
    @track handlePhoneError = false;

    @track firstName = null;
    @track LastName = null;
    @track Industry = null;
    @track Email = null;
    @track Country = null;
    @track Message = null;
    @track Company=null;
    @track Phone=null;
    @track isModalOpen = false;

    IndustryListValue=false;
    IndustryList='';
    @api Recordtype;
    IndustyDataCollect;
    Industry="Industry";
    Country="Country";
    countryLabels;
    CountryListValue=false;

    //for Country 
 @wire(CoutryData) 
 Wirecountry({ data, error }) {
    if (data) {
        console.log('data----------------------------->'+JSON.stringify(data));
        this.countryLabels = data;
    } else if (error) {
        console.log(error);
    }
}

    //for Industry
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo({data,error}){
        if(data){
      const rtis = data.recordTypeInfos;
      this.Recordtype= data.defaultRecordTypeId;
      console.log('sample------------>'+this.Recordtype);
    }
    if(error){
        console.log('error'+ error);
    }
}


listOpen(event)
{
    event.currentTarget.focus();
     this.IndustryListValue=!this.IndustryListValue; 
    setTimeout(() => {
        let selectedaAddress = this.template.querySelectorAll('.options-list');
        // let selectedaAddress1 = selectedaAddress[0].dataset.item;
        console.log('countrydata--->' + selectedaAddress);
        // console.log('selectedaAddress------->' + selectedaAddress1);
        for (let i = 0; i < selectedaAddress.length; i++) 
        {
            if (selectedaAddress[i].dataset.item== this.Industry) {
                selectedaAddress[i].classList.add('selected-option');
            }
        }
      }, 0);
}

listOpenCountry(event)
{
    event.currentTarget.focus();
    this.CountryListValue=!this.CountryListValue;
    setTimeout(() => {
    let selectedCountry = this.template.querySelectorAll('.options-lists');
   // var selectedaAddress1 = selectedaAddress[0].dataset.item;
    console.log('countrydata--->' + selectedCountry);
   // console.log('selectedaAddress------->' + selectedaAddress1);
    for (let i = 0; i < selectedCountry.length; i++) 
    {
        if (selectedCountry[i].dataset.item == this.Country) {
            selectedCountry[i].classList.add('selected-option');
        }
    }
}, 0);
    
}

@wire(getPicklistValues, {
    recordTypeId: '$Recordtype',
 fieldApiName:INDUSTRY
})wiredCountires({data}) {
    console.log('datacountries1' + JSON.stringify(data));
    this.IndustryList = data.values;
console.log('datacountries'+ this.IndustryList);
}
// setTimeout()(=>{

// },200)


IndustryData(event)
{
    
    this.IndustyDataCollect=event.currentTarget.dataset.item;
    this.Industry=this.IndustyDataCollect;
    if(this.Industry != "Industry"){
        this.handelIndustryError = false;
    }
    console.log('this.Industry-----'+this.Industry);
    const StarIndustry= this.template.querySelector('.required-industry');
        StarIndustry.classList.add('labelup');
        // new chnage
        setTimeout(()=>{
            this.IndustryListValue=false;
            this.stateData1=false;
        },0)
  
}
CountryData(event)
{
    
    this.CountryDataCollect=event.currentTarget.dataset.item;
    this.Country=this.CountryDataCollect;
    if(this.Country!= "Country"){
        this.handelCountryError = false;
    }
    console.log('this.Country-----'+this.Country);
    const StarCountry= this.template.querySelector('.required-Country');
    StarCountry.classList.add('labelup');
    setTimeout(()=>{
        this.CountryListValue=false;
    },0)
  
}
    //focus section
    //for first name
    handelFocusFname(event){
        console.log('HI');
        if (event.target.value == "") {
            var targetLabel = this.template.querySelector('.fname-label');
            console.log('I am first -->');
            targetLabel.classList.add("labelup");
        } else if(event.target.value){
            if(!targetLabel.classList.contains('labelup')){
                targetLabel.classList.add("labelup");
            }
           
        }
        else {
            if (this.template.querySelector(".fname-label").classList.contains("labelup")) {
                this.template.querySelector(".fname-label").classList.remove("labelup");
            }
        }
    }
    
//for email
handelFocusEmail(event)
{
    if (event.target.value == "") {
        var targetLabel = this.template.querySelector(".Email-label");
        targetLabel.classList.add("labelup");
    }
    else {
        if (this.template.querySelector(".Email-label").classList.contains("labelup")) {
            this.template.querySelector(".Email-label").classList.remove("labelup");
        }
    }
}


//for Company on change
handleCompanyChange(event){
    this.Company = event.target.value;
    console.log(this.Company);

    if(event.target.value !== ""){
        var targetLabel = this.template.querySelector(".Comapany-label");
        targetLabel.classList.add("labelup");
    } else {
        if(this.template.querySelector(".Comapany-label").classList.contains("labelup")) {
            this.template.querySelector(".Comapany-label").classList.remove("labelup");
        }
    }
}   
    


//for Compnay label up and down
handleInputLabelCompany(event) {
    if(event.target.value !== ""){
    var targetLabel = this.template.querySelector(".Comapany-label");
    targetLabel.classList.add("labelup");
    } else {
    if(this.template.querySelector(".Comapany-label").classList.contains("labelup")) {
        this.template.querySelector(".Comapany-label").classList.remove("labelup");
    }
    }
}

    //First Name Handler
    handleFirstNameChange(event)
    {
        console.log('i am hear' ,event.target.value);

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


    //for phone
   

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
    // for industry handler
    handleIndustryChange(event) {

        this.Industry = event.target.value;
        console.log(this.Industry)
        if (this.Industry == '' || this.Industry) {
            this.handelIndustryError = false;
        } else {
            this.handelIndustryError = true;

        }

        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".industry-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".industry-label").classList.contains("labelup")) {
                this.template.querySelector(".industry-label").classList.remove("labelup");
            }
        }
    }

    //for email hanler
    handleEmailChange(event) {
        this.Email = event.target.value;
        console.log(this.Email)
        const isValidEmail = this.validateEmail(this.Email)
        if (isValidEmail || this.Email == '') {
            this.handelEmailValidError = false;
            this.handelEmailError = false;
        }
        else {
            this.handelEmailValidError = true;
        }
        if (this.Email == '' || this.Email) {
            this.handelEmailError = false;
        } else {
            this.handelEmailError = true;

        }

        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Email-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".Email-label").classList.contains("labelup")) {
                this.template.querySelector(".Email-label").classList.remove("labelup");
            }
        }
    }
    //validation for email and conform email
    validateEmail(email){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }


    // for Country Handler
    handleCountryChange(event) {
        this.Country = event.target.value;
        console.log(this.Country)
        if (this.Country == '' || this.Country) {
            this.handelCountryError = false;
        } else {
            this.handelCountryError = true;

        }
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Country-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".Country-label").classList.contains("labelup")) {
                this.template.querySelector(".Country-label").classList.remove("labelup");
            }
        }
    }
    //for Phone

     // Phone-Number validation
    validatePhoneNumber(number){
    const phonePattern = /^\d+$/;
    return phonePattern.test(number);
  }


    // for your-Message
    handleLMessageChange(event) {

        this.Message = event.target.value;
        console.log(this.Message)
        if (this.Message == '' || this.Message) {
            this.handelMessageError = false;
        } else {
            this.handelMessageError = true;

        }

        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Message-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".Message-label").classList.contains("labelup")) {
                this.template.querySelector(".Message-label").classList.remove("labelup");
            }
        }
    }


    //for First-name
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

    // for industry
    handleInputLabelIndustry(event) {
       
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".industry-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".industry-label").classList.contains("labelup")) {
                this.template.querySelector(".industry-label").classList.remove("labelup");
           }
        }
        setTimeout(()=>{
            this.IndustryListValue=false;
            this.stateData1=false;
        },300)

    }
    


    //for email
    handleInputLabelEmail(event) {
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Email-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".Email-label").classList.contains("labelup")) {
                this.template.querySelector(".Email-label").classList.remove("labelup");
            }
        }
    }
    //validation for email and conform email
    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    

    // for country
    handleInputLabelCountry(event) {
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Country-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".Country-label").classList.contains("labelup")) {
                this.template.querySelector(".Country-label").classList.remove("labelup");
            }
        }
        setTimeout(()=>{
            this.CountryListValue=false;
        },300)
    }
   
    // for Your Message
    handleInputLabelMessage(event) {
        if (event.target.value !== "") {
            var targetLabel = this.template.querySelector(".Message-label");
            targetLabel.classList.add("labelup");
        }
        else {
            if (this.template.querySelector(".Message-label").classList.contains("labelup")) {
                this.template.querySelector(".Message-label").classList.remove("labelup");
            }
        }
    }
// for Phone 
handleInputLabelPhone(event)
{
    if(event.target.value !== ""){
    var targetLabel = this.template.querySelector(".Phone-label");
    targetLabel.classList.add("labelup");
    } else {
    if(this.template.querySelector(".Phone-label").classList.contains("labelup")) {
        this.template.querySelector(".Phone-label").classList.remove("labelup");
    }
    }
}
//for Phone Change
handlePhoneChange(event)
{
    this.Phone = event.target.value;
// debugger;
    console.log(this.Phone)
    const isValidPhoneNumber = this.validatePhoneNumber(this.Phone)
    console.log('isValidPhoneNumber-------->'+isValidPhoneNumber);
        if(isValidPhoneNumber !=false){
            this.handelPhoneValidError=false;  
        } else{
            this.handelPhoneValidError=true;
            this.handlePhoneError = false; 
        }  
        if(this.Phone != ''){
            this.handlePhoneError = false;
            var targetLabel = this.template.querySelector(".Phone-label");
            targetLabel.classList.add("labelup");
            //this.Phone = true;
        
        }else{
            this.handelPhoneValidError=false;  
            if (this.template.querySelector(".Phone-label").classList.contains("labelup")) {
                this.template.querySelector(".Phone-label").classList.remove("labelup");
            }     
        }
}

    //on click of sumbit
    handleSumbit() {
        let submitPhoneCheck =this.validatePhoneNumber(this.Phone)
        //firstName filled or not
        if (this.firstName === '' || this.firstName === null) {
            this.handelfnameError = true;
        } else if (this.firstName) {
            this.handelfnameError = false;

        }
        //Lastname filled or Not
        if (this.LastName === '' || this.LastName === null) {
            this.handellnameError = true;
        } else if (this.LastName) {
            this.handellnameError = false;
        }

        if(this.Industry=="Industry")
        {
            this.handelIndustryError= true;
        }
        else{
            this.handelIndustryError= false;
        }

        // for Email Filled or Not
        if (this.Email === '' || this.Email === null) {
            this.handelEmailError = true;
        } else if (this.Email) {
            this.handelEmailError = false;
        }
        //phone
        if (this.Phone === '' || this.Phone === null ) {
            this.handlePhoneError = true;
        }else if(this.Phone) {
            this.handlePhoneError = false;
        }
        // for Country Filled or Not
       
        if(this.Country=="Country")
        {
            this.handelCountryError= true;
        }
        else{
            this.handelCountryError= false;
        }
        // for Message Filled or Not
        if (this.Message === '' || this.Message === null) {
            this.handelMessageError = true;
        } else if (this.Message) {
            this.handelMessageError = false;
        }
       
        let submitEmailCheck =this.validateEmail(this.Email)
if(this.Country !='Country' && this.Email !='' && this.Email != null && submitEmailCheck && this.Industry != 'Industry' && this.LastName !='' && this.LastName != null &&
this.firstName !='' && this.firstName != null  && this.Message != null && this.Message!='' && this.handelPhoneValidError == false)
{
      this.isModalOpen = true;
 }
 
}
//for ok button
    submitDetails()
    {  
      this.isModalOpen = false;
      window.location.href = window.location.href;      //to refresh
      
    }
    //for close button
 closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    
}