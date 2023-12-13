import { LightningElement, track, wire } from 'lwc';
import UserId from '@salesforce/user/Id';
import UserAccountCompany from '@salesforce/apex/snp_NameOfUserController.UserAccountCompany';
 /**
 * @slot userDetailStandard
*/

export default class SNP_userDetails extends LightningElement {
    @track userCompanyName; 
    @track nameAvailabel = false;
    
    //get the user company if exist
    @wire(UserAccountCompany,{
        userId:UserId
     })userDetail({data,error}){
        if(data){
          console.log('UserName---------------->',data);
        //   this.userCompanyName = 'hello';
          if (data != 'NO'){
            this.nameAvailabel = true;
            this.userCompanyName = data;
          }else{
            this.nameAvailabel = false;
          }

        }else if(error){
            console.log('UserName---------------->',error);
        }
     }
}