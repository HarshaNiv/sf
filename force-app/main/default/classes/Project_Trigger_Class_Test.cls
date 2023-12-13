@istest
private class Project_Trigger_Class_Test {
    @testsetup
    private static void testdata(){
        Project__c pro = new Project__c();
        pro.Name = 'testproject';
        pro.Total_no_of_Tasks__c = 0;
        pro.Total_no_of_Pending_Tasks__c = 0;
        pro.Total_no_of_Completed_Tasks__c = 0;
        insert pro;
        
        Project__c pro1 = new Project__c();
        pro1.Name = 'testproject1';
        pro1.Total_no_of_Tasks__c = 0;
        pro1.Total_no_of_Pending_Tasks__c = 0;
        pro1.Total_no_of_Completed_Tasks__c = 0;
        insert pro1;
        
        
        list<Tasks__c> finallist = new list<Tasks__c>();
        Tasks__c t1 = new Tasks__c();
        t1.Completed__c = true;
        t1.Name = 'tasktest';
        t1.Project__c = pro.Id;
        
        Tasks__c t2 = new Tasks__c();
        t2.Completed__c = true;
        t2.Name = 'tasktest1';
        t2.Project__c = pro.Id;
        
        Tasks__c t3 = new Tasks__c();
        t3.Completed__c = false;
        t3.Name = 'tasktest2';
        t3.Project__c = pro.Id;
        
        Tasks__c t4 = new Tasks__c();
        t4.Completed__c = false;
        t4.Name = 'tasktest3';
        t4.Project__c = pro.Id;
         
        Tasks__c t5 = new Tasks__c();
        t5.Completed__c = false; 
        t5.Name = 'tasktest4';
        t5.Project__c = pro.Id;
        
        Tasks__c t6 = new Tasks__c();
        t6.Completed__c = true; 
        t6.Name = 'tasktest5';
        
        finallist.add(t1);
        finallist.add(t2);
        finallist.add(t3);
        finallist.add(t4);
        finallist.add(t5);
        finallist.add(t6);
        insert finallist;

    }
    @istest
    private static void inserttest(){
        list<Tasks__c> t5 = [select id,name,Completed__c,Project__c from Tasks__c where Project__c != null];
        list<Tasks__c> list1;
        list<Tasks__c> list2;
        decimal existingcount;
        decimal count;
        for(Tasks__c t6 : t5){
            list<Tasks__c> finallist1 = new list<Tasks__c>();
            if(t6.Completed__c == true){
                finallist1.add(t6);
                list1 = new list<Tasks__c>{t6};
                    if(existingcount >=1){
                        existingcount = existingcount + list1.size();
                    }
                else{
                    existingcount = list1.size();
                }
            }
            if(t6.Completed__c == false){
                list2 = new list<Tasks__c>{t6};
                    if(count >=1){
                        count = count + list2.size();
                    }
                else{
                    count = list2.size();
                }  
            }
        }
        system.debug(list1 +''+ list1.size());
        list<Project__c>pro1 =[select id,Name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c from Project__c where Name = 'testproject'];
        for(Project__c pro2 : pro1){
            system.assertEquals(t5.size(),pro2.Total_no_of_Tasks__c);
            system.debug(pro2 +''+t5.size());
        }
    }
    @istest
    private static void deletetest(){
        list<Tasks__c> t7 = [select id,name,Completed__c,Project__c from Tasks__c where name = 'tasktest4' or name = 'tasktest1'];     
        delete t7;
        list<Project__c>pro3 =[select id,Name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c from Project__c where Name = 'testproject'];
        for(Project__c pro4 : pro3){
            system.assertEquals(3,pro4.Total_no_of_Tasks__c);
            system.debug(pro4);
        }
        
        undelete t7;
        list<Project__c>pro5 =[select id,Name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c from Project__c where Name = 'testproject'];
        for(Project__c pro6 : pro5){
            system.assertEquals(5,pro6.Total_no_of_Tasks__c);
            system.debug(pro6);
        }
        
    }
    @istest
    private static void updatetest(){
        list<Tasks__c> t5 = [select id,name,Completed__c,Project__c from Tasks__c];
        list<Tasks__c> finallist1 = new list<Tasks__c>();
        for(Tasks__c ta :t5){
            If(ta.Project__c != null){
                finallist1.add(ta);
            }
           
        }
        system.debug(finallist1);
        update finallist1;
        list<Tasks__c> finallist = new list<Tasks__c>();
        list<Project__c>protest =[select id,Name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c from Project__c];
        for(Project__c protest1:protest){
            if(protest1.name == 'testproject1'){
               for(Tasks__c t6 :t5){
                   t6.Project__c = protest1.id;
                   finallist.add(t6);
            }
        }   
        }    
        update finallist;
        list<Project__c> checkpro =[select id,Name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c from Project__c where Name = 'testproject1'];
        for(Project__c protest2:checkpro){
            if(protest2.name == 'testproject1'){
                system.assertEquals(6,protest2.Total_no_of_Tasks__c);
            }
                
            }
        
    }
}