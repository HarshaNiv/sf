public class Projectrec {
    @Auraenabled
    public static list<Project__c> fieldsdisplay(id proid){
        list<Tasks__c> tasklist = [select id,name,Completed__c,Project__c,Project__r.id,Project__r.Name,Project__r.Total_no_of_Tasks__c,Project__r.Total_no_of_Completed_Tasks__c,Project__r.Total_no_of_Pending_Tasks__c from Tasks__c where id =:proid and Project__c != null ];
        list<Project__c> projectlist =new list<Project__c> ();
        Project__c pro = new Project__c();
        for(Tasks__c ta :tasklist){
            pro.Id = ta.Project__r.id;
            pro.Name = ta.Project__r.Name;
            pro.Total_no_of_Tasks__c =ta.Project__r.Total_no_of_Tasks__c;
            pro.Total_no_of_Completed_Tasks__c = ta.Project__r.Total_no_of_Completed_Tasks__c;
            pro.Total_no_of_Pending_Tasks__c = ta.Project__r.Total_no_of_Pending_Tasks__c;
            projectlist.add(pro);
            system.debug(pro);
        }
        system.debug(pro);
        return projectlist;    
    }
  /**  @Auraenabled
    public static list<Tasks__c> insertfields(string Name,string Description,date Start,date Enddate){
        Tasks__c ta = new Tasks__c();
        ta.Name = Name;
.       ta.Description__c = Description; 
        ta.Start_Date__c = Start;
        ta.End_Date__c = Enddate; 
        list<Tasks__c> finallist = new list<Tasks__c>{ta};
            if(!finallist.isEmpty()){
                try{
                    insert finallist; 
                }
                catch(exception e){
                    system.debug(e.getMessage());
                }
            }
         return finallist;
    }**/
}