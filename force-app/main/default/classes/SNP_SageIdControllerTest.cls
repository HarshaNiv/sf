@isTest
public class SNP_SageIdControllerTest {
    
    @isTest(seeAllData=True)
    static void testGetOrderSummaryLineItem()
    {  
        
        Order orderRecord = [Select Id, Status,AccountId,EffectiveDate,CreatedById From Order Limit 1];
        system.debug(orderRecord);
        
        OrderSummary orderSum = [SELECT Id, OriginalOrderId,Status, AccountId,OrderedDate,CreatedDate FROM OrderSummary where OriginalOrderId=:orderRecord.Id Limit 1];
       
         SNP_SageIdController.combinedResp result = SNP_SageIdController.getOrderSummaryLineItem(orderRecord.CreatedById,Date.today(),Date.today(),'DESC',1,1);
        SNP_SageIdController.combinedResp results = SNP_SageIdController.getOrderSummaryLineItem(orderRecord.CreatedById,Date.today(),Date.today(),'ASC',1,1);
        try{
            SNP_SageIdController.combinedResp results1 = SNP_SageIdController.getOrderSummaryLineItem(orderRecord.CreatedById,Date.today(),Date.today(),'AC',5000,5000);
        }
        catch(exception e){
            system.debug(e);
        }    
               

             //System.assertEquals('TestSageId', result.sageId);
        //System.assertEquals(0, result.orderSumm.size());
        //System.assertEquals('12345', result.orderSumm[0].OrderNumber);
            
            
        
        
    }

}