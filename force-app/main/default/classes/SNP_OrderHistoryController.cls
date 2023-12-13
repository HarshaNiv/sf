public without sharing class SNP_OrderHistoryController {
    @AuraEnabled
    public static List<Account> getSageIdsFromOrderIds(List<String> allOrderIds){
         try {
            // retrieve allAccount ids from orderSummary Object
            List<OrderSummary> allAccountIds = [SELECT AccountId FROM OrderSummary WHERE OrderNumber IN : allOrderIds];
           
             // create unique Ids
             Set<Id> accId=new Set<Id>();
             for(OrderSummary ol:allAccountIds){
                 accId.add(ol.AccountId);
             }
			
            // retrieve all the sageIds from Account Object
            List<Account> allSageIds = [SELECT Sage_ID__c FROM Account WHERE Id IN :accId ];
             system.debug('All Sage IDs'+ allSageIds);
             
            return allSageIds;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    
    }
}