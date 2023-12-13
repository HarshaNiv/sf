public class PropertyUtility {
    public static void newListedProperties(){
        list<Property__c>  newPropList = [select Id, Name, Broker__r.Email__c,Days_On_Market__c from Property__c where CreatedDate = Last_N_Days:30];
        for(Property__c prop:newPropList){
            string propEmail = prop.Name + ':' + prop.Broker__r.Email__c;
                system.debug(propEmail);
        }
    }

}