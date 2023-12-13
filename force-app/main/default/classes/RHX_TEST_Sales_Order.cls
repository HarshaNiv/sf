@isTest(SeeAllData=true)
public class RHX_TEST_Sales_Order {
     static testMethod void RHX_Testmethod() {
        List<sObject> sourceList = [SELECT Id 
                   FROM Sales_Order__c ORDER BY LastModifiedDate DESC LIMIT 1];
        if(sourceList.size() == 0) {
            sourceList.add(
                    new Sales_Order__c()
            );
        }
          

       rh2.ParentUtil.UpsertRollupTestRecords( sourceList );
    }
}