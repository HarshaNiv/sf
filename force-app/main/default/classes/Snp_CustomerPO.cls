public class Snp_CustomerPO {
    @Auraenabled(cacheable=true)
    public static list<Opportunity> PoNumber(){
      list<Opportunity> oppList=  [SELECT Id, Name FROM Opportunity];
        /*id accid =[SELECT id,AccountId from USER where id=:userid].AccountId;
        Account acc=[SELECT Id, Customer_PO__c, Name FROM Account where id=: accid];*/
        return oppList;
    }
}