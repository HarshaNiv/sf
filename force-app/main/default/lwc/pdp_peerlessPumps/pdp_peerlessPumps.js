import { LightningElement, track, api, wire } from 'lwc';
import communityId from '@salesforce/community/Id';
import userid from '@salesforce/user/Id';
import getProductInfo from '@salesforce/apex/PP_PDP_FetchProductsData.getProductInfo';
import getMiscProductInfo from '@salesforce/apex/PP_PDP_FetchProductsData.getMiscProductInfo';
import createCart from '@salesforce/apex/PP_PDP_FetchProductsData.createCart';
import updateItemCart from '@salesforce/apex/PP_PDP_FetchProductsData.updateItemCart';
import getProducts from '@salesforce/apex/PP_PDP_FetchProductsData.getProducts';
import checkCart from '@salesforce/apex/PP_PDP_FetchProductsData.checkCart';
import addItemCart from '@salesforce/apex/PP_PDP_FetchProductsData.addItemCart';
import { publish, MessageContext } from 'lightning/messageService';
import PeerlessMessageChannel from "@salesforce/messageChannel/PeerlessMessageChannel__c"
import isguest from '@salesforce/user/isGuest';
/**
 * @slot slot1
 */
export default class Pdp_peerlessPumps extends LightningElement {
  @api product_id;

  productData;
  miscProdData = [];
  finalSKUlist = [];
  finalSKU = '';
  parentSKU = ''
  product_details;
  serviceProdData;
  quantityVal = 1;
  kitQuantity = 0;
  selectedValue = '';
  value = ''
  prodSKU;
  sample;
  cartButton = 'Add To Cart'
  openerDetails = {};
  activeCartId;
  prodList = [];
  miscCheck = [];
  testarray = [];

  isModalOpen2 = false;
  handleCartError = false;
  isButtonDisabled = false
  iskitButtonDisabled = true;
  spinnerloader = false;
  checkval = false;
  validCheckInp = false;
  isModalOpen4 = false;
  isModalOpen3 = false;
  prod_Visible = false
  showCartOptions = false;
  isModalOpen = false;
  isCartButton = false;
  handlekitError = false
  watersupplyerror = false
  inputQuantity = false
  incrementButtonDisabled = false



  @wire(MessageContext)  //using wire adapter to get the reference of the componenet(publisher component)
  context;

  //Fetching parent product details
  @wire(getProducts, { prodID: '$product_id' })
  wiredGetProducts({ error, data }) {
    if (data) {
      this.product_details = data;
      this.parentSKU = data.StockKeepingUnit;
      this.finalSKU = this.parentSKU;
      var category_Name = data.ProductCategoryProducts[0].ProductCategory.Name;
      console.log('category_Name-->' + category_Name);
      this.publishSKU();
      this.connectedCallback();
      console.log('Data --> ', JSON.stringify(data));
      console.log('this.parentSKU--->' + this.parentSKU);
      if (category_Name == "CONTROLLERS") {
        this.prod_Visible = true
        console.log('this.prod_Visible--' + this.prod_Visible);
      }
      if (data.ProductClass == 'VariationParent') {
        this.isCartButton = true
        this.inputQuantity = true
        this.incrementButtonDisabled = true
      } else {
        this.isCartButton = false
        this.inputQuantity = false
        this.incrementButtonDisabled = false
      }
    } else if (error) {
      // TODO Error handling
      console.log('error --> ', error);
    }
  }

  //Water supply options
  get options() {
    return [
      { label: 'Select...', value: '' },
      { label: 'City Supply', value: 'City Supply' },
      { label: 'Water Tank', value: 'Water Tank' },
    ];
  }

  connectedCallback() {
    const openerDetails = window.navigator;
    console.log('Opener Details:', openerDetails);
    console.log('window.sessionStorage' + JSON.stringify(window.sessionStorage));
    console.log('sessionStorage--' + JSON.stringify(localStorage));
    if (isguest) {
      this.activeCartId = localStorage.getItem('cart_id');
    } else {
      localStorage.clear();
    }
    console.log('this.activeCartId1----' + this.activeCartId);
    console.log('localStorage---' + JSON.stringify(localStorage));
    console.log('product_id---' + this.product_id);
    console.log('isguest--' + isguest)
    if (this.quantityVal == 1) {
      this.isButtonDisabled = true;
    }

    //Fetching kits products data
    getProductInfo({ CategoryName: 'kits', CommunityId: communityId, userid: userid })
      .then(result => {
        this.productData = result.map((product, index) => ({
          ...product,
          showQuantitySelector: index === 0,
          checkedVal: false,
          quantityVal: 1,
          index: index
        }));
        console.log('Data --> ', JSON.stringify(result));
      })
      .catch(error => {
        // TODO Error handling
        console.log('error --> ', error);
      });

    //Fetching OPTION SET products data
    getMiscProductInfo({ CategoryName: 'OPTION SET', CommunityId: communityId, userid: userid })
      .then(result => {
        this.miscProdData = result.map((product, index) => ({
          ...product,
          checkedVal: false,
          index: index,
          quantityVal: 0,
          disabled: false
        }));
        console.log('Data --> ', JSON.stringify(result));
      })
      .catch(error => {
        // TODO Error handling
        console.log('error --> ', error);
      });

    //Fetching SERVICES Products data
    getMiscProductInfo({ CategoryName: 'SERVICES', CommunityId: communityId, userid: userid })
      .then(result => {
        this.serviceProdData = result.map((product, index) => ({
          ...product,
          checkedVal: true,
          index: index,
          quantityVal: 1,
          disabled: true
        }));
        console.log('Data --> ', JSON.stringify(result));
      })
      .catch(error => {
        // TODO Error handling
        console.log('error --> ', error);
      });
    //Checking active cart
    this.checkingcart();
    this.updateCartItem();
  }

  // NO Button onclick events
  closeModal() {
    this.isModalOpen = false;
    console.log('Prod' + JSON.stringify(this.productData));
    this.productData[0].checkedVal = false;
    this.productData[0].quantityVal = 1;
    console.log(JSON.stringify(this.productData));
    this.isModalOpen2 = true;
  }

  closeModal2() {
    this.isModalOpen2 = false;
    this.productData[1].checkedVal = false;
    this.productData[1].quantityVal = 0;
    console.log(this.productData);
    this.kitQuantity = 0;
  }
  
  //Quantity selector event
  handleQuantityChange(event) {
    const conQuantity = event.target.value;
    this.quantityVal = conQuantity;
    console.log('conQuantity---' + conQuantity);
    if (conQuantity == 1) {
      this.isButtonDisabled = true;
      console.log('this.isCartButton---' + this.isCartButton);
    }
    this.checkQuantityselector();
  }

  //Kit Quantity selector event
  handleKitQuantityChange(event) {
    const kitQuantity = event.target.value;
    this.productData[0].quantityVal = kitQuantity;
    if (kitQuantity == 1) {
      this.iskitButtonDisabled = true;
      console.log('this.isCartButton---' + this.isCartButton);
    } else if (kitQuantity == 0) {
      this.productData[0].quantityVal = 1;
      this.iskitButtonDisabled = true;
    } else {
      this.iskitButtonDisabled = false;
      const isValidQuantity = this.ValidateQuantity(kitQuantity)
      console.log('quantityVal-------->' + isValidQuantity);
      if (isValidQuantity != false) {
        this.handlekitError = false;
        this.isCartButton = false;
      } else {
        this.handlekitError = true;
        this.isCartButton = true;
      }
    }

  }

  //Validating Quantity input value(Number)
  ValidateQuantity(number) {
    const phonePattern = /^\d+$/;
    return phonePattern.test(number);
  }

  //Quantity selector events
  incrementQuantity() {
    this.quantityVal = Number(this.quantityVal) + 1;
    console.log('this.quantityVal--' + this.quantityVal);
    this.checkQuantityselector();
  }

  decrementQuantity() {
    this.quantityVal = Number(this.quantityVal) - 1;
    console.log('this.quantityVal---' + this.quantityVal);
    this.checkQuantityselector();
  }

  //Kits quantity selector events
  kitdecrementQuantity(event) {
    var quantityVal = event.currentTarget.dataset.id - 1;
    console.log('quantityVal---' + quantityVal);
    this.productData[0].quantityVal = quantityVal;
    if (quantityVal == 1) {
      this.iskitButtonDisabled = true;
    }
  }

  kitincrementQuantity(event) {
    var quantityVal = Number(event.currentTarget.dataset.id) + 1;
    console.log('quantit yVal--' + quantityVal);
    this.productData[0].quantityVal = quantityVal;
    if (quantityVal != 0) {
      this.iskitButtonDisabled = false;
    }
  }

  //Water supply input handling event
  handleSelectChange(event) {
    // Retrieve the selected value and the index from the dataset
    this.selectedValue = event.detail.value;
    console.log('Selected Value:', this.selectedValue);
    if (this.selectedValue != '' && this.selectedValue == 'Water Tank') {
      this.isModalOpen = true;
      this.updateMiscProd();
      this.watersupplyerror = false
    } else if (this.selectedValue != '' && this.selectedValue == 'City Supply') {
      this.isModalOpen = true;
      this.watersupplyerror = false
    } else {
      this.miscProdData = this.miscProdData.map((product, index) => ({
        ...product,
        checkedVal: product.stockKeepingUnit === 'ST30' ? false : undefined,
        disabled: product.stockKeepingUnit === 'ST30' ? false : undefined,
        quantityVal: product.stockKeepingUnit === 'ST30' ? 0 : undefined
      }));
      this.watersupplyerror = false
    }
  }

  //Yes button events
  selectProdModal() {
    this.closeModal();
    this.productData[0].checkedVal = true;
    this.productData[0].quantityVal = this.quantityVal;
  }

  selectProdModal2() {
    this.closeModal2();
    this.productData[1].checkedVal = true;
    this.kitQuantity = this.quantityVal;
    this.miscProdDataEvent();
  }

  //Event for to select ST30 Misc product based on Water supply event
  updateMiscProd() {
    this.miscProdData = this.miscProdData.map((product, index) => ({
      ...product,
      checkedVal: (product.stockKeepingUnit === 'ST30') || (product.checkedVal === true) ? true : false,
      disabled: product.stockKeepingUnit === 'ST30' ? true : false,
      quantityVal: product.stockKeepingUnit === 'ST30' ? this.quantityVal : product.quantityVal
    }));
  }

  //Kits product event
  async kitsProdEvent(event) {
    this.prodIndex = event.currentTarget.dataset.id;
    this.sample = event.target.checked;
    console.log('prodIndex--->' + this.prodIndex);
    console.log('sample--->' + this.sample);
    this.productData[this.prodIndex].checkedVal = this.sample;
    if (this.prodIndex == 1 && this.sample == true) {
      this.kitQuantity = this.quantityVal;
      await this.miscProdDataEvent();
    } else if (this.prodIndex == 1 && this.sample == false) {
      this.kitQuantity = 0;
      this.miscProdData = this.miscProdData.map((product, index) => ({
        ...product,
        checkedVal: (product.checkedVal === true && product.stockKeepingUnit != 'TM2') ? true : ((product.stockKeepingUnit === 'TM2') ? false : undefined),
        disabled: (product.checkedVal === true && product.stockKeepingUnit != 'TM2') ? false : ((this.selectedValue != '' && product.stockKeepingUnit === 'ST30') ? true : undefined),
        quantityVal: (product.stockKeepingUnit === 'TM2') ? 0 : (product.checkedVal === true) ? this.quantityVal : 0
      }));
    } else {
      this.productData[this.prodIndex].quantityVal = (this.sample == true ? this.quantityVal : 0);
    }
  }

  //Miscellanous Product events
  async miscProdDataEvent() {
    this.miscProdData = this.miscProdData.map((product, index) => ({
      ...product,
      checkedVal: (product.checkedVal === true) || (product.stockKeepingUnit === 'TM2') ? true : false,
      disabled: (product.stockKeepingUnit === 'TM2') || (this.selectedValue != '' && product.stockKeepingUnit === 'ST30') ? true : false,
      quantityVal: (product.checkedVal === true) || (product.stockKeepingUnit === 'TM2') ? this.quantityVal : 0
    }));
    console.log('misc-->' + JSON.stringify(this.miscProdData));
  }

  miscProd(event) {
    this.finalSKUlist = [];
    this.finalSKUlist = [this.parentSKU];
    const prod = event.target.dataset.index;
    const checkedVal = event.target.checked;
    const prodsku = event.target.dataset.sku;
    if (prodsku == 'TM2') {
      this.productData[1].checkedVal = true
      this.kitQuantity = this.quantityVal;
    }
    console.log(prod);
    console.log(checkedVal);
    this.miscProdData[prod].checkedVal = checkedVal;
    console.log(this.miscProdData);
    if (checkedVal == true) {
      this.miscProdData[prod].quantityVal = this.quantityVal;
    } else {
      this.miscProdData[prod].quantityVal = 0;
      console.log(this.miscProdData);
    }
    this.miscProdData = this.miscProdData.map((product, index) => ({
      ...product,
      sku: product.checkedVal === true ? this.finalSKUlist.push(product.stockKeepingUnit) : undefined
    }));
    this.finalSKU = this.finalSKUlist.join('-');
    this.publishSKU();
  }

  //Quantity Selector
  checkQuantityselector() {
    if (this.quantityVal == '') {
      this.quantityVal = 1;
    }
    if (this.productData[0].checkedVal == true) {
      this.productData[0].quantityVal = this.quantityVal;
    }
    if (this.productData[1].checkedVal == true) {
      this.kitQuantity = this.quantityVal;
    }
    if (this.quantityVal == 1) {
      this.isButtonDisabled = true;
    } else if (this.quantityVal == 0) {
      this.quantityVal = 1;
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
      const isValidQuantity = this.ValidateQuantity(this.quantityVal)
      console.log('quantityVal-------->' + isValidQuantity);
      if (isValidQuantity != false) {
        this.handleCartError = false;
        this.isCartButton = false;
      } else {
        this.handleCartError = true;
        this.isCartButton = true;
      }
    }
    if (this.quantityVal == 1) {
      this.iskitButtonDisabled = true;
    } else {
      this.iskitButtonDisabled = false;
    }
    this.miscProdData = this.miscProdData.map((product, index) => ({
      ...product,
      quantityVal: product.checkedVal === true ? this.quantityVal : 0
    }));
  }

  //Add to cart button events
  checkMiscProd() {
    var activeMiscProdData = [];
    activeMiscProdData = this.miscProdData.map((product, index) => ({
      id: product.checkedVal === true ? product.prodId : undefined
    })).filter(item => item.id !== undefined);
    if (activeMiscProdData.length <= 10 && this.selectedValue !== '') {
      this.isModalOpen3 = true;
    } else if (activeMiscProdData.length > 10 && this.selectedValue !== '') {
      this.isModalOpen4 = true;
    } else {
      this.addToCart()
    }
  }

  async addToCart() {
    if (this.selectedValue !== '') {
      this.isModalOpen4 = false;
      this.isModalOpen3 = false;
      this.spinnerloader = true;
      this.cartButton = 'Adding...'
      this.prodList = [this.product_id];
      console.log('prodList' + this.prodList);
      if (this.productData.length > 0) {
        var activeKitProdData = this.productData.map((product, index) => ({
          id: product.checkedVal === true ? this.prodList.push(product.prodId) : undefined
        })).filter(item => item.id !== undefined);
        console.log('this.activeKitProdData--' + JSON.stringify(activeKitProdData));
      }
      if (this.miscProdData.length > 0) {
        var activeMiscProdData = this.miscProdData.map((product, index) => ({
          id: product.checkedVal === true ? this.prodList.push(product.prodId) : undefined
        })).filter(item => item.id !== undefined);
        console.log('this.activeMiscProdData--' + JSON.stringify(activeMiscProdData));
      }
      console.log('prodList--' + JSON.stringify(this.prodList));
      this.prodList.reverse();
      console.log('prodList1--' + JSON.stringify(this.prodList));
      console.log('this.quantityVal--' + this.quantityVal);

      if ((userid == null && localStorage.length == 0) || (userid != null && this.activeCartId == null)) {
        await createCart({ CommunityId: communityId, userid: userid, prodIds: this.prodList, quantityVal: this.quantityVal })
          .then(result => {
            console.log('Data --> ', JSON.stringify(result));
            this.activeCartId = result.cartId;
            if (isguest) {
              localStorage.setItem('cart_id', this.activeCartId);
              console.log('localStorage---' + JSON.stringify(localStorage));
            }
            console.log('this.activeCartId--' + this.activeCartId);
            this.addCartItem();
          })
          .catch(error => {
            // TODO Error handling
            console.log('error --> ', error);
          });
      } else {
        this.addCartItem()
      }

    } else {
      let requriedField = this.template.querySelector('.water-supply-class');
      requriedField.classList.add('slds-has-error');
      this.watersupplyerror = true;
    }
  }

  //Method to update parent cart item
  updateCartItem() {
    console.log('CartId--' + this.activeCartId);
    updateItemCart({ CommunityId: communityId, userid: userid, cartIds: this.activeCartId })
      .then(res => {
        console.log('updateData -------> ', JSON.stringify(res));
      })
      .catch(error => {
        // TODO Error handling
        console.log('error --> ', error);
      });
  }

  //LMS Method
  publishSKU() {
    const msg = {
      sku: {
        value: this.finalSKU
      }
    }
    publish(this.context, PeerlessMessageChannel, msg)  //publishing
  }

  //Modal popup events
  continueShopping() {
    this.spinnerloader = true;
    setTimeout(() => {
      let url = window.location.href;
      console.log(url);
      window.location.href = url;
    }, 0)
  }

  viewCart() {
    this.spinnerloader = true;
    setTimeout(() => {
      let url = window.location.origin + "/PeerlessPump/cart";
      console.log(url);
      window.location.href = url;
    }, 0)
  }

  //Checking Active cart
  checkingcart() {
    console.log('this.activeCartIdlogin----' + this.activeCartId);
    checkCart({ CommunityId: communityId, userid: userid, cartids: this.activeCartId })
      .then(result => {
        if (isguest && result != null) {
          this.activeCartId = result;
          console.log('this.activeCartId111----' + this.activeCartId);
          console.log('Guest--' + JSON.stringify(result));
        } else if (!isguest || (isguest && result == null)) {
          localStorage.clear();
          this.activeCartId = result;
          console.log('Storage----' + JSON.stringify(localStorage));
          console.log('this.activeCartId1112----' + this.activeCartId);
        }
      })
      .catch(error => {
        this.wiredCartError = error;
        console.log('guesterror--' + JSON.stringify(error));
      });
  }

  //Adding products to cart
  addCartItem() {
    addItemCart({ CommunityId: communityId, prodIds: this.prodList, quantityVal: this.quantityVal, userid: userid, cartid: this.activeCartId })
      .then(res => {
        setTimeout(() => {
          this.spinnerloader = false;
          this.showCartOptions = true
        }, 0)
        console.log('this.showCartOptions --> ', this.showCartOptions);
        console.log('updateData1 --> ', JSON.stringify(res));
      })
      .catch(error => {
        // TODO Error handling
        console.log('error --> ', error);
      });
  }
}