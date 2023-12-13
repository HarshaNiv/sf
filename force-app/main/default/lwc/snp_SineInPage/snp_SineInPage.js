import { LightningElement, api, track, wire } from "lwc";
import registerUser from "@salesforce/apex/SNP_Sign_In_controller.registerUser";
import isEmailExist from "@salesforce/apex/SNP_Sign_In_controller.isEmailExist";
import { NavigationMixin } from "lightning/navigation";
import getCountryAndDialCode from "@salesforce/apex/SNP_Sign_In_controller.countryDialCode";
import CustomerTypeOne from "@salesforce/apex/SNP_Sign_In_controller.CustomerTypeOne";
import guestUser from "@salesforce/user/isGuest";
// import DownArrowSign from '@salesforce/resourceUrl/DownArrowSign';
// import UpArrowSign from '@salesforce/resourceUrl/UpArrowSign';
// import closeEyeSign from '@salesforce/resourceUrl/closeEyeSign';
// import OpenArrowSign from '@salesforce/resourceUrl/OpenArrowSign';

export default class Snp_SineInPage extends NavigationMixin(LightningElement) {
  //create the custom meta data for the Country And Customer Option below line is to execute the custom metedata
  //create a custom meta data object in org ->creat custom fields which we needed -> use the custom fields API name for fiels name in CSV file *required NAME should be default
  // -> the fetch the metedata and objects from the org and execute the below line -> then deploy the custom metadata to org
  //sfdx force:cmdt:record:insert --filepath D:\Salesforce\wishlist\Data\CSV-Files\CustomerType.csv --typename CustomerType__mdt

  // @track downArrow = DownArrowSign;
  // @track upArrow = UpArrowSign;
  // closeEye = closeEyeSign;
  // @track openEye = OpenArrowSign;
  marketingEmail = false;

  showEye = true;
  showEyeCon = true;

  // isOpen = false;

  CustomerOptions;
  CountrySelected = null;
  countryDialcode = "";

  hearAboutUs = null;
  phonenumber = null;
  communityNickname = null;

  workNow = false;
  formError = false;

  firstName = null;
  lastName = null;
  email = null;
  cEmail = null;
  userName = null;
  password = null;
  confirmPassword = null;
  selectedValue = null;
  errorCheck;
  errorMessage;

  UserEmailNotification = false;

  @api contentId;

  //  url;
  //  data;

  //check each field input
  fNameError = false;
  lNameError = false;
  countryError = false;
  phoneError = false;
  emailError = false;
  cEmailError = false;
  passError = false;
  cPassError = false;

  checkingCpassCemail = true;
  checkPhone = true;
  checkEmail = true;
  //For error
  handelfnameError = false;
  handelLnameError = false;
  handelcountryError = false;
  handelPhoneError = false;
  handelEmailError = false;
  handelcEmailError = false;
  handelPasswordError = false;
  handelConformError = false;
  handelcustomerError = false;
  handelSignUpError = false;
  handelEmailErrorexistingalredy = false;

  //Loader
  showLoader = false;

  passwordFieldType = "password";
  confirmPasswordFieldType = "password";

  selectedOption = "Customer Type";
  showOptions = false;
  selecteCountry = "Country";
  showcountryOption = false;

  countryCollection;

  exceptionError = false;

  //phone number with selected country
  CountryWithPhoneNumber = null;

  //Check the validity after the user click the Sign In button
  SignInFirstName = false;
  SignInLastName = false;

  // SignInCountry = false;
  SignInPhone = false;
  SignInEmail = false;
  SignInCemail = false;
  SignInPassword = false;
  SignInCpassword = false;
  SignInAllFields = false;

  //Markating Email
  emailMarkating = false;

  //show registeration form for guest user only
  guestUserpage = true;

  //check weather user is loged in or or guest user
  renderedCallback() {
    if (guestUser) {
      this.guestUserpage = true;
    } else {
      this.guestUserpage = false;
    }
  }

  //customer type from Account.IndustryFiels picklist values
  @wire(CustomerTypeOne) WireCustomerTypefromAccountField({ data, error }) {
    if (data) {
      // console.log(data);
      this.CustomerOptions = data;
    } else if (error) {
      // console.log(error);
    }
  }

  // fetch the country and country dial code we are using custom mete data
  @wire(getCountryAndDialCode) WirecountryAndDialcode({ data, error }) {
    if (data) {
      // console.log(data);
      this.countryCollection = data;
    } else if (error) {
      // console.log(error);
    }
  }

  // close the option list on click of any option cutomer Type
  handleOptionClick(event) {
    this.selectedOption = event.target.innerText;
    this.selectedValue = event.currentTarget.innerText;
    // console.log('position --------->' + this.selectedValue);
    //const allOption = this.template.querySelectorAll("option");
    // console.log('value----------->' + event.currentTarget.innerText);
    this.showOptions = !this.showOptions;
    let target = this.template.querySelector(".customer-type-wrapper");
    if (target.classList.contains("show-toggle")) {
      target.classList.remove("show-toggle");
    }
  }

  // show the customer Type options (toggle)
  toggleCustomerOptions(event) {
    //changed
    // event.currentTarget.focus();
    event.preventDefault();
    event.stopPropagation();
    this.showOptions = !this.showOptions;
    // this.CountrySelected = !this.CountrySelected;
    let targetLists = this.template.querySelectorAll(".options");
    // console.log("open options",targetLists);
    let target = this.template.querySelector(".customer-type-wrapper");
    target.classList.toggle("show-toggle");

    for (let i = 0; i < targetLists.length; i++) {
      if (
        targetLists[i].innerText ===
        this.template.querySelector(".selected-option-field-customer").innerText
      ) {
        targetLists[i].classList.add("selected-option");
      } else {
        if (targetLists[i].classList.contains("selected-option")) {
          targetLists[i].classList.remove("selected-option");
        }
      }
    }
  }

  handleCustomerOption(event) {
    event.stopPropagation();
    setTimeout(() => {
      // if (this.template.querySelector(".country-option-wrapper").classList.contains('show-toggle')) {
      this.template
        .querySelector(".customer-type-wrapper")
        .classList.remove("show-toggle");
      // }
      event.target.blur();
      this.showOptions = !this.showOptions;
    }, 300);
  }

  // close the option list on click of any option country
  handlecountryField(event) {
    //ok
    this.selecteCountry = event.target.innerText;
    this.CountrySelected = event.target.innerText;
    // console.log(this.CountrySelected);
    this.showcountryOption = !this.showcountryOption;
    const countryWithdialcode = event.target.id;
    const splitParts = countryWithdialcode.split("-");
    this.countryDialcode = "+" + splitParts[0];

    let target = this.template.querySelector(".country-option-wrapper");
    // console.log('I am working targert',target.classList.contains("show-toggle"));

    if (target.classList.contains("show-toggle")) {
      console.log("i am in on click");
      target.classList.remove("show-toggle");
    }

    this.template.querySelector(".selected-country-val").blur();

    const hostElement = this.template.host;
    const styles = window.getComputedStyle(hostElement);
    const nameValue = styles.getPropertyValue("--selectedCountry");
    hostElement.style.setProperty("--selectedCountry", '""');

    if (this.selecteCountry) {
      this.handelcountryError = false;
      this.formError = true;
      this.countryError = true;
    } else {
      this.handelcountryError = true;
      this.formError = false;
      this.phoneError = false;
    }

    console.log("Newoption 2");

    // setTimeout(()=>{
    //     this.isOpen = false;
    // },0)
  }

  // show the country options (toggle)
  toggleCountryOptions(event) {
    console.log("Newoption 1");
    this.showcountryOption = !this.showcountryOption;
    event.preventDefault();
    event.stopPropagation();

    let targetLists = this.template.querySelectorAll(".options");
    let target = this.template.querySelector(".country-option-wrapper");
    // if (document.activeElement !== this.template.querySelector(".selected-country-val")) {
    //     this.template.querySelector(".selected-country-val").focus();
    // }

    target.classList.toggle("show-toggle");

    for (let i = 0; i < targetLists.length; i++) {
      if (
        targetLists[i].innerText ===
        this.template.querySelector(".selected-option-field").innerText
      ) {
        targetLists[i].classList.add("selected-option");
      } else {
        if (targetLists[i].classList.contains("selected-option")) {
          targetLists[i].classList.remove("selected-option");
        }
      }
    }
  }

  handleCountryOption(event) {
    //debugger;
    // this.showcountryOption = !this.showcountryOption;
    event.stopPropagation();
    setTimeout(() => {
      // if (this.template.querySelector(".country-option-wrapper").classList.contains('show-toggle')) {
      this.template
        .querySelector(".country-option-wrapper")
        .classList.remove("show-toggle");
      // }
      event.target.blur();
      this.showcountryOption = !this.showcountryOption;
    }, 300);
    console.log("Newoption 3");

    // setTimeout(()=>{
    //     this.isOpen = false;
    // },300)
  }

  //First Name Handler
  handleFirstNameChange(event) {
    this.firstName = event.target.value;
    // console.log(this.firstName)
    // const isValidName = this.validateName(this.firstName)
    // const name = this.firstName;
    // // Define a regex pattern for name validation
    // const namePattern = /^[a-zA-Z\s\-']+$/;
    // // Validate the name against the regex pattern
    // const isValidName = namePattern.test(name);
    if (this.firstName == "" || this.firstName) {
      this.handelfnameError = false;
      this.formError = true;
    } else {
      this.handelfnameError = true;
      this.formError = false;
      this.fNameError = false;
    }
    if (this.firstName === "" || this.firstName === null) {
      this.fNameError = false;
    } else {
      this.fNameError = true;
    }
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".fname-label");
      // console.log("hi from input");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".fname-label")
          .classList.contains("labelup")
      ) {
        this.template.querySelector(".fname-label").classList.remove("labelup");
      }
    }
  }

  //validation for first name and last name
  validateName(name) {
    // Define a regex pattern for name validation
    const namePattern = /^[a-zA-Z\s\-']+$/;
    // console.log("i am working");
    // Validate the name against the regex pattern
    return namePattern.test(name);
  }

  //Last Name Handler
  handleLastNameChange(event) {
    this.lastName = event.target.value;
    // console.log(this.lastName);
    // const name = this.lastName;
    // // Define a regex pattern for name validation
    // const namePattern = /^[a-zA-Z\s\-']+$/;
    // Validate the name against the regex pattern
    // const isValidName = this.validateName(this.lastName)
    if (this.lastName == "" || this.lastName) {
      this.handelLnameError = false;
      this.formError = true;
    } else {
      this.handelLnameError = true;
      this.formError = false;
      this.lNameError = false;
    }
    if (this.lastName === "" || this.lastName === null) {
      this.lNameError = false;
    } else {
      this.lNameError = true;
    }
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".lname-label");
      targetLabel.classList.add("labelup");
      // console.log('I am also wirking');
    } else {
      if (
        this.template
          .querySelector(".lname-label")
          .classList.contains("labelup")
      ) {
        this.template.querySelector(".lname-label").classList.remove("labelup");
      }
    }
    // this.phonenumber = this.CountrySelected + this.phonenumber;
  }

  //Phone number Handeler
  handlePhoneNumber(event) {
    this.phonenumber = event.target.value;
    // console.log(this.phonenumber);
    // const phoneNumber = this.phonenumber;
    // // Define a regex pattern for number-only phone number validation
    // const phonePattern = /^\d+$/;
    // Validate the phone number against the regex pattern
    const isValidPhoneNumber = this.validatePhoneNumber(this.phonenumber);
    if (isValidPhoneNumber || this.phonenumber == "") {
      this.handelPhoneError = false;
      this.formError = true;
    } else {
      this.handelPhoneError = true;
      this.formError = false;
      this.phoneError = false;
    }
    if (this.phonenumber === "" || this.phonenumber === null) {
      this.phoneError = false;
    } else {
      this.phoneError = true;
    }
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".phone-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".phone-label")
          .classList.contains("labelup")
      ) {
        this.template.querySelector(".phone-label").classList.remove("labelup");
      }
    }
  }

  // Validation for PhoneNumber
  validatePhoneNumber(number) {
    const phonePattern = /^\d+$/;
    return phonePattern.test(number);
  }

  //Email handler
  handleEmailChange(event) {
    this.email = event.target.value;
    // console.log(this.email);
    // const email = this.email;
    // // Define a regex pattern for email validation
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // // Validate the email against the regex pattern
    const isValidEmail = this.validateEmail(this.email);
    if (isValidEmail || this.email == "") {
      this.handelEmailError = false;
      this.handelEmailErrorexistingalredy = false;
      this.formError = true;
    } else {
      this.handelEmailError = true;
      this.formError = false;
      this.emailError = false;
    }
    if (this.email === "" || this.email === null) {
      this.emailError = false;
    } else {
      this.emailError = true;
    }
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".email-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".email-label")
          .classList.contains("labelup")
      ) {
        this.template.querySelector(".email-label").classList.remove("labelup");
      }
    }
  }

  //validation for email and conform email
  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  //Conform email handler
  handlecEmailChange(event) {
    this.cEmail = event.target.value;
    // console.log(this.cEmail);
    // const email = this.cEmail;
    // // Define a regex pattern for email validation
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // // Validate the email against the regex pattern
    const isValidEmail = this.validateEmail(this.cEmail);
    if (isValidEmail || this.cEmail == "") {
      this.handelcEmailError = false;
      this.formError = true;
    } else {
      this.handelcEmailError = true;
      this.formError = false;
      this.cEmailError = false;
    }
    if (this.cEmail === "" || this.cEmail === null) {
      this.cEmailError = false;
    } else {
      this.cEmailError = true;
    }

    if (this.cEmail === this.email) {
      this.handelcEmailError = false;
      this.formError = true;
    } else {
      this.handelcEmailError = true;
      this.formError = false;
    }
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".cemail-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".cemail-label")
          .classList.contains("labelup")
      ) {
        this.template
          .querySelector(".cemail-label")
          .classList.remove("labelup");
      }
    }
  }

  //PassWord Handler
  handlePasswordChange(event) {
    this.password = event.target.value;
    // console.log(this.password);
    // const password = this.password;
    // // Define a regex pattern for password validation
    // const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/;
    // // Validate the password against the regex pattern
    const isValidPassword = this.validatePassword(this.password);
    if (isValidPassword || this.password == "") {
      this.handelPasswordError = false;
      this.formError = true;
    } else {
      this.handelPasswordError = true;
      this.formError = false;
      this.passError = false;
    }
    if (this.password === "" || this.password === null) {
      this.passError = false;
    } else {
      this.passError = true;
    }

    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".epassword-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".epassword-label")
          .classList.contains("labelup")
      ) {
        this.template
          .querySelector(".epassword-label")
          .classList.remove("labelup");
      }
    }
  }

  //validation for password and conform password
  validatePassword(password) {
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/;
    return passwordPattern.test(password);
  }

  //conform password handler
  handleConfirmPasswordChange(event) {
    this.confirmPassword = event.target.value;
    // console.log(this.confirmPassword);
    // const password = this.confirmPassword;
    // // Define a regex pattern for password validation
    // const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/;
    // // Validate the password against the regex pattern
    const isValidPassword = this.validatePassword(this.confirmPassword);
    if (isValidPassword || this.confirmPassword == "") {
      this.handelPasswordError = false;
      this.formError = true;
    } else {
      this.handelConformError = true;
      this.formError = false;
      this.cPassError = false;
    }
    if (this.confirmPassword) {
      this.cPassError = true;
    }
    if (this.confirmPassword === this.password) {
      this.handelConformError = false;
      this.formError = true;
    } else {
      this.handelConformError = true;
      this.formError = false;
    }
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".cpassword-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".cpassword-label")
          .classList.contains("labelup")
      ) {
        this.template
          .querySelector(".cpassword-label")
          .classList.remove("labelup");
      }
    }
  }

  // hear about us handler
  handleAboutUs(event) {
    this.hearAboutUs = event.target.value;
    // console.log(this.hearAboutUs);
    if (this.hearAboutUs == "") {
      this.hearAboutUs = "web";
    }
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".hearAboutUs-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".hearAboutUs-label")
          .classList.contains("labelup")
      ) {
        this.template
          .querySelector(".hearAboutUs-label")
          .classList.remove("labelup");
      }
    }
  }

  //show and hide password
  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === "password" ? "text" : "password";
    this.showEye = !this.showEye;
    // this.passwordToggleIcon = this.passwordToggleIcon === "fa fa-eye-slash" ? "fa fa-eye" : "fa fa-eye-slash";
    // this.passwordToggleIcon = this.passwordToggleIcon === closeEye ? OpenArrowSign : OpenArrowSign;
  }

  //show and hide password
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType =
      this.confirmPasswordFieldType === "password" ? "text" : "password";
    this.showEyeCon = !this.showEyeCon;
    // this.confirmPasswordToggleIcon = this.confirmPasswordToggleIcon === "fa fa-eye-slash" ? "fa fa-eye" : "fa fa-eye-slash";
    // this.confirmPasswordToggleIcon = this.confirmPasswordToggleIcon === closeEye ? OpenArrowSign : OpenArrowSign;
  }

  //for label up And downe of labels firstname
  handleInputLabel(event) {
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".fname-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".fname-label")
          .classList.contains("labelup")
      ) {
        this.template.querySelector(".fname-label").classList.remove("labelup");
      }
    }
  }

  //for label up And downe of labels lastname
  handleInputLabelLname(event) {
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".lname-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".lname-label")
          .classList.contains("labelup")
      ) {
        this.template.querySelector(".lname-label").classList.remove("labelup");
      }
    }
  }

  //for label up And downe of labels phone
  handleInputLabelPhone(event) {
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".phone-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".phone-label")
          .classList.contains("labelup")
      ) {
        this.template.querySelector(".phone-label").classList.remove("labelup");
      }
    }
  }

  //for label up And downe of labels email
  handleInputLabelEmail(event) {
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".email-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".email-label")
          .classList.contains("labelup")
      ) {
        this.template.querySelector(".email-label").classList.remove("labelup");
      }
    }
  }

  //for label up And downe of labels conform email
  handleInputLabelCEmail(event) {
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".cemail-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".cemail-label")
          .classList.contains("labelup")
      ) {
        this.template
          .querySelector(".cemail-label")
          .classList.remove("labelup");
      }
    }
  }

  //for label up And downe of labels password
  handleInputLabelPass(event) {
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".epassword-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".epassword-label")
          .classList.contains("labelup")
      ) {
        this.template
          .querySelector(".epassword-label")
          .classList.remove("labelup");
      }
    }
  }

  //for label up And downe of labels confrom password
  handleInputLabelCpass(event) {
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".cpassword-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".cpassword-label")
          .classList.contains("labelup")
      ) {
        this.template
          .querySelector(".cpassword-label")
          .classList.remove("labelup");
      }
    }
  }

  //for label up And downe of labels hear about us
  handleInputLabelHearAboutUS(event) {
    if (event.target.value !== "") {
      var targetLabel = this.template.querySelector(".hearAboutUs-label");
      targetLabel.classList.add("labelup");
    } else {
      if (
        this.template
          .querySelector(".hearAboutUs-label")
          .classList.contains("labelup")
      ) {
        this.template
          .querySelector(".hearAboutUs-label")
          .classList.remove("labelup");
      }
    }
  }

  //click on sign up button controller
  handleRegister() {
    // debugger;
    this.showLoader = true;
    if (this.exceptionError) {
      this.exceptionError = false;
    }
    this.userName = this.email;
    this.communityNickname = this.firstName + this.password + this.lastName;
    // console.log('First Name:' + this.firstName);
    // console.log('Last Name' + this.lastName);
    // console.log('Country Selected' + this.CountrySelected);
    // console.log('Emanil' + this.email);
    // console.log('PhoneNumber: ' + this.phonenumber);
    // console.log('Password ' + this.password);
    // console.log('selected value' + this.selectedOption);
    //firstName filled or not
    if (this.firstName === "" || this.firstName === null) {
      this.handelfnameError = true;
      this.showLoader = false;
    } else if (this.firstName) {
      this.handelfnameError = false;
      this.SignInFirstName = true;
    } else {
      this.handelfnameError = true;
      this.SignInFirstName = false;
      this.showLoader = false;
    }
    //lastName filled or not
    if (this.lastName === "" || this.lastName === null) {
      this.handelLnameError = true;
      this.showLoader = false;
    } else if (this.lastName) {
      this.handelLnameError = false;
      this.SignInLastName = true;
    } else {
      this.handelLnameError = true;
      this.SignInLastName = false;
      this.showLoader = false;
    }
    // Phone Check
    if (this.phonenumber === "" || this.phonenumber === null) {
      this.handelPhoneError = true;
      this.showLoader = false;
      this.checkPhone = false;
    } else if (this.validatePhoneNumber(this.phonenumber)) {
      this.handelPhoneError = false;
      this.checkPhone = true;
      this.SignInPhone = true;
    } else {
      this.handelPhoneError = true;
      this.SignInPhone = false;
      this.showLoader = false;
    }
    //Country filled or not
    if (this.CountrySelected === "" || this.CountrySelected === null) {
      this.handelcountryError = true;
      this.showLoader = false;
    } else {
      this.handelcountryError = false;
    }
    //email filled or not
    if (this.email === "" || this.email === null) {
      this.handelEmailError = true;
      this.showLoader = false;
    } else if (this.validateEmail(this.email)) {
      this.handelEmailError = false;
      this.SignInEmail = true;
    } else {
      this.handelEmailError = true;
      this.SignInEmail = false;
      this.showLoader = false;
    }
    //conform email filled or not
    if (this.cEmail === "" || this.cEmail === null) {
      this.handelcEmailError = true;
      this.showLoader = false;
    } else if (this.validateEmail(this.cEmail)) {
      this.handelcEmailError = false;
      this.SignInCemail = true;
    } else {
      this.handelcEmailError = true;
      this.SignInCemail = false;
      this.showLoader = false;
    }
    // password filled or not
    if (this.password === "" || this.password === null) {
      this.handelPasswordError = true;
      this.showLoader = false;
    } else if (this.validatePassword(this.password)) {
      this.handelPasswordError = false;
      this.SignInPassword = true;
    } else {
      this.handelPasswordError = true;
      this.SignInPassword = false;
      this.showLoader = false;
    }
    //conform password filled or not
    if (this.confirmPassword === "" || this.confirmPassword === null) {
      this.handelConformError = true;
      this.showLoader = false;
    } else if (this.validatePassword(this.confirmPassword)) {
      this.handelConformError = false;
      this.SignInCpassword = true;
    } else {
      this.handelConformError = true;
      this.SignInCpassword = false;
      this.showLoader = false;
    }

    if (
      this.SignInFirstName &&
      this.SignInLastName &&
      this.SignInPhone &&
      this.SignInEmail &&
      this.SignInCemail &&
      this.SignInPassword &&
      this.SignInCpassword
    ) {
      this.SignInAllFields = true;
    }
    // Email check
    if (this.validateEmail(this.email) && this.validateEmail(this.cEmail)) {
      if (this.email === this.cEmail) {
        this.handelcEmailError = false;
        // this.handelEmailError = false
        this.checkEmail = true;
      } else {
        this.handelcEmailError = true;
        // this.handelEmailError = true;
        this.checkEmail = false;
        this.showLoader = false;
      }
    } else {
      this.handelcEmailError = true;
      // this.handelEmailError = true;
      this.checkEmail = false;
      this.showLoader = false;
    }

    // Pass Check
    if (
      this.validatePassword(this.password) &&
      this.validatePassword(this.confirmPassword)
    ) {
      if (this.password === this.confirmPassword) {
        this.handelConformError = false;
        // this.handelPasswordError = false;
        this.checkingCpassCemail = true;
      } else {
        this.handelConformError = true;
        // this.handelPasswordError = true;
        this.checkingCpassCemail = false;
        this.showLoader = false;
      }
    } else {
      this.handelConformError = true;
      // this.handelPasswordError = true;
      this.checkingCpassCemail = false;
      this.showLoader = false;
    }

    if (
      this.fNameError &&
      this.lNameError &&
      this.countryError &&
      this.emailError &&
      this.phoneError &&
      this.passError &&
      this.cEmailError &&
      this.cPassError &&
      this.formError
    ) {
      // console.log('Inside the check ' + this.formError);
      this.workNow = true;
      this.handelSignUpError = false;
    } else {
      this.handelSignUpError = true;
    }

    if (
      this.formError &&
      this.workNow &&
      this.checkingCpassCemail &&
      this.checkEmail &&
      this.checkPhone &&
      this.SignInAllFields
    ) {
      console.log("hi");
      console.log("First Name:" + this.firstName);
      // alert('hi');
      // alert('First Name:' + this.firstName)
      this.showLoader = true;
      isEmailExist({ username: this.userName })
        .then((result) => {
          // debugger
          // console.log('login result---' + result, typeof result);
          if (result === "user exist") {
            this.workNow = false;
            this.showLoader = false;
            this.handelEmailErrorexistingalredy = true;
            // this.formError = false;
            // console.log('I am checking the email also');
            // console.log('for emailcheck the fom is ' + this.formError);
          } else {
            this.callApex();
          }
        })
        .catch((error) => {
          this.error = error;
          this.showLoader = false;
          // this.EnterValidEmail = true;
          if (error && error.body && error.body.message) {
            // console.log('error msg-', error.body.message);
          }
        });
    } else {
      this.handelSignUpError = true;
    }
  }

  //click on sign in button controller
  handelSignIn() {
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "Login"
      }
    });
  }

  //regesteration after all the validalidation
  callApex() {
    this.CountryWithPhoneNumber = this.countryDialcode + this.phonenumber;
    this.handelEmailNotification();
    registerUser({
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.userName,
      email: this.email,
      communityNickname: this.communityNickname,
      password: this.password,
      country: this.CountrySelected,
      customerType: this.selectedValue,
      phone: this.CountryWithPhoneNumber,
      hearAboutUs: this.hearAboutUs,
      marketingmail: this.marketingEmail
    })
      .then((result) => {
        console.log("hi ok");
        if (result) {
          this.showLoader = false;
          if (
            result ==
            "[We encountered an unknown error while processing this request.]"
          ) {
            this.exceptionError = true;
          } else {
            console.log("hi");
            // this.handelEmailNotification();
            // below line is for the marketing integration
            // https://sunpowergroupholdingsltd--commsit.sandbox.my.site.com/PowerLEDQAvforcesite/secur/frontdoor.jsp?allp=1&apv=1&cshc=W0000018eHVq0000000Ogz&refURL=https%3A%2F%2Fsunpowergroupholdingsltd--commsit.sandbox.my.site.com%2FPowerLEDQAvforcesite%2Fsecur%2Ffrontdoor.jsp&retURL=%2FPowerLEDQAvforcesite%2Fapex%2FCommunitiesLanding&sid=00D1q0000000Ogz%21AQEAQIUgWdEPdE9ETSqVJ3x78L8Spu2lId1asI3y_agOh4IP0Wc58cRhkGdi7DxM6GBSnnink.Xtrrw9TKkiEWqGymG7bObq&untethered=
            // console.log(result);
            window.location.href = result;
          }
        }
      })
      .catch((error) => {
        this.showLoader = false;
        this.error = error;
        this.exceptionError = true;
        // console.log('error-', error);
      });
  }

  // Email Notificatin For user
  handelEmailNotification() {
    if (this.template.querySelector(".EmailNotification").checked) {
      this.marketingEmail = true;
    }
  }
}