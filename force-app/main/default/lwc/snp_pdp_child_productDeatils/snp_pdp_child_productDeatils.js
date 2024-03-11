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
    const trierDiscountSection = this.template.querySelector('.commerce_product_details-pricingTiers_pricingTiers');
    if(trierDiscountSection !== null){
      this.showTierDiscountSection = true;
    }
  }

  connectedCallback(){   
    const pageurl=window.location.href
   // Find the last occurrence of "/"
    const lastSlashIndex = pageurl.lastIndexOf('/');
    const secondLastSlashIndex = pageurl.lastIndexOf('/', lastSlashIndex - 1);

  // Get the part of the URL before the last "/"
    this.url2 = pageurl.substring(0, secondLastSlashIndex);
    

    this.url=window.location.href;
    this.spliturl=this.url.split('/');
    this.productname=this.spliturl[this.spliturl.length-2]
    this.product=this.spliturl[this.spliturl.length-1];
    this.productId=this.product.substring(0,18);

    
    getProductVariationInfo({productId:this.productId,communityId:communityId})
        .then(result => {
          if(result.productClass=='VariationParent'){
            this.variationparentid=this.productId;
          }else{
            this.variationparentid=result.variationParentId;
          }
          let attributeSetInfo=result.attributeSetInfo;
          let attributesetname=Object.keys(attributeSetInfo);
          let simpleData =attributeSetInfo[attributesetname[0]].attributeInfo;
          //result.attributeSetInfo.LED_Flexible_Strip
          let childattributes=result.variationAttributeSet.attributes;
          this.productattributes=Object.keys(simpleData).sort((a, b) => simpleData[a].sequence - simpleData[b].sequence);
          const sortdata=Object.values(simpleData);
          sortdata.sort((a, b) => a.sequence - b.sequence);
          const labels = [];
         
          for (const attribute of sortdata) {
              labels.push(attribute.label);
          }

          if(result.productClass != 'Simple'){
            for (const value of this.productattributes) {
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
            //add select option in list
            this.attributeList.forEach(Element =>{
            //Element.values.unshift('Select...');
          })
          if(result.productClass=='Variation'){
            for (let attribute of this.attributeList) {
              if (childattributes.hasOwnProperty(attribute.label)) {
                  attribute.selectedValue = childattributes[attribute.label];
              }
          }

          }
            //Set the present selected values to the attributeList

            // let currentselectedAttribute = result.variationAttributeSet.attributes;
            // let indexOfCurrentAttrubuteList = 0;

            // for(let value in currentselectedAttribute){

            //   this.attributeList[indexOfCurrentAttrubuteList].selectedValue = currentselectedAttribute[value] === null ? 'Select...' :currentselectedAttribute[value];


            //   indexOfCurrentAttrubuteList++;
            // }

          }
          getAttributeValues({ attribute: this.attributeList[0].label,variantParentId:this.variationparentid})
          .then(result => {
            this.attributevalues1=result; 
            this.attributeList[0].values = [...this.attributeList[0].values, ...this.attributevalues1];
            this.queryattributes=this.attributeList[1].label;
          })
          .catch(error => {
            console.log('error',error);
          });
        })
        .catch(error => {
            console.log('Error --', error);
        });
  
    
    getProductData({productId : this.recordId})
    .then(result => {
      //console.log('short_descriptions'+ json.stringify(result.Short_Description__c));
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
        if( this.productFullDescription.length > 225){
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
        if(this.productFullDescription.length > 225){
          let desc =this.extractTextFromHTML(result.Full_Description__c).slice(0, 225);
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
    event.stopPropagation()
    let currentIndex = event.currentTarget.dataset.id;
    this.selectedAttribute = currentIndex;
    
    const clickedElement = this.template.querySelectorAll('div .inner');
    clickedElement[currentIndex].focus();
    const downArrowElement = this.template.querySelectorAll('div .downArrowImage');
    downArrowElement[currentIndex].classList.toggle("hideDiv");
    const upArrowElement = this.template.querySelectorAll('div .upArrowImage');
    upArrowElement[currentIndex].classList.toggle("hideDiv");
    const ulElement = this.template.querySelectorAll('ul');
    ulElement[currentIndex].classList.toggle("hideDiv");
    
  }
  
  focusOutEvent(event){
    event.stopPropagation()
    var budrIndex = event.currentTarget.dataset.id;
    setTimeout(()=>{
      const ulElement = this.template.querySelectorAll('ul');
      ulElement[budrIndex].classList.add('hideDiv');
      const downArrowElement = this.template.querySelectorAll('div .downArrowImage');
      downArrowElement[budrIndex].classList.remove('hideDiv');
  
      const upArrowElement = this.template.querySelectorAll('div .upArrowImage');
      upArrowElement[budrIndex].classList.add('hideDiv');
    }, 500);
    
  }

  handleSelectListItem(event){
   
    if(this.selectedAttribute<this.previndex){
      const index=parseInt(this.selectedAttribute)+1;
      let indexstring=index.toString();
      this.selectedValues.splice(indexstring)
      for (let i =indexstring; i < this.attributeList.length; i++) {
        this.attributeList[i].selectedValue = 'Select...';
    }

    }
    let slectedIndex = event.target.dataset.id;
    const index=parseInt(this.selectedAttribute)+1;
    this.nextIndex=index.toString();
    let selectedValue = this.attributeList[this.selectedAttribute].values[slectedIndex];
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

        }

        if(this.selectedAttribute!=this.attributeList.length-1){
          this.queryattributes=this.attributeList[this.nextIndex].label;
        }
    }
    if(this.selectedAttribute==this.attributeList.length-1){
      queryProductid({ selectedValues:this.selectedValues,variantParentId:this.variationparentid})
      .then(result => {
            //this.attributeList[this.nextIndex].values =result ;
           window.location.href=this.url2+'/'+result[0];
      })
      .catch(error => {
        console.log('*****'+JSON.stringify(error))
      });
    }else{
    queryProductAttributes({queryAttributes:this.queryattributes , selectedValues:this.selectedValues,variantParentId:this.variationparentid})
    .then(result => {
          this.attributeList[this.nextIndex].values =result ;
          this.previndex=this.selectedAttribute;
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

    const downArrowElement = this.template.querySelectorAll('div .downArrowImage');
    downArrowElement[this.selectedAttribute].classList.toggle("hideDiv");

    const upArrowElement = this.template.querySelectorAll('div .upArrowImage');
    upArrowElement[this.selectedAttribute].classList.toggle("hideDiv");

    const ulElement = this.template.querySelectorAll('ul');
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
    //}

  }

  extractTextFromHTML(htmlString) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    return htmlDoc.body.textContent || "";
}
}