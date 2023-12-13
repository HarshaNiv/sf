public class testing {
    @AuraEnabled (cacheable=true) 
    public static list<account> project1(string accname) { 
        String key = '%' + accname + '%';
         list<account> acc= [select id,Name from account where Name like : key limit 5]; 
         return acc; 
    }
}