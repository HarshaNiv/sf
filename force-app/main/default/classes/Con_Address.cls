public class Con_Address {
 @Auraenabled
    Public static void pointaddress(string fname,string lname,string addresstype,
                                    string accid,boolean isdefault,string country,string city,
                                   string state,string postalcode,string phonenum,string companyname,string address){
                                       
   //user userdetails =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =: userId];
       //  system.debug('accId'+userdetails.AccountId);                                     
       ContactPointAddress con = new ContactPointAddress();
        con.AddressFirstName=fname;
        con.AddressLastName=lname;
        con.Name= fname +''+ lname;                               
        con.AddressType=addresstype;
        con.ParentId=accid;
         con.IsDefault=isdefault;
        con.Country=country;
        con.City=city;
        con.State=state;
        con.PostalCode=postalcode;
        con.PhoneNumber=phonenum;
        con.CompanyName=companyname;
        con.Street=address;
        insert con;
          system.debug(con);                             
    } 
    
}