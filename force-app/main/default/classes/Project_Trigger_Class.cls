public class Project_Trigger_Class { 
    
    public static void inserttask(list<Tasks__c> triggernew){
       Project_Trigger_Class1.task1(triggernew);
    }
    public static void updatetask(list<Tasks__c> triggernew,list<Tasks__c> triggerold){
        set<id> proid = new set<id>();
        set<id> proid1 = new set<id>();
        for(Tasks__c task : triggernew){
            if(task.Project__c != null){
                proid.add(task.Project__c);
                system.debug(proid);
            }  
        }
        for(Tasks__c task1 : triggerold){
            if(task1.Project__c != null){
            proid1.add(task1.Project__c);
            system.debug(proid1);
            }
        }
        
        map<id,Project__c> flist = new map<id,Project__c>();
        list<Project__c> pro1 = [select id,name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c,(select id,Completed__c,Project__c from Tasks__r) from Project__c where id in: proid];
        list<Project__c> pro3 = [select id,name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c ,(select id,Completed__c,Project__c from Tasks__r)from Project__c where id in: proid1];
        for(Project__c pro : pro1){
            list<Tasks__c> countlist = pro.Tasks__r;
            pro.Total_no_of_Tasks__c = countlist.size();
            // id t1 = pro2.id;
            for(Tasks__c task : triggernew){
                for(Tasks__c task1 : triggerold){
                    if(task1.Project__c == null && task.Project__c == pro.id){
                        if(task.Completed__c == true){
                            list<Tasks__c> countlist1 = new list<Tasks__c>{task};
                                if(pro.Total_no_of_Completed_Tasks__c >= 1){
                                    Decimal ecount = pro.Total_no_of_Completed_Tasks__c;
                                    pro.Total_no_of_Completed_Tasks__c = ecount + countlist1.size();
                                }
                            else{
                                pro.Total_no_of_Completed_Tasks__c =  countlist1.size(); 
                            }
                        }
                        else if(task.Completed__c == false){
                            list<Tasks__c> countlist2 = new list<Tasks__c>{task};
                                if(pro.Total_no_of_Pending_Tasks__c >= 1){ 
                                    Decimal ecount1 = pro.Total_no_of_Pending_Tasks__c;
                                    pro.Total_no_of_Pending_Tasks__c = ecount1 + countlist2.size();   
                                }
                            else{
                                pro.Total_no_of_Pending_Tasks__c = countlist2.size();
                            }
                        }
                    }
                    for(Project__c pro2 : pro3){
                        if(task.Project__c != task1.Project__c){
                            list<Tasks__c> flist1 = pro.Tasks__r;
                            pro.Total_no_of_Tasks__c = flist1.size();
                            list<Tasks__c> flist2 = pro2.Tasks__r;
                            pro2.Total_no_of_Tasks__c = flist2.size();
                            if(task.Completed__c == true && task1.Completed__c == true){
                                list<Tasks__c> tc = new list<Tasks__c>{task};
                                    if(pro.Total_no_of_Completed_Tasks__c >= 1){
                                        Decimal existingcount = pro.Total_no_of_Completed_Tasks__c;
                                        pro.Total_no_of_Completed_Tasks__c = existingcount + tc.size();
                                    }
                                else{
                                    pro.Total_no_of_Completed_Tasks__c = tc.size();
                                }
                                Decimal count2 = pro2.Total_no_of_Completed_Tasks__c;
                                pro2.Total_no_of_Completed_Tasks__c = count2 - tc.size();
                            }
                            else if(task.Completed__c == false && task1.Completed__c == false){
                                list<Tasks__c> tc2 = new list<Tasks__c>{task};
                                    if(pro.Total_no_of_Pending_Tasks__c >= 1){
                                        Decimal existingcount1 = pro.Total_no_of_Pending_Tasks__c;
                                        pro.Total_no_of_Pending_Tasks__c = existingcount1 + tc2.size() ;
                                    }
                                else{
                                    pro.Total_no_of_Pending_Tasks__c = tc2.size();
                                }
                                Decimal count3 = pro2.Total_no_of_Pending_Tasks__c;
                                pro2.Total_no_of_Pending_Tasks__c = count3 - tc2.size();  
                            }
                            else if(task.Completed__c == True && task1.Completed__c == false){
                                list<Tasks__c> tc3 = new list<Tasks__c>{task};
                                    if(pro.Total_no_of_Completed_Tasks__c >= 1){
                                        Decimal existingcount1 = pro.Total_no_of_Completed_Tasks__c;
                                        pro.Total_no_of_Completed_Tasks__c = existingcount1 + tc3.size() ;
                                    }
                                else{
                                    pro.Total_no_of_Completed_Tasks__c = tc3.size();
                                }
                                Decimal count4 = pro2.Total_no_of_Pending_Tasks__c;
                                pro2.Total_no_of_Pending_Tasks__c = count4 - tc3.size();  
                            }
                            else if(task.Completed__c == false && task1.Completed__c == true){
                                list<Tasks__c> tc4 = new list<Tasks__c>{task};
                                    if(pro.Total_no_of_Pending_Tasks__c >= 1){
                                        Decimal existingcount = pro.Total_no_of_Pending_Tasks__c;
                                        pro.Total_no_of_Pending_Tasks__c = existingcount + tc4.size();
                                    }
                                else{
                                    pro.Total_no_of_Pending_Tasks__c = tc4.size();
                                }
                                Decimal count5 = pro2.Total_no_of_Completed_Tasks__c;
                                pro2.Total_no_of_Completed_Tasks__c = count5 - tc4.size();
                                
                            }
                            
                        }
                        
                        else if(task.Project__c == task1.Project__c){
                            if(task.Completed__c == true && task1.Completed__c == false){
                                list<Tasks__c> tc = new list<Tasks__c>{task};
                                    if(pro.Total_no_of_Completed_Tasks__c >=1){
                                        Decimal existingcount = pro.Total_no_of_Completed_Tasks__c;
                                        pro.Total_no_of_Completed_Tasks__c = existingcount + tc.size();
                                    }
                                else{
                                    pro.Total_no_of_Completed_Tasks__c =tc.size();
                                }
                                Decimal count2 = pro.Total_no_of_Pending_Tasks__c;
                                pro.Total_no_of_Pending_Tasks__c = count2 - tc.size();
                            }  
                            else if(task.Completed__c == false && task1.Completed__c == true){
                                list<Tasks__c> tc2 = new list<Tasks__c>{task};
                                    if(pro.Total_no_of_Pending_Tasks__c >=1){
                                        Decimal existingcount1 = pro.Total_no_of_Pending_Tasks__c;
                                        pro.Total_no_of_Pending_Tasks__c = existingcount1 + tc2.size() ;
                                    }
                                else{
                                    pro.Total_no_of_Pending_Tasks__c = tc2.size();
                                }
                                Decimal count3 = pro.Total_no_of_Completed_Tasks__c;
                                pro.Total_no_of_Completed_Tasks__c = count3 - tc2.size();
                            }
                            
                        }
                        if(pro2 !=null){
                            flist.put(pro2.Id,pro2);  
                        }
                        
                    }
                    
                }
            }
            flist.put(pro.Id,pro);
        }
        if(flist.size()>0){
            try{
                update flist.values();
            }
            catch(exception e){
                system.debug(e.getmessage());
            }
        }    
        
    }
    public static void deletetask(list<Tasks__c>triggerold){
          set<id> proid = new set<id>();
        for(Tasks__c ta : triggerold){          
            if(ta.Project__c !=null){
                proid.add(ta.Project__c);
            }
        }
        list<Project__c> pro1 = [select id,name,Total_no_of_Completed_Tasks__c,Total_no_of_Pending_Tasks__c,Total_no_of_Tasks__c,(select id,Completed__c,Project__c from Tasks__r) from Project__c where id in: proid];
        list<Project__c> flist = new list<Project__c> ();
        for(Project__c pro : pro1){
            list<Tasks__c> fdel = pro.Tasks__r;
            pro.Total_no_of_Tasks__c = fdel.size();
            for(Tasks__c task : triggerold){
                if(task.Completed__c == true){
                    list<Tasks__c> fdel1 = new list<Tasks__c>{task};
                        if(pro.Total_no_of_Completed_Tasks__c > 0){
                            Decimal existingcount = pro.Total_no_of_Completed_Tasks__c;
                            pro.Total_no_of_Completed_Tasks__c = existingcount - fdel1.size();
                        }
                    else{
                        pro.Total_no_of_Completed_Tasks__c = 0;
                    }
                }
                if(task.Completed__c == false){
                    list<Tasks__c> fdel2 = new list<Tasks__c>{task};
                        if(pro.Total_no_of_Pending_Tasks__c > 0){
                            Decimal existingcount1 = pro.Total_no_of_Pending_Tasks__c;
                            pro.Total_no_of_Pending_Tasks__c = existingcount1 - fdel2.size();
                        }
                    else{
                        pro.Total_no_of_Pending_Tasks__c = 0;
                    }
                }
                
            }
            
            flist.add(pro);  
        }
        if(!flist.isEmpty()){
            try{
                update flist;
            }
            catch(exception e){
                system.debug(e.getmessage());
            }
        }
    }
    public static void undeletetask(list<Tasks__c> triggernew){
        Project_Trigger_Class1.task1(triggernew);
    }
}