import { LightningElement, api, track ,wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import communityId from '@salesforce/community/Id';
import getOrderSummaryLineItems from '@salesforce/apex/SNP_SageIdController.getOrderSummaryLineItem';
import createOrder from '@salesforce/apex/SNP_ReorderController.createOrderToCart';
import basePath from '@salesforce/community/basePath';
import {RefreshEvent} from 'lightning/refresh';

export default class SnpOrderHistoryComp extends NavigationMixin(LightningElement) {
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
   viewCartModal = false;
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
   limitVal=25;
   noOrdersForView=false;
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

    handleOrder(formatStartDate,formatEndDate,sequence,offset,limit){
        getOrderSummaryLineItems({ userId: Id, startDate: formatStartDate , endDate: formatEndDate ,sequenceOrder: sequence, OffSetVal:offset, limitValue:limit })
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
              //this.sortBasedOnSequenceOrder();
              if(this.limitVal <= this.orderSummarySize ){
                this.showMoreButtonVisiblity = false;
              } else {
                this.showMoreButtonVisiblity = true;
              }
              this.orderSummarySize = this.orderSummaryList.length;
              this.sageId = this.orderSummaryResult.sageId;
              console.log("After Concate all the data",this.orderSummaryList);
              console.log("NOW offset val", this.offSetVal);
          } else {
              this.offSetVal -= this.limitVal;
              this.showMoreButtonVisiblity = false;
              this.showMoreBtnLoader =false;
              this.showNoMoreOrders = true;
              setTimeout(()=>{
                  this.showNoMoreOrders = false;
              },1000);
              //this.offSetVal-=this.limitVal;
          }

          if(this.orderSummaryList.length <= 0){
            this.noOrdersForView = true;
            console.log("showinf or not ", this.orderSummarySize,this.noOrdersForView);
        } else {
            this.noOrdersForView = false;
            console.log("showinf or not ", this.orderSummarySize,this.noOrdersForView);
        }
        if(this.orderSummaryList.length < this.limitVal){
            this.showMoreButtonVisiblity = false;
        }
          console.log("After Concate all out the data",this.orderSummaryList);
          this.showLoader = false;
          this.showMoreBtnLoader  = false;

        })
        .catch((error) => {
          this.error = error;
        });
    }

    // handleFetchOrderSummary() {
    //     getOrderSummaryLineItems({ userId: Id, startDate: this.formattedStartDate , endDate: this.formattedEndDate ,sequenceOrder: this.sequenceOrder, OffSetVal:this.offSetVal })
    //       .then((result) => {
    //          // alert(JSON.stringify(result));
    //         this.orderSummaryResult = JSON.parse(JSON.stringify(result));
    //         console.log('Order summary data -- ', JSON.stringify(this.orderSummaryResult));
    //         this.orderSummaryResult.orderSumm.forEach((ele)=>{
    //           if(ele.CurrencyIsoCode === 'USD'){
    //               ele.GrandTotalAmount = `\u0024${ele.GrandTotalAmount }`;
    //           }else if(ele.CurrencyIsoCode === 'GBP'){
    //               ele.GrandTotalAmount = `\u00A3${ele.GrandTotalAmount }`;
    //           } else{
    //               ele.GrandTotalAmount = `\u20AC${ele.GrandTotalAmount }`;
    //           }
    //         });
    //         if(this.orderSummaryResult.orderSumm.length > 0){
    //             this.orderSummaryList = this.orderSummaryList.concat(this.orderSummaryResult.orderSumm);
    //             //this.sortBasedOnSequenceOrder();
    //             this.orderSummarySize = this.orderSummaryList.length;
    //             this.sageId = this.orderSummaryResult.sageId;
    //             console.log("After Concate all the data",this.orderSummaryList);
    //             console.log("NOW offset val", this.offSetVal);
    //         } else {
    //             this.offSetVal -=this.limitVal;
    //             this.showMoreButtonVisiblity = false;
    //             this.showMoreBtnLoader =false;
    //             this.showNoMoreOrders = true;
    //             setTimeout(()=>{
    //                 this.showNoMoreOrders = false;
    //             },1000);
    //         }
    //         console.log("After Concate all out the data",this.orderSummaryList);
    //         this.showLoader = false;
    //         this.showMoreBtnLoader  = false;
    //       })
    //       .catch((error) => {
    //         this.error = error;
    //       });
    //   }


    //   handleInitialFetchOrderSummary() {
    //     let initialOffsetVal = 0;
    //     this.offSetVal=0;
    //     console.log("INITIAL START DATE", this.formattedStartDate);
    //     console.log("INITIAL END DATE", this.formattedEndDate);

    //     getOrderSummaryLineItems({ userId: Id, startDate: this.formattedStartDate , endDate: this.formattedEndDate ,sequenceOrder: this.sequenceOrder, OffSetVal: initialOffsetVal })
    //       .then((result) => {
    //          // alert(JSON.stringify(result));
    //         this.orderSummaryResult = JSON.parse(JSON.stringify(result));
    //         console.log('Order summary data -- ', JSON.stringify(this.orderSummaryResult));
    //         this.orderSummaryResult.orderSumm.forEach((ele)=>{
    //           if(ele.CurrencyIsoCode === 'USD'){
    //               ele.GrandTotalAmount = `\u0024${ele.GrandTotalAmount }`;
    //           }else if(ele.CurrencyIsoCode === 'GBP'){
    //               ele.GrandTotalAmount = `\u00A3${ele.GrandTotalAmount }`;
    //           } else{
    //               ele.GrandTotalAmount = `\u20AC${ele.GrandTotalAmount }`;
    //           }
    //         });
    //             this.orderSummaryList = this.orderSummaryResult.orderSumm;
    //             this.orderSummarySize = this.orderSummaryList.length;
    //             this.sageId = this.orderSummaryResult.sageId;
    //             console.log("RUN ADITYA CONNECTED CALLBACK CALL");
    //             console.log("After Concate all the data",this.orderSummaryList);
    //             // this.showMoreButtonVisiblity = false;
    //             // this.showMoreBtnLoader =false;
    //             // this.showNoMoreOrders = true;
    //             // setTimeout(()=>{
    //             //     this.showNoMoreOrders = false;
    //             // },1000);
    //         console.log("After Concate all out the data",this.orderSummaryList);
    //         //this.sortBasedOnSequenceOrder();
    //         this.showLoader = false;
    //         this.showMoreButtonVisiblity=true;
    //         //this.showMoreBtnLoader  = false;
    //       })
    //       .catch((error) => {
    //         this.error = error;
    //       });
    //   }
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
        debugger;
        const millisecondsInADay = 86_399_000;
        this.formattedStartDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.startDate));
        this.formattedEndDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.endDate)+millisecondsInADay);
        console.log("fetch call start --> ",this.formattedStartDate);
        console.log("fetch call End--> ",this.formattedEndDate);
       // this.handleInitialFetchOrderSummary();
      this.orderSummaryList=[];
      this.orderSummarySize = this.orderSummaryList.length;
      this.offSetVal=0;
       this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,this.offSetVal,this.limitVal);
       this.offSetVal += this.limitVal;
       this.showMoreButtonVisiblity = true;
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
        this.sequenceOrder='DESC';
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
        const millisecondsInADay = 86_399_000;
        this.initializeDateCalendar();
        this.formattedStartDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.startDate));
        this.formattedEndDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.endDate)+millisecondsInADay);
        console.log("formatted start date", this.formattedStartDate);
        console.log("formatted end date", this.formattedEndDate);
        //this.handleInitialFetchOrderSummary();
        this.offSetVal =0;
        this.orderSummaryList=[];
        // Set the flag when component is initially loaded
        sessionStorage.setItem('navigatedToMyComponent', 'true');
        //this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,this.offSetVal,this.limitVal);
        //this.offSetVal += this.limitVal;
        console.log('Connected CAllback IS CALL O');
        //handleReload();

        // let startDate = this.template.querySelector('input[type="date"].start-date');
        // let endDate = this.template.querySelector('input[type="date"].end-date');
        // console.log("connected call back - start date",this.startDate);
        // console.log("connected call back - end date",this.endDate);
        // startDate.value = startIntialDateValue;
        // endDate.value = endInitialDateValue;

    }
    disconnectedCallback() {
        // Clear the flag when navigating away from the component
        sessionStorage.removeItem('navigatedToMyComponent');
    }

    renderedCallback() {
        if (!sessionStorage.getItem('navigatedToMyComponent')) {
            // Reload the page
            window.location.reload();
        }
        console.log('RERENDER IS CALL O',sessionStorage.getItem('navigatedToMyComponent'));
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
           let temparray=[];
            this.orderSummaryList = temparray;
           targetApplyButton.click();
           console.log('RERENDER IS CALL 1');
        }
        this.dispatchEvent(new RefreshEvent());
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
        debugger;
        if(this.selectedLabel === "Sort items by oldest order"){
            // const sortedAscending = [...this.orderSummaryList].sort((a, b) => {
            //     return new Date(a.OrderedDate) - new Date(b.OrderedDate);
            // });

            // this.orderSummaryList = [...sortedAscending];

            this.sequenceOrder='ASC';
            if(this.orderSummaryList.length === this.limitVal){
                this.orderSummaryList = [];
                //this.handleInitialFetchOrderSummary();
                this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,0,this.limitVal);
            } else {
            this.orderSummaryList = [];
            console.log("Beofre ASC",this.offSetVal);
            let count = this.offSetVal /this.limitVal;
           // this.offSetVal =0;
            // for(let i=0;i<count;i++){
            //     console.log("handle fetch order summary call",i);
            //     //this.handleFetchOrderSummary();
            //     this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,this.offSetVal,this.limitVal);
            //     this.offSetVal+=this.limitVal;
            // }
            this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,0,this.offSetVal);
            //this.offSetVal-=this.limitVal;
            console.log("After ASC",this.offSetVal);
        }

        } else {
            // const sortedDescending = [...this.orderSummaryList].sort((a, b) => {
            //     return new Date(b.OrderedDate) - new Date(a.OrderedDate);
            // });
            // this.orderSummaryList = [...sortedDescending];

            this.sequenceOrder='DESC';
            if(this.orderSummaryList.length === this.limitVal){
                this.orderSummaryList = [];
               // this.handleInitialFetchOrderSummary();
               this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,0,this.limitVal);
            } else {
                this.orderSummaryList=[];
                console.log("Beofre ASC",this.offSetVal);
                let count = this.offSetVal /this.limitVal;
               // this.offSetVal =0;
                // for(let i=0;i<count;i++){
                //     console.log("handle fetch order summary call",i);
                //     this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,this.offSetVal,this.limitVal);
                //     this.offSetVal+=this.limitVal;
                // }
                this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,0,this.offSetVal);
                //this.offSetVal-=this.limitVal;
                console.log("After ASC",this.offSetVal);
            }

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
        this.viewCartModal = true;
    })
    .catch(error => {
        // TODO Error handling
        console.log('Error'+JSON.stringify(error));
    });
        this.orderSummid =event.currentTarget.dataset.reorder;
    }
    closeModal(event){
        this.openModal = false;
        setTimeout(()=>{window.location.reload(true);},500);
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
        this.viewCartModal = false;
    }

    showMoreLoader(event){
        this.showMoreBtnLoader = !this.showMoreBtnLoader;
        const millisecondsInADay = 86_399_000;
        this.formattedStartDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.startDate));
        this.formattedEndDate = this.converDateToIsoFormat(this.convertDateToMilliSeconds(this.endDate)+millisecondsInADay);
        console.log(" show more btn formatted start date", this.formattedStartDate);
        console.log("show more btn formatted end date", this.formattedEndDate);
        //this.handleInitialFetchOrderSummary();
        console.log("show more loader offset vale before", this.offSetVal);
        this.handleOrder(this.formattedStartDate,this.formattedEndDate,this.sequenceOrder,this.offSetVal,this.limitVal);
        this.offSetVal+=this.limitVal;
        console.log("show more loader offset vale after", this.offSetVal);
        //this.handleFetchOrderSummary();

    }

    redirectToViewDeatils(event){
        this.handleViewDetails(event);
    }

    continueShopping(event){
        this.closeModal(event);
        setTimeout(()=>{window.location.reload(true);},500);
    }

    pageLoadRefresh(){
            this[NavigationMixin.GenerateUrl]({
                type: 'standard__webPage',
                attributes: {
                    url: ''
                }
            }).then(url => {
                let currentUrl = window.location.href;
                window.open(`${currentUrl}`, "_self");
            });
    }

    handleReload() {
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c-snp-order-history-comp' // Use your component name here
            }
        });
        console.log("HARD RELOAD");
    }


}