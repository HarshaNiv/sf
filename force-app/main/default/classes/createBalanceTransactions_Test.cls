@isTest
public class createBalanceTransactions_Test 
{
    @isTest
    public static void test()
    {
        // setup
        Product2 prod1 = new Product2(name = 'test prod 1', Quantity_on_Hand__c  = 100);
        insert prod1;
        Product2 prod2 = new Product2(name = 'test prod 2', Quantity_on_Hand__c  = 200);
        insert prod2;
        
        List<Transaction__c> trans = new List<Transaction__c>();
        Date start = Date.newInstance(2021, 1, 1);
        trans.add(new Transaction__c(Product__c = prod1.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 10, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod1.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 20, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod1.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 30, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod2.id, Transit_Type__c = 'Purchase Order', Sop_Pop_Wo_Qty__c = 200, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod2.id, Transit_Type__c = 'Work Order', Sop_Pop_Wo_Qty__c = 40, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod2.id, Transit_Type__c = 'Opening Balance', Sop_Pop_Wo_Qty__c = 0, Sop_Ship_Pop_Arrive__c = Date.newInstance(2000, 1, 1)));
        TransactionTriggerHelper.disabled = true;
        insert trans;
        TransactionTriggerHelper.disabled = true;
        
        // test
        test.startTest();
        createBalanceTransactions.run();
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c, Transit_Type__c FROM Transaction__c WHERE Product__c = :prod1.Id ORDER by Sort__c ASC];
        system.assertEquals(4, tranChk.size());              
        system.assertEquals(null, tranChk[0].Sop_Pop_Wo_Qty__c);        
        system.assertEquals(null, tranChk[0].Sop_Pop_Wo_Qty__c);
        system.assertEquals(100, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[0].Quantity_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[0].Transit_Type__c);
        
        tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c, Transit_Type__c FROM Transaction__c WHERE Product__c = :prod2.Id ORDER by Sort__c ASC];
        system.assertEquals(3, tranChk.size());              
        system.assertEquals('Opening Balance', tranChk[0].Transit_Type__c);
        system.assertEquals('Purchase Order', tranChk[1].Transit_Type__c);
        system.assertEquals('Work Order', tranChk[2].Transit_Type__c);
    }
}