public class SNP_SageIdController {
    @AuraEnabled
    public static  combinedResp getOrderSummaryLineItem(String userId, Date startDate, Date endDate,String sequenceOrder, Integer OffSetVal, Integer limitValue){
       
        try{
            //Long startDateTime = long.valueOf(startDate);
            //Long endDateTime = long.valueOf(endDate);
            //String formattedStartDateTime = DateTimeFormatConversion.convertMillisecondsToDateTime(startDateTime);
            //String formattedEndDateTime = DateTimeFormatConversion.convertMillisecondsToDateTime(endDateTime);
            
            String accId = [SELECT AccountId FROM User WHERE Id=:userId LIMIT 1].AccountId;
            String currentSageId = [SELECT Account.Sage_ID__c FROM Account WHERE Id IN (SELECT AccountId FROM User WHERE Id = :userId) LIMIT 1].Sage_ID__c;
			List<OrderSummary> orSummaryList= new List<OrderSummary>();            
            if(sequenceOrder == 'DESC'){
                 orSummaryList = [SELECT Id, OrderNumber, GrandTotalAmount, Status, OrderedDate,CurrencyIsoCode FROM OrderSummary WHERE AccountId=:accId AND OrderedDate >= :startDate AND OrderedDate <= :endDate order by OrderedDate DESC LIMIT :limitValue OFFSET :OffSetVal];
            } else {
                orSummaryList = [SELECT Id, OrderNumber, GrandTotalAmount, Status, OrderedDate,CurrencyIsoCode FROM OrderSummary WHERE AccountId=:accId AND OrderedDate >= :startDate AND OrderedDate <= :endDate order by OrderedDate ASC LIMIT :limitValue OFFSET :OffSetVal];
            }
            
        	System.debug('All ordered summary list'+orSummaryList.size());
        	return new combinedResp(currentSageId,orSummaryList);
        }
        catch(Exception e){
            throw new SNP_CustomException('An error occured while trying to fetch sage id'+e.getMessage());
        }
    }
    
    
   Public class combinedResp{
        @AuraEnabled
        public String sageId;
        @AuraEnabled
        public List<OrderSummary>orderSumm;
         public combinedResp() {
            sageId ='';
            orderSumm = new List<OrderSummary>();
        }
        
         public combinedResp(String currentSageId, List<OrderSummary> orSummaryList) {
            this.sageId =currentSageId;
            this.orderSumm = orSummaryList;
        }
    }
}