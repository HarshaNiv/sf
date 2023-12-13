/**
 * @description          Search Bar 
 * @Author               Krishnamurthy Donta
 * @Createddate          15-06-2023
 * @ControllerClass      Product2Controller
 * @TestClass            Product2ControllerTest 
 * @modificationSummary  Nameofmodifier - modification date - modifications made
 */

import { LightningElement, track } from 'lwc';
import getProducts from '@salesforce/apex/Product2Controller.getProducts';
import getCategoryNames from '@salesforce/apex/Product2Controller.getCategoryNames';
import communityId from '@salesforce/community/Id';
import searchIconImage from '@salesforce/resourceUrl/searchIconImage'; 
import cmsImageWrapper from '@salesforce/resourceUrl/cmsImageWrapper'; 
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

// import myComponentStyles from './serchSuggetionOnClickOf3Letters.css';

export default class SerchSuggetionOnClickOf3Letters extends NavigationMixin(LightningElement) {
  cmsImageWrapperjs = cmsImageWrapper;
  searchIconImageIMage = searchIconImage; 
  @track isSearchBarVisible = false;
  @track isSearchFlyoutVisible = false;
//   static styles = [myComponentStyles];
  @track count = 0;
  searchText='';
  timer;
  BlogPage = ''

  connectedCallback(){
    // console.log('I will get Rank--------->',basePath);
    // console.log('I will get Rank--------->',window.location.origin);
    // console.log('I will get Rank--------->',window.location.origin+basePath+'/product/'+'apple');
  }


  //Navigating to blog page
  handelBlogPage(){
    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name:'Blog_List__c',
        }
    });
}

  // Toggle the search bar visibility for 1st time and for second time onclick it should redirect search result page
  toggleSearchBar() {
    this.isSearchBarVisible = true;
    this.count++;
    if(this.count>1){
      const inputElement = this.template.querySelector('.search-input');
      this.searchText = inputElement.value;
      if(this.searchText.length >=3){
        window.location.href = window.location.origin+basePath+'/global-search/'+this.searchText;
      }

    }
  }

  //onclick it should redirect search result page
  handleKeyDown(event){
    this.searchText=event.target.value;
    console.log(this.searchText);
    console.log(window.location.origin+basePath+'/global-search/'+this.searchText);
    if(this.searchText.length >=3){
      if(event.key === 'Enter'){
        window.location.href = window.location.origin+basePath+'/global-search/'+this.searchText;
      }
    }
  }

  // Handle search input focus event
  handleSearchFocus(event) {

    this.template.querySelector('.search-input').classList.add('search-input-add-zindex');
    this.searchText=event.target.value
    if(this.searchText.length > 2){
      this.getdataForSerchSuggetion();
      this.isSearchFlyoutVisible = true;
    }
    const target =this.template.querySelector('.modal-background');
    if(this.searchText.length >=3 ){
      target.classList.add('modal-background-show');
    } else {
      if(target.classList.contains('modal-background-show')){
        target.classList.remove('modal-background-show');
      }
    }
    var placeholderRemover= this.template.querySelector('.search-input');
    //placeholderRemover.remove(placeholder)
    console.log(placeholderRemover);

  }

  // Handle search input change event
  handleSearchInput(event) {
    this.searchText = event.target.value;
    const target =this.template.querySelector('.modal-background');
    if (this.searchText.length >= 3) {
      this.isSearchFlyoutVisible = true;
      target.classList.add('modal-background-show');
      // delaying the call out for 100ms if user does not press the key continuesly and clearTimeout will clear if the set timer is alredy present
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getdataForSerchSuggetion();
      }, 100);
    } else {
      if(target.classList.contains('modal-background-show')){
        target.classList.remove('modal-background-show');
      }
      // Hide the flyout
      this.isSearchFlyoutVisible = false;
      
    }
  }
  
  //Function calling forapex class method
    getdataForSerchSuggetion() {
     // calling the apex class  
     getProducts({
      productSearchText: this.searchText,
      communityIdWTB:communityId
     })
      .then((data) => {
        console.log(data[0].Id);
        // this.template.querySelector('.modal-background').classList.toggle('modal-background-show');
       //Afte we get data we are dynamically adding serch results
       if(this.template.querySelector('.search-flyout')){
          this.template.querySelector('.search-flyout').setAttribute("style", "color: black; background-color: white;");
       }
        if (this.template.querySelector('.search-flyout .products')) {
          let parentDiv = this.template.querySelector('.search-flyout .products');
        
          //checking if the div and ul elements are there or not
          if (this.template.querySelector('.products > ul')){
            console.log(parentDiv.children);
            this.template.querySelector(".products > div").remove();
            this.template.querySelector(".products > ul").remove();
            }

            var productTagElement = document.createElement("div");
            productTagElement.textContent = "Products";
            productTagElement.setAttribute("style","font-weight:bold; padding:5px; border-bottom: 1px solid black; font-weight: bold; font-size: 1.3rem; color: #fdc300;");
            parentDiv.appendChild(productTagElement);
            var ulElement = document.createElement('ul');
            ulElement.setAttribute("style","padding:0; margin: 0; border:none;");
            ulElement.setAttribute("class", "product-wrapper");
            var liItems = data;

            // loop for extract produuct name
            liItems.forEach(function (item) {
            var liElement = document.createElement('li');
            liElement.setAttribute("style", "border-bottom: 1px solid black; padding:0 5px;")

            //anchor element is created
            var anchorElement = document.createElement('a');

            //seting up the attributes
            anchorElement.setAttribute("href", window.location.origin+basePath+'/product/'+item.Id);
            anchorElement.setAttribute("class","product-link");
            anchorElement.setAttribute("target","_self");
            anchorElement.setAttribute("style", "color:black;  display:block; padding:8px 5px; text-transform: uppercase; text-decoration: none;");
            anchorElement.innerHTML = `<span class="prodcut-outer-wrapper" style="display:flex; justify-content:space-between; align-items: center;"><h3 style="font-size:1rem; margin-bottom:0;">${item.Name}</h3><i class="fa fa-chevron-right" style="color:#fdc300;"></i></span>`;
            liElement.appendChild(anchorElement);

            //mouseover and mouseout for changing the color on hover
            liElement.addEventListener('mouseover', function(){
              this.style.backgroundColor="#eaece7";
            });
            liElement.addEventListener('mouseout', function(){

              this.style.backgroundColor="white";
            });
            ulElement.appendChild(liElement);
          });
        parentDiv.appendChild(ulElement);
      }
    })
    .catch((error) => {
      console.log(error); // Log the error message
    });
    
    // calling the apex class  
    getCategoryNames({
      CategorySearchText:this.searchText,
      communityIdWTB:communityId
    })
     .then((data)=>{
     // console.log(data);
      //checking if the data is present or empty result
      if(data.length > 0){
        if (this.template.querySelector('.search-flyout .category')) {
          let parentDiv = this.template.querySelector('.search-flyout .category');
        
          //checking if the ul is present or not
          if (this.template.querySelector('.category > ul')){
            console.log(parentDiv.children);
            this.template.querySelector(".category > ul").remove();
            this.template.querySelector(".category > div").remove();
          }
            var categoryTagElement = document.createElement("div");
            categoryTagElement.textContent = "Category";
            categoryTagElement.setAttribute("style","font-weight:bold; font-weight: bold; padding:5px; border-bottom: 1px solid black; font-size: 1.3rem; color: #fdc300;");
            parentDiv.appendChild(categoryTagElement);

            var ulElement = document.createElement('ul');
            ulElement.setAttribute("style","padding:0; margin: 0; border:none;");
            var liItems = data;

          // loop for extract produuct name
          liItems.forEach(function (item) {
            var liElement = document.createElement('li');
            liElement.setAttribute("style", "border-bottom: 1px solid black; padding:0 5px; ")
            
            //anchor element is created
            var anchorElement = document.createElement('a');
            var textReplaceWithHiphen = item.Name;
            textReplaceWithHiphen = textReplaceWithHiphen.replace(' ','-')
            anchorElement.textContent = textReplaceWithHiphen;

            //seting up the attributes
            anchorElement.setAttribute("href",window.location.origin+basePath+'/category/'+item.Id );
            anchorElement.setAttribute("class","product-link")
            anchorElement.setAttribute("target","_self");
            anchorElement.setAttribute("style", "color:black;  display:block; padding:8px 5px; text-transform: uppercase; text-decoration: none;");
            
            anchorElement.innerHTML = `<span class="prodcut-outer-wrapper" style="display:flex; justify-content:space-between; align-items: center;"><h3 style="font-size:1rem; margin-bottom:0;">${item.Name}</h3><i class="fa fa-chevron-right" style="color:#fdc300;"></i></span>`;
            liElement.appendChild(anchorElement);

            //mouseover and mouseout for changing the color on hover
            liElement.addEventListener('mouseover', function(){
              this.style.backgroundColor="#eaece7";
            });
            liElement.addEventListener('mouseout', function(){
              this.style.backgroundColor="white";
            });
            ulElement.appendChild(liElement);
          });
          parentDiv.appendChild(ulElement);
        }
      }
      else{
        //data is empty flyout is not visibel
        this.isSearchFlyoutVisible = false; 
      }})
     .catch((error)=>{
        console.log(error); // Log the error message
      })}
  
  // Handle search input blur event
  handleSearchBlur() {
    this.template.querySelector('.search-input').classList.remove('search-input-add-zindex');

    const target = this.template.querySelector('.modal-background');
    if(target.classList.contains('modal-background-show')){
      target.classList.remove('modal-background-show');
    }
    // Hide the flyout when search input loses focus for 300ms
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.isSearchFlyoutVisible = false;
    }, 300)
  };
}