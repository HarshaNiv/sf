import { LightningElement, api, track } from 'lwc';
import getProductData from '@salesforce/apex/Snp_pdp_productDetailsController.getProductData';
import getProductVariationInfo from '@salesforce/apex/Snp_pdp_productDetailsController.getProductVariationInfo';
import getAttributeValues from '@salesforce/apex/Snp_pdp_productDetailsController.getAttributeValues';
import queryProductAttributes from '@salesforce/apex/Snp_pdp_productDetailsController.queryProductAttributes';
import queryProductid from '@salesforce/apex/Snp_pdp_productDetailsController.queryProductid';
import upArrow from '@salesforce/resourceUrl/upArrow';
import downArrow from '@salesforce/resourceUrl/downArrow';
import communityId from '@salesforce/community/Id';
  /**
  * @slot productNameSlot
  * @slot varients
  * @slot tierDiscount
  * @slot SKU
  * @slot Price
  *@slot quantity
  *@slot GetQuote
*/
export default class snp_pdp_child_productDeatils extends LightningElement {
  @api recordId;
  @api product;
  productFullDescription;
  productDescription;
  shortDescription;
  fullDescription;
  productTittle;
  isVariation=false;
  isparent=true;
  //showDetailSection = false;
  showMore = true;
  showLess = false;
  showTierDiscountSection = false;
  productattributes;
  attributevalues1=[];

  @track attributeList = [];
  upArrow = upArrow;
  downArrow = downArrow;
  showUpArrow = false;
  selectedAttribute;
  selectedValues=[];
  productId;
  variationparentid;
  queryattributes;
  nextIndex;
  previndex;
  url2;
  

  renderedCallback(){
    // debugger;
    const trierDiscountSection = this.template.querySelector('.commerce_product_details-pricingTiers_pricingTiers');
    if(trierDiscountSection !== null){
      this.showTierDiscountSection = true;
    }

  }

  connectedCallback(){   
   // debugger;
    const pageurl=window.location.href
   // Find the last occurrence of "/"
    const lastSlashIndex = pageurl.lastIndexOf('/');
    const secondLastSlashIndex = pageurl.lastIndexOf('/', lastSlashIndex - 1);

  // Get the part of the URL before the last "/"
    this.url2 = pageurl.substring(0, secondLastSlashIndex);
  //console.log('pageurl----->'+this.url);
    

    //console.log('storename'+this.storeName);
    this.url=window.location.href;
    this.spliturl=this.url.split('/');
    this.productname=this.spliturl[this.spliturl.length-2]
    this.product=this.spliturl[this.spliturl.length-1];
    this.productId=this.product.substring(0,18);
    //console.log('this.productId----->'+this.productId);

    
    getProductVariationInfo({productId:this.productId,communityId:communityId})
        .then(result => {
          //console.log('getProductVariationInfo --', result);
          if(result.productClass=='VariationParent'){
            this.variationparentid=this.productId;
          }else{
            this.variationparentid=result.variationParentId;
          }
          //console.log('this.variationparentid'+this.variationparentid);
          let attributeSetInfo=result.attributeSetInfo;
          let attributesetname=Object.keys(attributeSetInfo);
          //console.log(attributesetname[0]);
          let simpleData =attributeSetInfo[attributesetname[0]].attributeInfo;
          //result.attributeSetInfo.LED_Flexible_Strip
          let childattributes=result.variationAttributeSet.attributes;
          this.productattributes=Object.keys(simpleData);
          //console.log('----------->productattributes'+this.productattributes);
          const labels = [];
          for (const attribute of Object.values(simpleData)) {
              labels.push(attribute.label);
              //console.log('---->labels'+labels)
          }

         // console.log(labels);
          if(result.productClass != 'Simple'){
            //console.log('OUTPUT 40 : ', result.attributeSetInfo.LED_Flexible_Strip.attributeInfo);
            for (const value of this.productattributes) {
              // console.log(`${key} : ${simpleData[key].availableValues}`);
              let sampleMAp = {
                label : value,
                //values : simpleData[key].availableValues,
                values:['Select...'],
                selectedValue : 'Select...',
                Name:''

              }
              this.attributeList.push(sampleMAp);
            }
            for (let i = 0; i <this.attributeList.length; i++) {
              this.attributeList[i].Name = labels[i];
          }
           //console.log('OUTPUT attributeList: ',JSON.stringify(this.attributeList));
            //add select option in list
            this.attributeList.forEach(Element =>{
            //Element.values.unshift('Select...');
            // console.log('attributeList Element : ', JSON.stringify(Element.values));
          })
          if(result.productClass=='Variation'){
            for (let attribute of this.attributeList) {
              if (childattributes.hasOwnProperty(attribute.label)) {
                  attribute.selectedValue = childattributes[attribute.label];
              }
          }

          }
            // console.log('68 updated list : ', JSON.stringify(this.attributeList));
            //Set the present selected values to the attributeList
            // console.log('Selected attribute Values : ',typeof result.variationAttributeSet.attributes);
            let currentselectedAttribute = result.variationAttributeSet.attributes;
            let indexOfCurrentAttrubuteList = 0;

            for(let value in currentselectedAttribute){
              // console.log('OUTPUT : ',this.attributeList[value]);
              this.attributeList[indexOfCurrentAttrubuteList].selectedValue = currentselectedAttribute[value] === null ? 'Select...' :currentselectedAttribute[value];
              // console.log('OUTPUT : ', currentselectedAttribute[value]);
              indexOfCurrentAttrubuteList++;
            }
            // console.log('this.attributeList after ', JSON.stringify(this.attributeList));
          }
          //debugger;
          getAttributeValues({ attribute: this.attributeList[0].label,variantParentId:this.variationparentid})
          .then(result => {
            //console.log('attribute values----------->'+ JSON.stringify(result))  
            this.attributevalues1=result; 
            this.attributeList[0].values = [...this.attributeList[0].values, ...this.attributevalues1];
           // console.log('this.attributeList[0].values'+this.attributeList[0].values);
           // console.log('attributelist'+JSON.stringify(this.attributeList));
            this.queryattributes=this.attributeList[1].label;
           // console.log('queryattributes'+this.queryattributes);
          })
          .catch(error => {
            console.log('error',error);
          });
        })
        .catch(error => {
            console.log('Error --', error);
        });
  
    
    // console.log('Snp_pdp_productDetails recordId- ', this.recordId);
    // console.log('Snp_pdp_productDetails product Details- ', this.ProductDetails);
    getProductData({productId : this.recordId})
    .then(result => {
      debugger;
      console.log('descrip----'+JSON.stringify(result));
      const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(result.Full_Description__c);
      const hasHtmlTags_SD = /<\/?[a-z][\s\S]*>/i.test(result.Short_Description__c);

      this.productTittle=result.Product_Title__c;
      if(result.productclass=='Variation'){
        if (hasHtmlTags_SD) {
        this.productFullDescription = this.extractTextFromHTML(result.Short_Description__c);
        }
        else{
          this.productFullDescription = result.Short_Description__c;
        }
        this.isVariation=true;
        this.isparent=false;
        if( this.productFullDescription > 225){
          if (hasHtmlTags_SD) {
          let desc = this.extractTextFromHTML(result.Short_Description__c).slice(0, 225);
          this.productDescription = desc;
          }
          else{
            let desc = result.Short_Description__c.slice(0, 225);
            this.productDescription = desc;
          }
        }else{
          this.showMore = false;
          this.showLess = false;
          if (hasHtmlTags_SD) {
          this.productDescription = this.extractTextFromHTML(result.Short_Description__c);
          }
          else{
            this.productDescription = result.Short_Description__c;
          }
        }
      }else{
        if (hasHtmlTags) {
        this.productFullDescription = this.extractTextFromHTML(result.Full_Description__c);
        }
        else{
          this.productFullDescription = result.Full_Description__c;
        }
        this.isparent=true;
        this.isVariation=false;
        if(this.productFullDescription > 225){
          let desc = result.Description.slice(0, 225);
          this.productDescription = desc;
        }else{
          this.showMore = false;
          this.showLess = false;
          if (hasHtmlTags) {
          this.productDescription =this.extractTextFromHTML(result.Full_Description__c);
          }
          else{
            this.productDescription = result.Full_Description__c;
          }
        }
      }
     
      //this.showDetailSection = true;       
    })
    .catch(error => {
        console.log('Snp_pdp_productDetails Error- ',JSON.stringify(error));
    });
  }

  handleSeeMore(){
    this.showMore = false;
    this.showLess = true;
    this.productDescription = this.productFullDescription;
  }

  handleSeeLess(){
    this.showMore = true;
    this.showLess = false;
    this.productDescription = this.productFullDescription.slice(0, 225);
  }

	  handleShowHideOptions(event){
    event.preventDefault();
    // console.log('click event');
    event.stopPropagation()
    let currentIndex = event.currentTarget.dataset.id;
    this.selectedAttribute = currentIndex;
    
    const clickedElement = this.template.querySelectorAll('div .inner');
    clickedElement[currentIndex].focus();
    const downArrowElement = this.template.querySelectorAll('div .downArrowImage');
    // console.log('downArrowElement : ', downArrowElement);
    downArrowElement[currentIndex].classList.toggle("hideDiv");
    const upArrowElement = this.template.querySelectorAll('div .upArrowImage');
    // console.log('upArrowElement : ', upArrowElement);
    upArrowElement[currentIndex].classList.toggle("hideDiv");
    const ulElement = this.template.querySelectorAll('ul');
    // console.log('ulElement : ', ulElement);
    ulElement[currentIndex].classList.toggle("hideDiv");
    
  }
  
  focusOutEvent(event){
    event.stopPropagation()
    // console.log("this is blur current target", event.currentTarget.dataset.id);
    var budrIndex = event.currentTarget.dataset.id;
    setTimeout(()=>{
      const ulElement = this.template.querySelectorAll('ul');
      ulElement[budrIndex].classList.add('hideDiv');
      // console.log('ulElement : ', ulElement);
      const downArrowElement = this.template.querySelectorAll('div .downArrowImage');
      // console.log('downArrowElement : ', downArrowElement);
      downArrowElement[budrIndex].classList.remove('hideDiv');
  
      const upArrowElement = this.template.querySelectorAll('div .upArrowImage');
      // console.log('upArrowElement : ', upArrowElement);
      upArrowElement[budrIndex].classList.add('hideDiv');
    }, 500);
    
  }

  handleSelectListItem(event){
    debugger;
    // console.log('select List Id : ', event.target.dataset.id);
    if(this.selectedAttribute<this.previndex){
      const index=parseInt(this.selectedAttribute)+1;
      let indexstring=index.toString();
      this.selectedValues.splice(indexstring)
      for (let i =indexstring; i < this.attributeList.length; i++) {
        this.attributeList[i].selectedValue = 'Select...';
    }

    }
    let slectedIndex = event.target.dataset.id;
    //console.log('slectedIndex'+slectedIndex);
    const index=parseInt(this.selectedAttribute)+1;
    this.nextIndex=index.toString();
    //console.log(this.nextIndex);
    let selectedValue = this.attributeList[this.selectedAttribute].values[slectedIndex];
    //console.log('selectedValue'+selectedValue);
    if (selectedValue !== 'Select...') {
      this.attributeList[this.selectedAttribute].selectedValue = selectedValue;

      const existingIndex = this.selectedValues.findIndex(item => item.label === this.attributeList[this.selectedAttribute].label);

        if (existingIndex !== -1) {
            // Update the value of an existing entry
            this.selectedValues[existingIndex].values = selectedValue;
        } else {
            // Add a new entry to selectedValues
            let selectedvaluemap = {
                label: this.attributeList[this.selectedAttribute].label,
                values: selectedValue
            };
            this.selectedValues.push(selectedvaluemap);
           // const index=this.selectedAttribute+1
           // this.queryattributes=this.attributeList[index].label;
            //console.log(queryattributes)

        }

        //console.log('selectedValues' + JSON.stringify(this.selectedValues));
        if(this.selectedAttribute!=this.attributeList.length-1){
          this.queryattributes=this.attributeList[this.nextIndex].label;
        }
        //console.log('queryattributes'+this.queryAttributes);
    }
    if(this.selectedAttribute==this.attributeList.length-1){
      queryProductid({ selectedValues:this.selectedValues,variantParentId:this.variationparentid})
      .then(result => {
            console.log('*****'+JSON.stringify(result));
            //this.attributeList[this.nextIndex].values =result ;
           // console.log('queryattributes'+queryattributes);
           window.location.href=this.url2+'/'+result[0];
      })
      .catch(error => {
        console.log('*****'+JSON.stringify(error))
      });
    }else{
    queryProductAttributes({queryAttributes:this.queryattributes , selectedValues:this.selectedValues,variantParentId:this.variationparentid})
    .then(result => {
          //console.log('*****'+JSON.stringify(result));
          this.attributeList[this.nextIndex].values =result ;
         // console.log('queryattributes'+queryattributes);
          this.previndex=this.selectedAttribute;
          //console.log('this.previndex'+this.previndex);
    })
    .catch(error => {
      console.log('*****'+JSON.stringify(error))
    });
  }
    

    // let selectedvaluemap = {
    //   label : this.attributeList[this.selectedAttribute].label,
    //   //values : simpleData[key].availableValues,
    //   values:this.attributeList[this.selectedAttribute].selectedValue
    //  // selectedValue : 'Select...'

    // }
    // this.selectedValues.push(selectedvaluemap);
    // console.log('selectedValues'+JSON.stringify(this.selectedValues));

    const downArrowElement = this.template.querySelectorAll('div .downArrowImage');
    // console.log('downArrowElement : ', downArrowElement);
    downArrowElement[this.selectedAttribute].classList.toggle("hideDiv");

    const upArrowElement = this.template.querySelectorAll('div .upArrowImage');
    // console.log('upArrowElement : ', upArrowElement);
    upArrowElement[this.selectedAttribute].classList.toggle("hideDiv");

    const ulElement = this.template.querySelectorAll('ul');
    // console.log('ulElement : ', ulElement);
    ulElement[this.selectedAttribute].classList.toggle("hideDiv");

    // Get all innerlabel elements to check if value is not equals select and get new product id through apex
    
    const innerLabelElements = this.template.querySelectorAll('div .innerLabel');
    
    setTimeout(()=>{
      let flag = false;
      for(let x=0 ; x<innerLabelElements.length; x++){
        if(innerLabelElements[x].innerText === 'Select...'){
          flag = true;
        }
      }
      if(!flag){
        console.log('Call APex method');
      }
    },1000);
    //let checkPoint = innerLabelElements.every((ele)=> ele.innerText != "Select...");
    //if(checkPoint){
     // console.log("MAKE APEX CALL");
    //}

  }

  extractTextFromHTML(htmlString) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    return htmlDoc.body.textContent || "";
}
}