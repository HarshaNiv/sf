public without sharing class snp_NameOfUserController {
 
    //method for fetching account name of currect user.
    @Auraenabled(cacheable=true)
    public static string UserAccountName(string userId){
        user userdetails =[select ContactId,id  from USER where Id =: userId];
        system.debug('accId'+userdetails.ContactId);

        Contact acc =[SELECT FirstName, LastName, Id FROM Contact where id=:userdetails.ContactId];
        if(acc.FirstName != null && acc.LastName != null){
            return acc.FirstName +' '+acc.LastName;
        }else if(acc.FirstName != null){
            return acc.FirstName;
        }else {
            return acc.LastName;
        }
    }
    
    //method for fetching account name of currect user company.
    @Auraenabled(cacheable=true)
    public static string UserAccountCompany(string userId){
        user userdetails =[select ContactId,id  from USER where Id =: userId];
        system.debug('accId'+userdetails.ContactId);

        Contact acc =[SELECT Id,Company_Name__c FROM Contact where id=:userdetails.ContactId];
        if(acc.Company_Name__c != null){
            return acc.Company_Name__c;
        }else {
            return 'NO';
        }
    }
    
}