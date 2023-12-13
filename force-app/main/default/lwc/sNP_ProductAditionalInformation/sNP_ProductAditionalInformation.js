/**
 * 
*@description       : Product Features, Applications, Specifications, Alternative Identifiers , and Downloads.
*@author            : Krishnamurthy Donta
*@class             :SNP_ProductAddInfo_controller and SNP_ProductAddInfo_Helper
*@last modified on  : 07-05-2023
*@last modified by  : 
 */
import { LightningElement, track ,api, wire } from 'lwc';
import getProductAdditionalInformation from '@salesforce/apex/SNP_ProductAddInfo_controller.getProductAdditionalInformation';
import getProductSpecifications from '@salesforce/apex/SNP_ProductAddInfo_controller.getProductSpecifications';
import checkDocumentsOfProduct from '@salesforce/apex/SNP_ProductAddInfo_controller.checkDocumentsOfProduct';
import getAlternativeIdentifiers from '@salesforce/apex/SNP_ProductAddInfo_controller.getAlternativeIdentifiers';
import communityId from '@salesforce/community/Id';
// import AddSymbol from '@salesforce/resourceUrl/AddSymbol';
// import MinusSymbol from '@salesforce/resourceUrl/MinusSymbol';
// import ZeroSymbol from '@salesforce/resourceUrl/ZeroSymbol';

//need to uplode the Plus & Minus svg files in the static resource
// import minus from'@salesforce/resourceUrl/minus';
// import plus from'@salesforce/resourceUrl/plus';

//slot
 /**
  *@slot Downloadcontant
*/

export default class SNP_ProductAditionalInformation extends LightningElement {

    // AddSym = AddSymbol;
    // MinusSym = MinusSymbol;
    // ZeroSym =ZeroSymbol;
    // plusIcon = plus;
    // minusIcon = minus;
    featureShowHideContent = false;
    ApplicationShowHideContent = false;
    SpecificationShowHideContent = false;
    DownloadShowHideContent = false;
    AlternativeIdentifiersContent = false;
    
    //Features, Applications, Specifications
    FeaturesData;
    ApplicationsData;
    SpecificationsData;
    specificDataProduct;

    //Features ,Applications in points wise
    FeaturesDataPoints = [];
    ApplicationsDataPoints = [];

    //for geting the current product id dynamivally from the pdp 
    @api recordId;

    //Show or hide the Feature,Appliction,Specification and DownLoad
    ShowFeatureWrapper = false;
    ShowApplictionWrapper = false;
    ShowSpecificationWrapper = false;
    ShowDownLoadWrapper = false;
    ShowAlternativeIdentifiersWrapper = false;

    //using list for specifications and Alternative Identifiers
    SpecificationDataList = [];
    AlternativeIdentifiersDataList = [];


    renderedCallback(){
        console.log('pdp record page-r-------->'+this.recordId);
    }

    //Get Alternative Identifiers data of product
    @wire(getAlternativeIdentifiers, { productId: '$recordId' })
    getAlternativeIden({ error, data }){
        if(error){
            console.log('getAlternativeIdentifiers ----->',error);
        }else if(data){
            console.log('getAlternativeIdentifiers ------->', data);
          
            this.AlternativeIdentifiersDataList
            console.log('AlternativeIdentifiersDataPoints ------------>',this.AlternativeIdentifiersDataList);
            console.log('AlternativeIdentifiersDataPoints ------------>',JSON.stringify(this.AlternativeIdentifiersDataList));
            for (let field in data) {
                if (field.endsWith('__c') && data[field] !== 'None') {
                    // Remove the '__c' from the field name and replace '_' with ' '
                    let modifiedField = field.replace('__c', '').replace(/_/g, ' ');
                    this.AlternativeIdentifiersDataList.push({ field: modifiedField, value: data[field] });
                }
            }
            console.log('AlternativeIdentifiersDataList->>>>>>>>>>>>>>>>>>>>>>>.' + JSON.stringify(this.AlternativeIdentifiersDataList))
            console.log('AlternativeIdentifiersDataList->>>>>>>>>>>>>>>>>>>>>>>.' + this.AlternativeIdentifiersDataList)
            if(this.AlternativeIdentifiersDataList.length > 0){
                this.ShowAlternativeIdentifiersWrapper = true;
            }else{
                this.ShowAlternativeIdentifiersWrapper = false;
            }
        }
        else {
            console.log('AlternativeIdentifiersDataList');
            this.ShowAlternativeIdentifiersWrapper = false;

        }
    }

    // Get the Features Data and Applications Data from DataBase
    @wire(getProductAdditionalInformation, { productId: '$recordId' })
    getProductFAS({ error, data }) {
        console.log('pdp record page-f-------->'+this.recordId);
        console.log('Applications 1---------->',this.ShowApplictionWrapper);
        console.log('features 1---------->',this.ShowFeatureWrapper);
        console.log("data------------->",data);
        if (error) {
            console.log('productInfo Error- krishnamurthy donta------------>', error);
        } else if (data) {
            console.log('data working ------------->',data);
            this.FeaturesData = data.Features__c;
            this.FeaturesDataPoints = this.pointsWithIndex(this.FeaturesData);
            console.log('Featuresdatapoint ------------------>',this.FeaturesDataPoints);
            if(this.FeaturesDataPoints != -1){
                this.ShowFeatureWrapper = true;
                console.log('features 1----------> true',this.ShowFeatureWrapper);
            }else {
                this.ShowFeatureWrapper = false;
                console.log('features 1----------> false',this.ShowFeatureWrapper);
            }
            console.log(this.FeaturesDataPoints);
            this.ApplicationsData = data.Applications__c;
            this.ApplicationsDataPoints = this.pointsWithIndex(this.ApplicationsData);
            console.log('applications ----------->',this.ApplicationsDataPoints);
            if(this.ApplicationsDataPoints != -1){
                this.ShowApplictionWrapper = true;
                console.log('Applications 1----------> true',this.ShowApplictionWrapper);

            }else{
                this.ShowApplictionWrapper = false;
                console.log('Applications 1----------> false',this.ShowApplictionWrapper);
            }
        }
    } 

    //method for checking if the documents are availabel or not for the product
    @wire(checkDocumentsOfProduct, { currentCommunityId :communityId, productId: '$recordId' })
    getProductDocument({ error, data }) {
        console.log('pdp record page-c-------->'+ this.recordId);
        console.log('I am fasle'+error);
        console.log('I am true' +data);
        if (error) {
            console.log('I am running Error');
            console.log('productInfo Error- ', error);
        } else if (data) {
            console.log('I am running data');
             console.log('product Document checking------>'+ data);
             if (data){
                this.ShowDownLoadWrapper = true;
                console.log('i am making true one');
             }
        }else{
            this.ShowDownLoadWrapper = false;
            console.log('i am making true one 3');
        }
    } 

    //Method for geting specifications of the product
    @wire(getProductSpecifications, { productId: '$recordId' })
        getProductSpecification({ error, data }) {
            console.log('pdp record page-s-------->'+this.recordId);
            console.log('pdp record page-s-------->', data);
            console.log('pdp record page-s-------->', error);
       if (error) {
            console.log('productInfo Error- ', JSON.stringify(error));
        } else if (data) {
            this.SpecificationDataList = [];
            //data is availabel then show the Specification section is visibel.

            console.log('specifications->>>>>>>>>>>>>>>>>>>>>>>.' + JSON.stringify(data));

            
            //for list
            for (let field in data) {
                if (field.endsWith('__c') && data[field] !== 'None') {
                    // Remove the '__c' from the field name and replace '_' with ' '
                    let modifiedField = field.replace('__c', '').replace(/_/g, ' ');
                    this.SpecificationDataList.push({ field: modifiedField, value: data[field] });
                }
            }
            console.log('SpecificationDataList->>>>>>>>>>>>>>>>>>>>>>>.' + JSON.stringify(this.SpecificationDataList));
            console.log(this.SpecificationDataList > 0);
            if (this.SpecificationDataList.length > 0) {
                this.ShowSpecificationWrapper = true;
            }else{
                this.ShowSpecificationWrapper = false;
            }
        }
        else
        {
            //data is not availabel then the Specification section is invisibel.
            this.ShowSpecificationWrapper = false;
        }
   }

    //Remove the Li and ui tags for Features and Applications
    pointsWithIndex(inputString) {
        console.log('pointing start-------->',inputString);
        if(inputString == undefined){
            return -1;
        }else{
        // Remove the <ul> and </ul> tags from the input string
        let ulRemoved = inputString.replace('<ul>', '').replace('</ul>', '');
    
        // Split the string into individual points based on the <li> tag
        let points = ulRemoved.split('<li>');
    
        // Remove the empty element at the beginning of the array
        points.shift();
    
        // Create a new list to store points without the index
        let pointsWithoutIndex = [];
    
        // Loop through each point and remove the index
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
    
            // Find the index of the closing </li> tag
            const endIndex = point.indexOf('</li>');
    
            // Extract the text between <li> and </li> to remove the index
            const pointText = point.substring(0, endIndex);
    
            // Trim any leading/trailing spaces and push the cleaned up point to the list
            pointsWithoutIndex.push(pointText.trim());
        }
        console.log(pointsWithoutIndex);
        return pointsWithoutIndex;
        }
        }

    //Features controller show/hide
    showHideControllerFeatures(){
        this.featureShowHideContent = !this.featureShowHideContent;
        this.ApplicationShowHideContent = false;
        this.SpecificationShowHideContent = false;
        this.DownloadShowHideContent = false;
        this.AlternativeIdentifiersContent = false;
        console.log(this.recordId);
    }

     //Application controller show/hide
    showHideControllerApplication(){
        this.ApplicationShowHideContent = !this.ApplicationShowHideContent;
        this.featureShowHideContent = false;
        this.SpecificationShowHideContent = false;
        this.DownloadShowHideContent = false;
        this.AlternativeIdentifiersContent = false;
    }
    
    //Specification controller show/hide
    showHideControllerSpecification(){
        this.SpecificationShowHideContent = !this.SpecificationShowHideContent;
        this.ApplicationShowHideContent = false;
        this.featureShowHideContent = false; 
        this.DownloadShowHideContent = false;
        this.AlternativeIdentifiersContent = false;
    }


    //Download controller show/hide
    showHideControllerDownload(){
        this.DownloadShowHideContent = !this.DownloadShowHideContent;
        this.SpecificationShowHideContent = false;
        this.ApplicationShowHideContent = false;
        this.featureShowHideContent = false;
        this.AlternativeIdentifiersContent = false;
    }

    //Alternative Identifiers show/hide 
    showHideControllerAlternativeIdentifiers(){
        this.AlternativeIdentifiersContent = !this.AlternativeIdentifiersContent
        this.SpecificationShowHideContent = false;
        this.ApplicationShowHideContent = false;
        this.featureShowHideContent = false;
        this.DownloadShowHideContent = false;

    }

}