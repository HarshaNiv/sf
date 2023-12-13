public class snp_address_form_dialNumbers {
    @AuraEnabled
    public static Decimal countryDialCode(string countrylabel){
        Decimal data= [SELECT Id, Label, code__c, CountryDialcode__c,CountryName__c FROM Country_Name_Dial_code__mdt where CountryName__c =: countrylabel ].CountryDialcode__c;
        system.debug('data=>>'+data);
        return data;
        
    }
    @Auraenabled
    Public static void pointaddress(string fname,string lname,string addresstype,
                                    boolean isdefault,string country,string city,
                                    string state,string postalcode,string phonenum,string companyname,string address,string userId)
    {
        id userdetails =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =: userId].AccountId;
        system.debug('accId'+userdetails);                                     
        ContactPointAddress con = new ContactPointAddress();
        con.AddressFirstName=fname;
        con.AddressLastName=lname;
        con.Name= fname +''+ lname;                               
        con.AddressType=addresstype;
        con.ParentId=userdetails;
        con.IsDefault=isdefault;
        con.Country=country;
        con.City=city;
        if(state != '--None--'){
            con.State=state; 
        }
        con.PostalCode=postalcode;
        con.PhoneNumber=phonenum;
        con.CompanyName=companyname;
        con.Street=address;
        insert con;
        system.debug(con);                             
        
    }
    @Auraenabled
    Public static ContactPointAddress editaddress(string formid){
       ContactPointAddress addresslist=[SELECT Id, AddressFirstName,ParentId, AddressLastName, Name,AddressType, City, State, CountryCode, StateCode,
                                       Country, PostalCode,IsDefault,CompanyName,PhoneNumber,Street FROM ContactPointAddress where id=:formid];
            
            return addresslist;
    }
     @Auraenabled
    Public static void Updateaddress(string fname,string lname,string addresstype,
                                    boolean isdefault,string country,string city,
                                    string state,string postalcode,string phonenum,string companyname,string address,string formid)
    {                                     
        ContactPointAddress con = new ContactPointAddress();
        con.Id = formid;
        con.AddressFirstName=fname;
        con.AddressLastName=lname;
        con.Name= fname +''+ lname;                               
        con.AddressType=addresstype;
        con.IsDefault=isdefault;
        con.Country=country;
        con.City=city;
        if(state != '--None--'){
            con.State=state; 
        }
        con.PostalCode=postalcode;
        con.PhoneNumber=phonenum;
        con.CompanyName=companyname;
        con.Street=address;
        Update con;
        system.debug(con);                             
        
    }
    
}