@istest
private class Projectrec_Test {
    @testsetup
    private static void testdata(){
        list<Project__c> finallist = new list<Project__c>();
       Project__c pro = new Project__c();
        pro.name ='samplepro';
        pro.Total_no_of_Completed_Tasks__c = 01;
        pro.Total_no_of_Tasks__c = 2;
        pro.Total_no_of_Pending_Tasks__c=1;
        
        Project__c pro1 = new Project__c();
        pro1.Name = 'samplepro1';
        pro1.Total_no_of_Tasks__c = 4;
        pro1.Total_no_of_Pending_Tasks__c = 2;
        pro1.Total_no_of_Completed_Tasks__c = 2;
        
        finallist.add(pro);
        finallist.add(pro1);
        insert finallist;
    }
    
    @istest
    private static void display(){
        Projectrec.fieldsdisplay();
        list<Project__c> prolist = [select id,Name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c from Project__c];
        system.assertEquals(2,prolist.size());
    }
     @istest
    private static void insertfields(){
         date startdate =Date.parse('01/25/2023');
        date enddate = Date.parse('01/26/2023');
        Projectrec.insertfields('sampletask','insert task',startdate,enddate);
        list<Tasks__c> inserttask = [select id,name,Completed__c,Project__c,Start_Date__c,End_Date__c from Tasks__c];
        for(Tasks__c ta : inserttask){
        system.assertEquals(enddate,ta.End_Date__c);
        }
    }

}