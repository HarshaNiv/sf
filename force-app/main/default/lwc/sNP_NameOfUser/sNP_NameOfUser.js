import { LightningElement,track,wire } from 'lwc';
import UserId from '@salesforce/user/Id';
import UserAccountName from '@salesforce/apex/snp_NameOfUserController.UserAccountName';



export default class SNP_NameOfUser extends LightningElement {
 @track currentUserName = UserId;
 @track UserName;
 connectedCallback(){
    console.log(JSON.stringify(this.currentUserName));
 }
 @wire(UserAccountName,{
    userId:UserId
 })userDetail({data,error}){
    if(data){
      console.log('UserName---------------->',data);
      this.UserName = data;
    }else if(error){
        console.log('UserName---------------->',error);
    }
 }


}