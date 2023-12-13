import { LightningElement, api, track ,wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import communityId from '@salesforce/community/Id';
import getOrderSummaryLineItems from '@salesforce/apex/SNP_SageIdController.getOrderSummaryLineItem';
import createOrder from '@salesforce/apex/SNP_ReorderController.createOrderToCart';
import basePath from '@salesforce/community/basePath';
export default class TestMutationObserverComp extends NavigationMixin(LightningElement) {
   @api accountId;
   showLoader=false;
   orderSummaryList=[];
   error;
   orderSummarySize="";
   startDate='2017-06-01';
   endDate='2017-06-01';
   startFilterDate="";
   endFilterDate="";
   openModal=false;
   @track orderSummid="0";
   sequenceOrder='DESC';
   showMoreBtnLoader=false;
   offSetVal=0;
   formattedStartDate;
   formattedEndDate;
   orderSummaryResult;
   showNoMoreOrders=false;
   showMoreButtonVisiblity=true;
   sageId;
   startReorderProcess= true;
   @track selectedLabel = 'Sort items by most recent order';
   eventAttach = 0;
   sortOrderBasedOnFilters = ["Show Older Order First", 'Show New Order First'];

   constructor() {
    super();
    // Attach event listener to document in the constructor
    document.addEventListener('click', this.handleDocumentClick.bind(this));
   }
   //formattedStartDate="";
   //formattedEndDate="";

//    get getInitialStartDate(){
//     const currentTimestamp = Date.now();
//     const millisecondsInOneYear = 365 * 24 * 60 * 60 * 1000;
//     const oneYearAgoTimestamp = currentTimestamp - millisecondsInOneYear;
//     let startIntialDateValue= new Date(oneYearAgoTimestamp).toLocaleDateString();
//     return startIntialDateValue;
//    }

//    get getInitialEndDate(){
//     const currentTimestamp = Date.now();
//     let  endInitialDateValue  = new Date(currentTimestamp).toLocaleDateString();
//     return startIntialDateValue;
//    }

   

    // orderSummaryList = [
    //     {
    //         orderSummaryNumber: "QD5UW-RLLHN-2UT5G-LTETZ",
    //         orderDate: "9/19/2023, 05:36 PM",
    //         orderStatus: "Created",
    //         orderTotal: "$840.60",
    //         sageId: "P106"
    //     },
    //     {
    //         orderSummaryNumber: "QD5UW-RLLHN-2UT5G-LTETZ",
    //         orderDate: "9/19/2023, 05:36 PM",
    //         orderStatus: "Created",
    //         orderTotal: "$840.60",
    //         sageId: "P106"
    //     },
    //     {
    //         orderSummaryNumber: "QD5UW-RLLHN-2UT5G-LTETZ",
    //         orderDate: "9/19/2023, 05:36 PM",
    //         orderStatus: "Created",
    //         orderTotal: "$840.60",
    //         sageId: "P106"
    //     },
    //     {
    //         orderSummaryNumber: "QD5UW-RLLHN-2UT5G-LTETZ",
    //         orderDate: "9/19/2023, 05:36 PM",
    //         orderStatus: "Created",
    //         orderTotal: "$840.60",
    //         sageId: "P106"
    //     },
    //     {
    //         orderSummaryNumber: "QD5UW-RLLHN-2UT5G-LTETZ",
    //         orderDate: "9/19/2023, 05:36 PM",
    //         orderStatus: "Created",
    //         orderTotal: "$840.60",
    //         sageId: "P106"
    //     }
    // ];

    handleFetchOrderSummary() {
        getOrderSummaryLineItems({ userId: Id, startDate: this.formattedStartDate , endDate: this.formattedEndDate ,sequenceOrder: this.sequenceOrder, OffSetVal:this.offSetVal })
          .then((result) => {
             // alert(JSON.stringify(result));
            this.orderSummaryResult = JSON.parse(JSON.stringify(result));
            console.log('Order summary data -- ', JSON.stringify(this.orderSummaryResult));
            this.orderSummaryResult.orderSumm.forEach((ele)=>{
              if(ele.CurrencyIsoCode === 'USD'){
                  ele.GrandTotalAmount = `\u0024${ele.GrandTotalAmount }`;
              }else if(ele.CurrencyIsoCode === 'GBP'){
                  ele.GrandTotalAmount = `\u00A3${ele.GrandTotalAmount }`;
              } else{
                  ele.GrandTotalAmount = `\u20AC${ele.GrandTotalAmount }`;
              }
            });
            if(this.orderSummaryResult.orderSumm.length > 0){
                this.orderSummaryList = this.orderSummaryList.concat(this.orderSummaryResult.orderSumm);
                this.sortBasedOnSequenceOrder();
                this.orderSummarySize = this.orderSummaryList.length;
                this.sageId = this.orderSummaryResult.sageId;
                console.log("After Concate all the data",this.orderSummaryList);
            } else {
                this.showMoreButtonVisiblity = false;
                this.showMoreBtnLoader =false;
                this.showNoMoreOrders = true;
                setTimeout(()=>{
                    this.showNoMoreOrders = false;
                },1000);
            }
            console.log("After Concate all out the data",this.orderSummaryList);
            this.showLoader = false;
            this.showMoreBtnLoader  = false;
          })
          .catch((error) => {
            this.error = error;
          });
      }


      handleInitialFetchOrderSummary() {
        let initialOffsetVal = 0;
        this.offSetVal=0;
        getOrderSummaryLineItems({ userId: Id, startDate: this.formattedStartDate , endDate: this.formattedEndDate ,sequenceOrder: this.sequenceOrder, OffSetVal: initialOffsetVal })
          .then((result) => {
             // alert(JSON.stringify(result));
            this.orderSummaryResult = JSON.parse(JSON.stringify(result));
            console.log('Order summary data -- ', JSON.stringify(this.orderSummaryResult));
            this.orderSummaryResult.orderSumm.forEach((ele)=>{
              if(ele.CurrencyIsoCode === 'USD'){
                  ele.GrandTotalAmount = `\u0024${ele.GrandTotalAmount }`;
              }else if(ele.CurrencyIsoCode === 'GBP'){
                  ele.GrandTotalAmount = `\u00A3${ele.GrandTotalAmount }`;
              } else{
                  ele.GrandTotalAmount = `\u20AC${ele.GrandTotalAmount }`;
              }
            });
                this.orderSummaryList = this.orderSummaryResult.orderSumm;
                this.orderSummarySize = this.orderSummaryList.length;
                this.sageId = this.orderSummaryResult.sageId;
                console.log("After Concate all the data",this.orderSummaryList);
                // this.showMoreButtonVisiblity = false;
                // this.showMoreBtnLoader =false;
                // this.showNoMoreOrders = true;
                // setTimeout(()=>{
                //     this.showNoMoreOrders = false;
                // },1000);
            console.log("After Concate all out the data",this.orderSummaryList);
            this.sortBasedOnSequenceOrder();
            this.showLoader = false;
            this.showMoreButtonVisiblity=true;
            //this.showMoreBtnLoader  = false;
          })
          .catch((error) => {
            this.error = error;
          });
      }
    // @wire(getOrderSummaryLineItems, )
    // orderSummary({ error, data }) {
    //     if (data) {
    //         // alert(JSON.stringify(data));
    //       this.orderSummaryList = JSON.parse(JSON.stringify(data));
    //       this.orderSummarySize = this.orderSummaryList.orderSumm.length;
    //       console.log('Order summary data -- ', JSON.stringify(this.orderSummaryList));
    //       this.orderSummaryList.orderSumm.forEach((ele)=>{
    //         if(ele.CurrencyIsoCode === 'USD'){
    //             ele.GrandTotalAmount = `\u0024${ele.GrandTotalAmount }`;
    //         }else if(ele.CurrencyIsoCode === 'GBP'){
    //             ele.GrandTotalAmount = `\u00A3${ele.GrandTotalAmount }`;
    //         } else{
    //             ele.GrandTotalAmount = `\u20AC${ele.GrandTotalAmount }`;
    //         }
    //       });
    //     } else if (error) {
    //       this.error = error;
    //     } 

    // }

    initializeDateCalendar(){
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];

        today.setFullYear(today.getFullYear() - 1);
        const beforeYearDate = today.toISOString().split('T')[0];

        this.startDate = beforeYearDate;
        this.endDate =  currentDate;
    }

    fetchOrderSummaryLineItmes(){
        const millisecondsInADay = 86_399_000;
        this.formattedStartDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.startDate));
        this.formattedEndDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.endDate)+millisecondsInADay);
        console.log("fetch call start --> ",this.formattedStartDate);
        console.log("fetch call End--> ",this.formattedEndDate);
        this.handleInitialFetchOrderSummary();
    }

    applyFilterOrders(event){
        this.showLoader=true;
        console.log("apply start date",this.startDate);
        console.log("applyend date",this.endDate);
        this.fetchOrderSummaryLineItmes();
    }

    resetFiterDate(event){
        this.showLoader=true;
        this.showMoreButtonVisiblity=true;
        this.initializeDateCalendar();
        this.fetchOrderSummaryLineItmes();
    }

    handleViewDetails(event){
        let currentIndexClicked = event.target.dataset.id;
        console.log('Index --', currentIndexClicked);
        console.log('Id order summary --', this.orderSummaryList[currentIndexClicked].Id);
        let orderSummaryId = this.orderSummaryList[currentIndexClicked].Id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: orderSummaryId,
                objectApiName: "OrderSummary",
                actionName: 'view'
            }
        });
    }



    connectedCallback(){
        // const currentTimestamp = Date.now();
        // const millisecondsInOneYear = 365 * 24 * 60 * 60 * 1000;
        // const oneYearAgoTimestamp = currentTimestamp - millisecondsInOneYear;
        // let endInitialDateValue  = new Date(currentTimestamp).toLocaleDateString().toString().split("/").reverse().join("/");
        // let  startIntialDateValue = new Date(oneYearAgoTimestamp).toLocaleDateString().toString().split("/").reverse().join("/");
        // this.startDate = startIntialDateValue;
        // this.endDate = endInitialDateValue;
        this.initializeDateCalendar();
        this.formattedStartDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.startDate));
        this.formattedEndDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.endDate));
        console.log("formatted start date", this.formattedStartDate);
        console.log("formatted end date", this.formattedEndDate);
        this.handleInitialFetchOrderSummary();
        // let startDate = this.template.querySelector('input[type="date"].start-date');
        // let endDate = this.template.querySelector('input[type="date"].end-date');
        // console.log("connected call back - start date",this.startDate);
        // console.log("connected call back - end date",this.endDate);
        // startDate.value = startIntialDateValue;
        // endDate.value = endInitialDateValue;
    }

    renderedCallback() {
        if (this.eventAttach === 0) {
            // attach click event to the template 
            // it handle open and close event of dropdown if it click inside own component
            this.template.addEventListener('click', function (event) {
                const target = event.target;
                if (
                    !target.classList.contains('options') &&
                    !target.classList.contains('drop-down-options') &&
                    !target.classList.contains('drop-down-btn') &&
                    !target.classList.contains('drp-label') &&
                    !target.classList.contains('order-history-bottom') &&
                    !target.classList.contains('order-summary-line-item') 
                ) {
                    if (event.target?.querySelector(".drop-down-options")?.classList.contains("displaying")) {
                        event.target?.querySelector(".drop-down-options")?.classList.remove("displaying");
                        let dropDownLabelElement = event.target.querySelector(".drp-label");
                        if (dropDownLabelElement.classList.contains('arrow-up')) {
                            dropDownLabelElement.classList.remove('arrow-up');
                            dropDownLabelElement.classList.add('arrow-down');
                        }
                    } else if(event.target?.shadowRoot?.querySelector(".drop-down-options").classList.contains("displaying")){
                        event.target?.querySelector(".drop-down-options")?.classList.remove("displaying");
                        let dropDownLabelElement = event.target.querySelector(".drp-label");
                        if (dropDownLabelElement.classList.contains('arrow-up')) {
                            dropDownLabelElement.classList.remove('arrow-up');
                            dropDownLabelElement.classList.add('arrow-down');
                        }
                    }


                }
            });
            this.eventAttach = 1;
           let targetApplyButton = this.template.querySelector(".apply-button");
            targetApplyButton.click();
        }
    }

        // add a global click event on document 
    // handle open and close of dropdown when click of outside from the component and other part of whole document
    handleDocumentClick(event) {
        // Handle document click event here
        let currentTargetComponent = event.target;
        let dropDownElement = this.template.querySelector(".drop-down-options");
        let dropDownLabelElement = this.template.querySelector(".drp-label");
        console.log("yes document has clicke event", currentTargetComponent);
        // Check if the click event target is containe dropdown element as its children or not
        console.log("pppppp",currentTargetComponent.classList.contains('navigationCtn'));
        if (!currentTargetComponent?.shadowRoot?.querySelector('.drop-down-options')) {

            // Manipulate the class of the element
            dropDownElement.classList.remove('displaying');
            if (dropDownLabelElement.classList.contains('arrow-up')) {
                dropDownLabelElement.classList.remove('arrow-up');
                dropDownLabelElement.classList.add('arrow-down');
            }
        } 
        if(currentTargetComponent.classList.contains('navigationCtn')){
            // Manipulate the class of the element
            dropDownElement.classList.remove('displaying');
            if (dropDownLabelElement.classList.contains('arrow-up')) {
                dropDownLabelElement.classList.remove('arrow-up');
                dropDownLabelElement.classList.add('arrow-down');
            }
        }

 
        // else if(!currentTargetComponent.closest('.drop-down-options')){
        //     // Manipulate the class of the element
        //     dropDownElement.classList.remove('displaying');
        //     if (dropDownLabelElement.classList.contains('arrow-up')) {
        //         dropDownLabelElement.classList.remove('arrow-up');
        //         dropDownLabelElement.classList.add('arrow-down');
        //     }
        // }
    }

    // handle open and close of the dropdown itself
    btnClickDrop(event) {
        this.template.querySelector(".drop-down-options").classList.toggle("displaying");
        let dropDownLabelElement = this.template.querySelector(".drp-label");
        if (dropDownLabelElement.classList.contains('arrow-up')) {
            dropDownLabelElement.classList.remove('arrow-up');
            dropDownLabelElement.classList.add('arrow-down');
        } else {
            dropDownLabelElement.classList.remove('arrow-down');
            dropDownLabelElement.classList.add('arrow-up');
        }
    }

    // handle open and close of the dropdown after choose the option
    handleOptions(event) {
        let dropDownLabelElement = this.template.querySelector(".drp-label");
        let allDropDownOptionsWrapper = this.template.querySelector(".drop-down-options");

        Array.from(this.template.querySelectorAll(".options")).forEach((ele) => {
            ele.classList.remove("selected");
        });
        event.target.classList.add("selected");
        this.selectedLabel = event.target.innerText;
        this.sortBasedOnSequenceOrder();
       
        allDropDownOptionsWrapper.classList.toggle("displaying");
        if (dropDownLabelElement.classList.contains('arrow-up')) {
            dropDownLabelElement.classList.remove('arrow-up');
            dropDownLabelElement.classList.add('arrow-down');
        }
    }

    sortBasedOnSequenceOrder(){
        if(this.selectedLabel === "Sort items by oldest order"){
            const sortedAscending = [...this.orderSummaryList].sort((a, b) => {
                return new Date(a.OrderedDate) - new Date(b.OrderedDate);
            });

            this.orderSummaryList = [...sortedAscending];
            this.sequenceOrder='ASC';

        } else {
            const sortedDescending = [...this.orderSummaryList].sort((a, b) => {
                return new Date(b.OrderedDate) - new Date(a.OrderedDate);
            });
            this.orderSummaryList = [...sortedDescending];
            this.sequenceOrder='DESC';
        }
    }
    convertDateToMilliSeconds(dateString){
       // const dateString = "2022-09-19"; // Date in "yyyy-MM-dd" format

    // Parse the date string into a Date object
    const dateObject = new Date(dateString);

    // Get the number of milliseconds since January 1, 1970
    const milliseconds = dateObject.getTime();

    return milliseconds;
    

    }

    converDateToIsoFormat(milliseconds){
        const dateObject = new Date(milliseconds);
        const isoDateString = dateObject.toISOString();
        return isoDateString;
    }

    getStartDate(event){
       this.startDate= event.target.value;
       console.log('changed Date Start ',this.startDate);
    }
    getEndDate(event){
        this.endDate = event.target.value;
        console.log('Changed Date End ',this.endDate);
    }

    showModal(event){
        this.openModal=true;
        this.startReorderProcess=true;
        // console.log(event.target.dataset.reorder);
        // let targetLink = this.template.querySelector('.view-cart-linK');
        // targetLink.dataset.reorder = event.target.dataset.reorder;
        let orderSummaryId=event.currentTarget.dataset.reorder;
        console.log("ordrSummary Id", orderSummaryId);
        createOrder({currentCommunityId:communityId,currentOrderSummaryId:orderSummaryId,currentUserId:Id})
    .then(result => {
        console.log('Result'+JSON.stringify(result));
        this.startReorderProcess=false;
        
    })
    .catch(error => {
        // TODO Error handling
        alert('Error'+JSON.stringify(error));
    });
        this.orderSummid =event.currentTarget.dataset.reorder;
       
    }
    closeModal(event){
        this.openModal = false;
    }

    navigateToCartPage(){
        // this[NavigationMixin.Navigate]({
        //       type: 'comm__namedPage',
        //     attributes: {
        //         name: 'Current_Cart'
        //     }
        // });
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: ''
            }
        }).then(url => {
            window.open(`${basePath}/cart`, "_self");
        });

    // this[NavigationMixin.Navigate]({ type: 'standard__webPage', attributes: { url: `${basePath}/cart` } });
    }

    handleOrderToCart(event){
        this.navigateToCartPage();
    }

    showMoreLoader(event){
        this.showMoreBtnLoader = !this.showMoreBtnLoader;
        this.offSetVal+=5;
        this.handleFetchOrderSummary();
    }



}