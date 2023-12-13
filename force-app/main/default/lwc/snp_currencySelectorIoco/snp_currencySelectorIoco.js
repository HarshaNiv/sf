/**
 * @description          On Hover Image With Discription #tiles
 * @Author               Krishnamurthy Donta
 * @Createddate          19-06-2023
 * @ControllerClass      
 * @TestClass            
 * @modificationSummary  Nameofmodifier - modification date - modifications made
 */
 
import { LightningElement, track ,wire} from 'lwc';
import multiCurrencyIconImage from '@salesforce/resourceUrl/multiCurrencyIconImage';
import usaDollerIcon from '@salesforce/resourceUrl/usaDollerIcon';
import euroCurrencyIcon from '@salesforce/resourceUrl/euroCurrencyIcon';
import gbpCurrencyIcon from '@salesforce/resourceUrl/gbpCurrencyIcon';
import userlang from '@salesforce/apex/CurrencyController.logInuserlang';
import updatecartitem from '@salesforce/apex/samplecurrency.updatecartitem'
import communityId from '@salesforce/community/Id';
import currentUserCurrency from '@salesforce/apex/CurrencyController.currentUserCurrency';
import CountryCurrencyName from '@salesforce/apex/CurrencyController.CountryCurrencyName';
import getNewCartDetails from '@salesforce/apex/CurrencyController.getNewCartDetails';
//import removeCartProductsAndMakecartAsClosed from '@salesforce/apex/CurrencyController.removeCartProductsAndMakecartAsClosed';
//import checkingcustemetHavingCartOrNot from '@salesforce/apex/CurrencyController.checkingcustemetHavingCartOrNot';
import guestUser from '@salesforce/user/isGuest';
import UserId from '@salesforce/user/Id';
import { NavigationMixin } from 'lightning/navigation';
import Icons_Web_Site from '@salesforce/resourceUrl/Icons_Web_Site';
import {addItemToCart} from 'commerce/cartApi';	





export default class CurrencySelector extends NavigationMixin(LightningElement) {
  usaDollerIconStaticResource = usaDollerIcon;
  euroCurrencyIconStaticResource = euroCurrencyIcon;
  gbpCurrencyIconStaticResource = gbpCurrencyIcon;
  // @track multiCurrencyIconImageIMage = multiCurrencyIconImage
  @track multiCurrencyIconImageIMage = Icons_Web_Site+'/Currency Selector.svg';
  @track showPicklist = false;
  @track selectedCurrency;
  @track selectedLanguageCode;
  @track checkuser=true;
  @track currencyList = [];
  @track isShowModalGuest = false;
  @track isShowModalRegister = false;
  @track cartremoved = 'Yes';
  @track showLoader =false;
  @track runForEmptycart = false;
  @track currencyListWithIcons=[];
  userCurrency = '';


  renderedCallback(){
    console.log(this.usaDollerIconStaticResource);
    console.log(this.euroCurrencyIconStaticResource);
    console.log(this.gbpCurrencyIconStaticResource);
    console.log('Group' ,this.multiCurrencyIconImageIMage);
    console.log('RenderCAllBack-UserId ----------->'+UserId);
    console.log('RenderCAllBack-GuestUser ----------->'+guestUser);

    //geting the current user currencyiso code
    currentUserCurrency({ userId: UserId })
    .then((result) => {
      console.log( 'currenct user iso--->',result);
      this.userCurrency = result;
      console.log(targetLists);
      console.log('ok----------->');
    })
    .catch((error) => {
      console.log('currenct user iso--->',error);
    });
  }
  

 

  //checkweather the user is having the cart or not
  cartcheck(){
    checkingcustemetHavingCartOrNot({userid:UserId})
  .then((result)=>{
    console.log(result);
    if(result == 'YES'){
      this.showLoader=false;
      this.isShowModalRegister = true;
    }else{
      this.showLoader=true;
      this.runForEmptycart = true;
      this.ChangeCurrency();

    }
  })
  .catch((error)=>{
    console.log(error);
  })
  }

  //Hiding the picklist
  hidePickList(){
    setTimeout(() => { this.showPicklist = false;  }, 300);
  }

  //model Will open and accourding to the user type.
  showModelforGuestForRegister(event){
    this.selectedLanguageCode = event.currentTarget.innerText;
    this.selectedLanguageCode = this.selectedLanguageCode.trim();
    console.log(this.selectedLanguageCode);
    if(guestUser){
      this.isShowModalGuest = true;
      this.showPicklist = false;
    }else{
      this.showLoader=true;
      //this.handleLanguageSelect();
      this.ChangeCurrency();
      // this.cartcheck();
      // this.isShowModalRegister = true;
      this.showPicklist = false;
    }
  }
  
  //closing the model pop for register user.
  hideModalBoxRegister(){
    this.isShowModalRegister = false;
  }

  //closing the model pop for guest user.
  hideModalBoxGuest(){
    this.isShowModalGuest = false;
  }

  //Redirecting the guest user to LogIn user.
  LoginPageRedirection(){
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
          name:'Login',
      }
    });
    this.isShowModalGuest = false;
  }
  //Redirecting the guest user to SighIn user.
  SignInPageRedirection(){
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
          name:'Register',
      }
    });
    this.isShowModalGuest = false;
  }

  //get change currency name from org.
  @wire(CountryCurrencyName)
  getProductFAS({ error, data }) {
    if (error) {
      console.log('error--------------->', error);
    } else if (data) {
      console.log('Data------------------->'+data);
      this.currencyList = data.split(',') // Split the string using the comma and space as the delimiter
      console.log(JSON.stringify(this.currencyList));
      
      const currencyImageMap = {
        'USD': this.usaDollerIconStaticResource,
        'EUR': this.euroCurrencyIconStaticResource,
        'GBP': this.gbpCurrencyIconStaticResource,
        // Add more currency-image mappings as needed
      };
  
     
      for (let x of this.currencyList) {
        const currencyCode = x.trim(); // Trim whitespace characters
        if (currencyImageMap[currencyCode]) {
          var tempList = [{"image": "", "name": ""}];
          tempList[0].image = currencyImageMap[currencyCode];
          tempList[0].name = currencyCode;
          this.currencyListWithIcons.push([...tempList]);
        }
      }
      console.log('listoficons------------------>',JSON.stringify(this.currencyListWithIcons));
    }
  } 

  //show or hide currency list values
  togglePicklist(event) {
    //This line is used for applying the focus on the button when clicked
    event.currentTarget.focus();
    console.log('hello');
    console.log('---------->',guestUser);
    this.showPicklist = !this.showPicklist;
    console.log('---------------->',UserId);
    
    
    setTimeout(() => {
      // Code to be executed after the timeout (2000 ms) goes here
      let targetLists = this.template.querySelectorAll('.currencyOptions');
      console.log(targetLists);

      if(guestUser){
        console.log('ok----------->');
        for (let i = 0; i < targetLists.length; i++) {
          console.log(targetLists[i].innerText);
          if (targetLists[i].innerText === ' GBP') {
              targetLists[i].classList.add('selected-option');
          } else {
              if (targetLists[i].classList.contains('selected-option')) {
                  targetLists[i].classList.remove('selected-option');
              }
          }
        }
      }else{
        console.log('Happyb birthday :)');
         let targetLists = this.template.querySelectorAll('.currencyOptions');
          for (let i = 0; i < targetLists.length; i++) {
            console.log(targetLists[i].innerText);
            if (targetLists[i].innerText === ' '+this.userCurrency) {
                targetLists[i].classList.add('selected-option');
            } else {
                if (targetLists[i].classList.contains('selected-option')) {
                    targetLists[i].classList.remove('selected-option');
                }
            }
          }
        }
        
    }, 0);
    
  }

  //check user is having the cart or not
  handleLanguageSelect() {
  this.isShowModalRegister = false;
  this.showLoader = true;
  removeCartProductsAndMakecartAsClosed({userid:UserId,selectedCurrency:this.selectedLanguageCode})
  .then((result)=>{
    console.log('cartdeletedresult---------->',result);
    this.cartremoved = 'Done';
    this.ChangeCurrency();
  })
  .catch((error)=>{
    console.log('cartdeletederror---------->',error);
  })

  }
  
  //change user currency
  ChangeCurrency(){

    if(!guestUser){
      this.checkuser= true;
      console.log(this.selectedLanguageCode);
    userlang({locale :this.selectedLanguageCode, userId : UserId,communityid:communityId})
    .then((result)=>{
      setTimeout(()=>{
        getNewCartDetails({userid : UserId })
        .then((result)=>{


          console.log('Krishnamurthy cart ---------->',result);
          // console.log('Krishnamurthy cart ---------->',JSON.stringify(result));
          this.showLoader = false;
          // if( result == null){
          //   var url = window.location.href;
          //   window.location.href=url;
          //   window.location.href;
          // }
          if(result == null || result.CurrencyIsoCode == this.selectedLanguageCode ){
          // this.handleitems();
            console.log("i am in _____________>");
              // var url1="https://sunpowergroupholdingsltd--commsit.sandbox.lightning.force.com/lightning/o/WebCart";
            var url = window.location.href;
            window.location.href=url;
            window.location.href;
            console.log("result"+ result);
          }else{
            console.log('Error while working');
            console.log('Krishnamurthy cart ---------->',result);
          }

        })
        .catch((error)=>{
          console.log(error);
        })
      },7000)
    })
    .catch((error)=>{
    console.log("error"+ JSON.stringify(error));
    })
      // if(this.cartremoved =='Done' || this.cartremoved =='Closed' || this.runForEmptycart){
       
      // }
  }else{
      this.checkuser= false;
  }
  }

  //close the model popup
  handleCancel(){
    isShowModalRegister= false;
  }
  handleitems(){
    debugger;
    updatecartitem({userId: UserId , communityid : communityId ,locale:this.selectedLanguageCode})
    .then((result)=>{
      if(result == null){
        //this.showLoader = false;
        console.log('renderedresult------>'+result);
        var url = window.location.href;
        window.location.href=url;
        window.location.href;
      }
      else{
          console.log('Error while working');
          console.log('Krishnamurthy cart ---------->',result);
      }
  })
  .catch((error)=>{
    console.log(error);
  })
  }
}