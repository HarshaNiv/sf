/**
 *
*@description       : Iconagraphy
*@author            : Krishnamurthy Donta and Aditya Lenka
*@class             : SNP_ProductAddInfo_controller
*@last modified on  : 06-11-2023
*@last modified by  :
 */
import { LightningElement , track , api , wire } from 'lwc';
import getProductSpecifications from '@salesforce/apex/SNP_ProductAddInfo_controller.getProductSpecifications';
import resourceTest from '@salesforce/resourceUrl/productIconography';


export default class SNP_Product_Iconagarphy extends LightningElement {


    //for geting the current product id dynamivally from the pdp
    @api recordId;

    //using list for specifications
    @track SpecificationDataList = [];

    //show Specification wrapper
    @track ShowSpecificationWrapper = false;

    //current attribute of product to be matched with imag
    attributeOfProduct = [];
    attriburtFunctionValue ;
    Outputs;
    Output_Voltage;
    Output_Current;
    Power;
    Voltage_Adj_Range;
    Current_Adj_Range;
    Constant_Current_Region;
    Inputs;
    Input_Voltage;
    Input_DC_Voltage_Range;
    Input_Current;
    LEDs_Per_Metre;
    Ah;
    Battery_Type;
    Lumens;
    LED_Colour;
    CRI;
    Cut_Point;
    IP_Rating;
    Impact_Protection;
    Lens;
    Beam_Angle;
    Profile;
    UGR;
    Finish;
    Cutting_Measurement;
    Product_Bend;
    LED_Count;
    LED_Chip_Type;
    Product_Length;
    PCB_Width;
    Style;
    Product_Technology;
    Detection_Distance;
    Detection_Range;
    Energy_Rating;
    energyRatingResult;
    IEC_320;
    Plug;
    Polarity;
    Standards;
    Life_Time;
    Warranty;
    Dimensions;
    Function1;
    function1Result;
    //Trust_Message_Icon;
    //Product_Technology;
    formattedObjectDetail={};

    PowerValue;
    LedColourValue;
    IpRatingValue;
    ImpactProtectionValue;
    BeamAngleValue;
    UgrValue;
    EnergyRatingValue;
    LifeTimeValue;
    WarrantyValue;
    //TrustMessageIconValue;
    Product_TechnologyResult;

    p_0_10V_Dimming = resourceTest + '/0-10V Dimming.png';
    p_1_10V_Dimming = resourceTest + '/1-10V Dimming.png';
    p_3_in_1_Dimming = resourceTest + '/3 in 1 Dimming.png';
    p_14_Day_Returns = resourceTest + '/14 Day Returns.png';
    p_A_Plus_Energy_Rating = resourceTest + '/A+ Energy Rating.png';
    p_A_Plus_plus_Energy_Rating = resourceTest + '/A++ Energy Rating.png';
    p_A_Plus_plus_plus_Energy_Rating = resourceTest + '/A+++ Energy Rating.png';
    p_A_Energy_Rating = resourceTest + '/Energy Rating A.svg';
    p_B_Energy_Rating = resourceTest + '/Energy Rating B.svg';
    p_C_Energy_Rating = resourceTest + '/Energy Rating C.svg';
    p_D_Energy_Rating = resourceTest + '/Energy Rating D.svg';
    p_E_Energy_Rating = resourceTest + '/Energy Rating E.svg';
    p_F_Energy_Rating = resourceTest + '/Energy Rating F.svg';
    p_G_Energy_Rating = resourceTest + '/Energy Rating G.svg';
    p_Anti_Glare = resourceTest + '/Anti Glare.png';
    p_Corridor_Function = resourceTest + '/Corridor Function.png';
    p_DALI_Self_Test = resourceTest + '/DALI Self Test.png';
    p_DALI = resourceTest + '/DALI.png';
    p_DALI_2 = resourceTest + '/DALI-2.png';
    p_Daylight_Harvesting = resourceTest + '/Daylight Harvesting.png';
    p_Design_Service = resourceTest + '/Design Service.png';
    p_Diffused_on_Board = resourceTest + '/Diffused on Board.png';
    p_Dimmable = resourceTest + '/Dimmable.png';
    p_Dual_Zone_Microwave_Sensor = resourceTest + '/Dual Zone Microwave Sensor.png';
    p_Dusk_to_Dawn = resourceTest + '/Dusk to Dawn.png';
    p_Emergency_Self_Test = resourceTest + '/Emergency Self Test.png';
    p_Emergency = resourceTest + '/Emergency.png';
    p_EOL = resourceTest + '/EOL.png';
    p_Fast_Delivery = resourceTest + '/Fast Delivery.png';
    p_Flicker_Free = resourceTest + '/Flicker Free.png';
    p_Freezer_Functionality = resourceTest + '/Freezer Functionality.png';
    p_High_Inrush_Current = resourceTest + '/High Inrush Current.png';
    p_IK_Rating = resourceTest + '/IK Rating.png';
    p_In_Development = resourceTest + '/In Development.png';
    p_IP_Rating = resourceTest + '/IP Rating.png';
    p_Low_Profile = resourceTest + '/Low Profile.png';
    p_Low_Temperature = resourceTest + '/Low Temperature.png';
    p_Microwave_Sensor = resourceTest + '/Microwave Sensor.png';
    p_Motion_Sensor = resourceTest + '/Motion Sensor.png';
    p_New = resourceTest + '/New.png';
    p_NRND = resourceTest + '/NRND.png';
    p_On_Site_Survey = resourceTest + '/On Site Survey.png';
    p_PIR = resourceTest + '/PIR.png';
    p_Reviews = resourceTest + '/Reviews.png';
    p_Special_Order_Part = resourceTest + '/Special Order Part.png';
    p_Trade_Account = resourceTest + '/Trade Account.png';
    p_UGR = resourceTest + '/UGR.png';

    
    renderedCallback(){
        console.log("This is my iconorpahy record id",this.recordId);
    }
     //Method for geting specifications of the product
     @wire(getProductSpecifications, { productId: '$recordId' })
     getProductSpecification({ error, data }) {
         console.log('pdp record page-s-------->'+this.recordId);
         console.log('pdp record page-s-Aditya-------->', data);
         console.log('pdp record page-s-------->', error);
    if (error) {
         console.log('productInfo Error- ', JSON.stringify(error));
     } else if (data) {
         this.SpecificationDataList = [];
        console.log("Adityalenka specs",JSON.stringify(data));
        const formattedObject = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const newKey = key.replace(/__c$/, ''); // Remove __c suffix
                formattedObject[newKey] = data[key];
            }
        }

        this.formattedObjectDetail = {...formattedObject};

        console.log("my final formatted object", formattedObject);
        console.log("yes final fomat object oo",this.formattedObjectDetail);
        var keysOfFormattedObject = Object.keys(formattedObject);
        this.Power = keysOfFormattedObject.includes('Power');
        this.LED_Colour = keysOfFormattedObject.includes('LED_Colour');
        this.IP_Rating = keysOfFormattedObject.includes('IP_Rating');
        this.Impact_Protection = keysOfFormattedObject.includes('Impact_Protection');
        this.Beam_Angle = keysOfFormattedObject.includes('Beam_Angle');
        this.UGR = keysOfFormattedObject.includes('UGR');
        this.Energy_Rating = keysOfFormattedObject.includes('Energy_Rating');
        this.Life_Time = keysOfFormattedObject.includes('Life_Time');
        this.Warranty = keysOfFormattedObject.includes('Warranty');
        this.Function1 = keysOfFormattedObject.includes('Function1');
        this.Product_Technology = keysOfFormattedObject.includes('Product_Technology');
        //this.Trust_Message_Icon = keysOfFormattedObject.includes('Trust_Message_Icon');

        this.Outputs = keysOfFormattedObject.includes('Outputs');
        this.Output_Voltage = keysOfFormattedObject.includes('Output_Voltage');
        this.Output_Current = keysOfFormattedObject.includes('Output_Current');
        this.Voltage_Adj_Range = keysOfFormattedObject.includes('Voltage_Adj_Range');
        this.Current_Adj_Range = keysOfFormattedObject.includes('Current_Adj_Range');
        this.Constant_Current_Region = keysOfFormattedObject.includes('Constant_Current_Region');
        this.Inputs = keysOfFormattedObject.includes('Inputs');
        this.Input_Voltage = keysOfFormattedObject.includes('Input_Voltage');
        this.Input_DC_Voltage_Range = keysOfFormattedObject.includes('Input_DC_Voltage_Range');
        this.Input_Current = keysOfFormattedObject.includes('Input_Current');
        this.LEDs_Per_Metre = keysOfFormattedObject.includes('LEDs_Per_Metre');
        this.Ah = keysOfFormattedObject.includes('Ah');
        this.Battery_Type = keysOfFormattedObject.includes('Battery_Type');
        this.Lumens = keysOfFormattedObject.includes('Lumens');
        this.CRI = keysOfFormattedObject.includes('CRI');
        this.Cut_Point = keysOfFormattedObject.includes('Cut_Point');
        this.IP_Rating = keysOfFormattedObject.includes('IP_Rating');
        this.Lens = keysOfFormattedObject.includes('Lens');
        this.Profile = keysOfFormattedObject.includes('Profile');
        this.Finish = keysOfFormattedObject.includes('Finish');
        this.Cutting_Measurement = keysOfFormattedObject.includes('Cutting_Measurement');
        this.Product_Bend = keysOfFormattedObject.includes('Product_Bend');
        this.LED_Count = keysOfFormattedObject.includes('LED_Count');
        this.LED_Chip_Type = keysOfFormattedObject.includes('LED_Chip_Type');
        this.Product_Length = keysOfFormattedObject.includes('Product_Length');
        this.PCB_Width = keysOfFormattedObject.includes('PCB_Width');
        this.Style = keysOfFormattedObject.includes('Style');
        this.Detection_Distance = keysOfFormattedObject.includes('Detection_Distance');
        this.Detection_Range = keysOfFormattedObject.includes('Detection_Range');
        this.IEC_320 = keysOfFormattedObject.includes('IEC_320');
        this.Plug = keysOfFormattedObject.includes('Plug');
        this.Polarity = keysOfFormattedObject.includes('Polarity');
        this.Standards = keysOfFormattedObject.includes('Standards');
        this.Dimensions = keysOfFormattedObject.includes('Dimensions');
        //console.log("result Aditya",this.Beam_Angle);
        
        if(this.Power){
            this.PowerValue = this.formattedObjectDetail['Power'];
        }

        if(this.LED_Colour){
            this.LedColourValue = this.formattedObjectDetail['LED_Colour'];
        }

        if(this.IP_Rating){
            this.IpRatingValue = this.formattedObjectDetail['IP_Rating'];
        }

        if(this.Impact_Protection){
            this.ImpactProtectionValue = this.formattedObjectDetail['Impact_Protection'];
        }

        if(this.Beam_Angle){
            this.BeamAngleValue = this.formattedObjectDetail['Beam_Angle'];
        }

        if(this.UGR){
            this.UgrValue = this.formattedObjectDetail['UGR'];
        }

        if(this.Energy_Rating){
            this.EnergyRatingValue = this.formattedObjectDetail['Energy_Rating'];
        }

        if(this.Life_Time){
            this.LifeTimeValue = this.formattedObjectDetail['Life_Time'];
        }

        if(this.Warranty){
            this.WarrantyValue = this.formattedObjectDetail['Warranty'];
        }

        if(this.Function1){

            if(this.formattedObjectDetail['Function1'] === '0-10V Dimming'){
                this.function1Result = this.p_0_10V_Dimming;
            } else if(this.formattedObjectDetail['Function1'] === '1-10V Dimming') {
                this.function1Result = this.p_1_10V_Dimming;
            } else if(this.formattedObjectDetail['Function1'] === '3 in 1 Dimming') {
                this.function1Result = this.p_3_in_1_Dimming;
            } else if(this.formattedObjectDetail['Function1'] === 'Anti Glare') {
                this.function1Result = this.p_Anti_Glare;
            } else if(this.formattedObjectDetail['Function1'] === 'Corridor Function') {
                this.function1Result = this.p_Corridor_Function;
            } else if(this.formattedObjectDetail['Function1'] === 'DALI Self Test') {
                this.function1Result = this.p_DALI_Self_Test;
            } else if(this.formattedObjectDetail['Function1'] === 'Daylight Harvesting') {
                this.function1Result = this.p_Daylight_Harvesting;
            } else if(this.formattedObjectDetail['Function1'] === 'Diffused on Board') {
                this.function1Result = this.p_Diffused_on_Board;
            } else if(this.formattedObjectDetail['Function1'] === 'Dimmable') {
                this.function1Result = this.p_Dimmable;
            } else if(this.formattedObjectDetail['Function1'] === 'Dual Zone Microwave Sensor') {
                this.function1Result = this.p_Dual_Zone_Microwave_Sensor;
            } else if(this.formattedObjectDetail['Function1'] === 'Dusk to Dawn') {
                this.function1Result = this.p_Dusk_to_Dawn;
            } else if(this.formattedObjectDetail['Function1'] === 'Emergency') {
                this.function1Result = this.p_Emergency;
            } else if(this.formattedObjectDetail['Function1'] === 'Emergency Self Test') {
                this.function1Result = this.p_Emergency_Self_Test;
            } else if(this.formattedObjectDetail['Function1'] === 'Flicker Free') {
                this.function1Result = this.p_Flicker_Free;
            } else if(this.formattedObjectDetail['Function1'] === 'Freezer Functionality') {
                this.function1Result = this.p_Freezer_Functionality;
            } else if(this.formattedObjectDetail['Function1'] === 'High Inrush Current') {
                this.function1Result = this.p_High_Inrush_Current;
            } else if(this.formattedObjectDetail['Function1'] === 'Low Temperature') {
                this.function1Result = this.p_Low_Temperature;
            } else if(this.formattedObjectDetail['Function1'] === 'Microwave Sensor') {
                this.function1Result = this.p_Microwave_Sensor;
            } else if(this.formattedObjectDetail['Function1'] === 'Motion Sensor') {
                this.function1Result = this.p_Motion_Sensor;
            } else if(this.formattedObjectDetail['Function1'] === 'PIR') {
                this.function1Result = this.p_PIR;
            }
        }

        if(this.Energy_Rating) {
            if(this.formattedObjectDetail['Energy_Rating'] === 'A') {
                this.energyRatingResult = this.p_A_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'A+') {
                this.energyRatingResult = this.p_A_Plus_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'A++') {
                this.energyRatingResult = this.p_A_Plus_plus_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'A+++') {
                this.energyRatingResult = this.p_A_Plus_plus_plus_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'B') {
                this.energyRatingResult = this.p_B_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'C') {
                this.energyRatingResult = this.p_C_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'D') {
                this.energyRatingResult = this.p_D_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'E') {
                this.energyRatingResult = this.p_E_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'F') {
                this.energyRatingResult = this.p_F_Energy_Rating;
            } else if(this.formattedObjectDetail['Energy_Rating'] === 'G') {
                this.energyRatingResult = this.p_G_Energy_Rating;
            }
        }

        if(this.Product_Technology) {
            if(this.formattedObjectDetail['Product_Technology'] === 'DALI'){
                this.Product_TechnologyResult = this.p_DALI;
            } else if(this.formattedObjectDetail['Product_Technology'] === 'DALI-2') {
                this.Product_TechnologyResult = this.p_DALI_2;
            }
        }

        // if(this.Trust_Message_Icon){
        //     this.TrustMessageIconValue = this.p_Reviews;
        // }

         //for list
         for (let field in data) {
             if (field.endsWith('__c') && data[field] !== 'None') {
                 // Remove the '__c' from the field name and replace '_' with ' '
                 let modifiedField = field.replace('__c', '').replace(/_/g, ' ');
                 this.SpecificationDataList.push({ field: modifiedField, value: data[field] });
             }
         }
         console.log('SpecificationDataList->>>>>>>>>>>>>>>>>>>>>>>.' + JSON.stringify(this.SpecificationDataList));
         if (this.SpecificationDataList.length > 0) {
             this.attributeOfProduct = [];
            //  get the list of attributes for current product
            for(let i=0 ; i<this.SpecificationDataList.length ; i++){
                console.log(this.SpecificationDataList[i].field);
                //if(this.SpecificationDataList[i].field != 'Function1'){
                    this.attributeOfProduct.push(this.SpecificationDataList[i].field);
                //}
            }
            // for(let i=0 ; i<this.SpecificationDataList.length ; i++){
            //     if(this.SpecificationDataList[i].field == 'Function1'){
            //         this.attriburtFunctionValue = this.SpecificationDataList[i].field;
            //     }
            // }
            console.log('the attributes present in list', this.attributeOfProduct);
         }
     }
    }


}