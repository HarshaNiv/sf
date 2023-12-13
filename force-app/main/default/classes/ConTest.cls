public class ConTest {
    
    @Auraenabled
    public static list<account> account1(){
        list<account> acc1 =[select id,name,(select id,name from contacts) from account];
            list<contact> con = new list<contact>();
        for(account acc :acc1){
            con = acc.contacts;
           // con.addAll(con1);
        }
        list<contact> att =[select id,name,(SELECT Id, Name FROM Attachments), (SELECT Id, Title FROM Notes) from contact 
 where Id in:con];   
        return acc1;
    }
    
}