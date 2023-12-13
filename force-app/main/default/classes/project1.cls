public with sharing class project1 {
     public static list<account> project1(string accname) { 
         String key = '%' + accname + '%';
         list<account> acc= [select id,Name from account where Name like : key limit 5]; 
         return acc; 
     }
    @AuraEnabled
    public static list<account> project1() { 
         list<account> acc =[Select  Name,Industry,Type,Phone FROM Account];
         return acc;
    }
}