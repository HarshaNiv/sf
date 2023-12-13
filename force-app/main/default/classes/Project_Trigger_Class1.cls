public class Project_Trigger_Class1 {
    
    public static void task1(list<Tasks__c> triggernew1){
        set<id> projectid = new set<id>();
        for(Tasks__c task : triggernew1){
            if(task.Project__c != null){
                projectid.add(task.Project__c);
                system.debug(projectid);
            }
        }
        list<Project__c> projectlist =new list<Project__c> ();
        projectlist = [select id,Name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c,(select id,Completed__c,Project__c from Tasks__r) from Project__c where id in: projectid];
        list<Project__c> finallist = new list<Project__c>();      
        for(Project__c pro : projectlist){
            list<Tasks__c> tasklist =new list<Tasks__c>();
            tasklist = pro.Tasks__r;
            pro.Total_no_of_Tasks__c = tasklist.size();
            for(Tasks__c ta : triggernew1){
                if(ta.Completed__c == True){
                    list<Tasks__c> tasklist1 =new list<Tasks__c>{ta};
                        if(pro.Total_no_of_Completed_Tasks__c >= 1){
                            Decimal existingcount = pro.Total_no_of_Completed_Tasks__c;
                            pro.Total_no_of_Completed_Tasks__c  =existingcount + tasklist1.size();
                        }
                    else{
                        pro.Total_no_of_Completed_Tasks__c  = tasklist1.size();
                    }
                }
                else if(ta.Completed__c == false){
                    list<Tasks__c> tasklist2 =new list<Tasks__c>{ta};
                        if(pro.Total_no_of_Pending_Tasks__c >= 1){
                            Decimal existingcount1 = pro.Total_no_of_Pending_Tasks__c;
                            pro.Total_no_of_Pending_Tasks__c  = existingcount1 + tasklist2.size();
                        }
                    else{
                        pro.Total_no_of_Pending_Tasks__c = tasklist2.size();
                    }
                }
            }
            finallist.add(pro);
        }
        if(!finallist.isEmpty())
            try{
                update finallist;
            }
        catch(exception e){
            system.debug(e.getMessage());
        }
    }
}