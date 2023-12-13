import { LightningElement, wire, track} from 'lwc';
import getProductSections from '@salesforce/apex/ManagedContentController.getProductSections';
import PDPlabel from '@salesforce/label/c.PDP_label';
export default class SnpProductBenifitsTestingPurpose extends LightningElement {
  filteredsections;
  dynamicfilteredsections;
  currentopensectionindex = "0";
  sectionid;
  mobwidth;
  showmobview;
  showdesktopview;
  mobprevsec = "0";
  mobsectionid;
  url = window.location.href;
  spliturl = this.url.split('/');
  product = this.spliturl[this.spliturl.length - 1];
  productid = this.product.substring(0, 18);
  productBenifitsDisplay = true;

  @track imageUrl;

  connectedCallback() {
    getProductSections({
        productid: this.productid
      })
      .then((result) => {
        //console.log('**apexgetProductSections*' + JSON.stringify(result));
        //console.log('**apexgetProductSections*' + Object.keys(result).length);
        this.dynamicfilteredsections = result.filter(section => Object.keys(section).length > 1);
        //console.log('**this.dynamicfilteredsections*' + JSON.stringify(this.dynamicfilteredsections));
        this.filteredsections = this.dynamicfilteredsections.map(item => ({
          id: item.id,
          'verticalHeading': item.verticalHeading,
          'horizontalHeading': item.horizontalHeading,
          'description': item.description,
          'image': item.image,
          'contentKey': PDPlabel + item.contentKey
        }));
        //console.log('**filteredSections*' + JSON.stringify(this.filteredsections));
      })
      .catch((error) => {
        console.log('***' + JSON.stringify(error));
      });

  }
  renderedCallback() {
      if (this.template.querySelector('.mob-section')) {
        this.mobilefuntion();
      }
      if (this.template.querySelector('.product-benifit-section-outer')) {
        this.desktopFunction();
        
      }
    //console.log("current inner width", this.filteredsections);
    if (this.filteredsections ?.length === 0) {
      this.productBenifitsDisplay = false;
    }

  }

  stylingParaOnCard(){
    Array.from(this.template.querySelectorAll(".section-highlight-para")).forEach((ele)=>{
      let actualWidth = ele.offsetWidth /2;
      ele.style.bottom=`${actualWidth}px`;
    });
  }


  //(@Author Aditya) it handle silder for desktop
  desktopFunction() {
    for (let i = 0; i < this.filteredsections.length; i++) {
      const sectionid = i;
      //console.log('^^^^' + i);
      const horizontal = this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + i + '"' + ']');
      //console.log('horizontal' + JSON.stringify(horizontal));
      const myclass = 'class' + i;
      horizontal.classList.add(myclass);
      if (this.filteredsections.length == 3) {
        horizontal.classList.add('widthclass1');
      } else if (this.filteredsections.length == 2) {
        horizontal.classList.add('widthclass2');
      } else if (this.filteredsections.length == 4) {
        horizontal.classList.add('widthclass3');
      } else if (this.filteredsections.length == 1) {
        horizontal.classList.add('full-width');
      } else {
        horizontal.classList.add('widthclass4');
      }
    }
    this.stylingParaOnCard();
    const horizontal = this.template.querySelector('.product-benifit-section-outer[data-section-id="0"]');
    this.template.querySelector('.product-benifit-section-outer[data-section-id="0"] .product-benifit-expandsection-outer').classList.remove('highlight-para-hide');
    this.template.querySelector('.product-benifit-section-outer[data-section-id="0"] .section-highlight-para').classList.add('highlight-para-hide');
    horizontal.classList.remove('hidden');
    
  }

  //(@Author Aditya) it handle silder for mobile
  mobilefuntion() {
    for (let i = 0; i < this.filteredsections.length; i++) {
      const button = this.template.querySelector('.tabitem[data-section-id=' + '"' + i + '"' + ']');
      const card = this.template.querySelector('.mob-section[data-section-id=' + '"' + i + '"' + ']');
      //console.log('mobhorizontal' + JSON.stringify(card));
      const myclass = 'mobclass' + i;
      card.classList.add('mobhidden');
      button.classList.add(myclass);
      card.classList.add(myclass);
    }
    const card = this.template.querySelector('.mob-section[data-section-id="0"]');
    card.classList.remove('mobhidden');
  }


  //(@Author Aditya) on mouse hover which section should be closed and whihc should be open is controlled here
  closedSectionMouseEnterHandle(event) {
    this.sectionid = event.currentTarget.dataset.sectionId;
    //console.log('&&&' + this.sectionid);
    const horizontal = this.template.querySelector(`.product-benifit-section-outer[data-section-id="${this.sectionid}"]`);
    const horizontalprev = this.template.querySelector(`.product-benifit-section-outer[data-section-id="${this.currentopensectionindex}"]`);

    if (this.sectionid > this.currentopensectionindex) {
      for (let i = this.currentopensectionindex; i < this.sectionid; i++) {
        let horizontal = this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + i + '"' + ']');
        //console.log("Aditya Horizontal", horizontal, );
        //console.log("Aditya i current openindex", i);
        //console.log('horizontal' + JSON.stringify(horizontal));
        this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + i + '"' + '] .section-highlight-para').classList.remove('highlight-para-hide');
        this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + i + '"' + '] .product-benifit-expandsection-outer').classList.add('highlight-para-hide');
        horizontal.classList.add('verticaltranslate');

        horizontalprev.classList.add('verticaltranslate');
      }
    } else if (this.sectionid === this.currentopensectionindex) {
      //console.log("NOTHING SHOULD BE DO");
    } else {
      for (let i = this.sectionid; i < this.filteredsections.length; i++) {
        //console.log("Aditya this.sectionid", this.sectionid);
        let horizontal = this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + i + '"' + ']');
        //console.log('horizontal' + JSON.stringify(horizontal));
        horizontal.classList.remove('verticaltranslate');
        //console.log("Aditya horizontal", horizontal);
        this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + i + '"' + '] .section-highlight-para').classList.remove('highlight-para-hide');
        this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + i + '"' + '] .product-benifit-expandsection-outer').classList.add('highlight-para-hide');
      }
    }

    this.currentopensectionindex = this.sectionid;
    this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + this.currentopensectionindex + '"' + '] .product-benifit-expandsection-outer').classList.remove('highlight-para-hide');
    this.template.querySelector('.product-benifit-section-outer[data-section-id=' + '"' + this.currentopensectionindex + '"' + '] .section-highlight-para').classList.add('highlight-para-hide');

  }

  //(@Author Aditya) on mobile or tab on click of button it change to different slide
  mobbuttonhandler(event) {
    this.mobsectionid = event.currentTarget.dataset.sectionId;
    //console.log('&&&' + this.mobsectionid);
    const prevcard = this.template.querySelector(`.mob-section[data-section-id="${this.mobprevsec}"]`);
    const card = this.template.querySelector(`.mob-section[data-section-id="${this.mobsectionid}"]`);

    prevcard.classList.add('mobhidden');
    card.classList.remove('mobhidden');
    // this.currentopensectionindex=this.sectionid;
    this.mobprevsec = this.mobsectionid;

  }


}