public class SNP_Addresses {
    
    @Auraenabled(cacheable=true)
    public static  list<ContactPointAddress> contactpoint(string userid,string addtype){
         id userdetails =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =: userid].AccountId;
        // id userid=[select AccountId,id from account where id:=userid]
        
         list<ContactPointAddress> addresslist=[SELECT Id, AddressFirstName,ParentId, AddressLastName, Name,AddressType, City, State, CountryCode, StateCode,
                                               Country, PostalCode,IsDefault,CompanyName,PhoneNumber,Street FROM ContactPointAddress where ParentId =:userdetails and AddressType =:addtype ORDER BY IsDefault DESC];
            
            return addresslist;
        
    }
    @Auraenabled
    Public static string getid(string recordid){
        ContactPointAddress useraddress =[SELECT Id FROM ContactPointAddress where Id =:recordid];
        if(useraddress != null){
            delete useraddress;
            return 'record deleted successfully';
        }
        else{
            return'no records found';
        }
    }
}