@isTest
public class initialiseTransactions_test 
{
    @isTest
    public static void test()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 100);
        insert prod;
        
        List<Transaction__c> trans = new List<Transaction__c>();
        Date start = Date.newInstance(2021, 1, 1);
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 10, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 20, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 30, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Purchase Order', Sop_Pop_Wo_Qty__c = 200, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Work Order', Sop_Pop_Wo_Qty__c = 40, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Work Order', Sop_Pop_Wo_Qty__c = 50, Sop_Ship_Pop_Arrive__c = start));
        TransactionTriggerHelper.disabled = true;
        insert trans;
        TransactionTriggerHelper.disabled = true;
        
        // test
        test.startTest();
        initialiseTransactions.run();
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c FROM Transaction__c ORDER by Sort__c ASC];
        system.assertEquals(10, tranChk[0].Sop_Pop_Wo_Qty__c);
        system.assertEquals(90, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[0].Quantity_On_Hand__c);
        system.assertEquals(20, tranChk[1].Sop_Pop_Wo_Qty__c);
        system.assertEquals(70, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[1].Quantity_On_Hand__c);
        system.assertEquals(30, tranChk[2].Sop_Pop_Wo_Qty__c);
        system.assertEquals(40, tranChk[2].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[2].Quantity_On_Hand__c);
        system.assertEquals(200, tranChk[3].Sop_Pop_Wo_Qty__c);
        system.assertEquals(240, tranChk[3].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[3].Quantity_On_Hand__c);
        system.assertEquals(40, tranChk[4].Sop_Pop_Wo_Qty__c);
        system.assertEquals(200, tranChk[4].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[4].Quantity_On_Hand__c);
        system.assertEquals(50, tranChk[5].Sop_Pop_Wo_Qty__c);
        system.assertEquals(150, tranChk[5].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[5].Quantity_On_Hand__c);
    }
    
    @isTest
    public static void testQOHnull()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = null);
        insert prod;
        
        List<Transaction__c> trans = new List<Transaction__c>();
        Date start = Date.newInstance(2021, 1, 1);
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 10, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 20, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 30, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Purchase Order', Sop_Pop_Wo_Qty__c = 200, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Work Order', Sop_Pop_Wo_Qty__c = 40, Sop_Ship_Pop_Arrive__c = start));
        start += 1;
        trans.add(new Transaction__c(Product__c = prod.id, Transit_Type__c = 'Work Order', Sop_Pop_Wo_Qty__c = 50, Sop_Ship_Pop_Arrive__c = start));
        TransactionTriggerHelper.disabled = true;
        insert trans;
        TransactionTriggerHelper.disabled = true;
        
        // test
        test.startTest();
        initialiseTransactions.run();
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c FROM Transaction__c ORDER by Sort__c ASC];
        system.assertEquals(10, tranChk[0].Sop_Pop_Wo_Qty__c);
        system.assertEquals(-10, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals(0, tranChk[0].Quantity_On_Hand__c);
        system.assertEquals(20, tranChk[1].Sop_Pop_Wo_Qty__c);
        system.assertEquals(-30, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals(0, tranChk[1].Quantity_On_Hand__c);
        system.assertEquals(30, tranChk[2].Sop_Pop_Wo_Qty__c);
        system.assertEquals(-60, tranChk[2].Balance_Inc_On_Hand__c);
        system.assertEquals(0, tranChk[2].Quantity_On_Hand__c);
        system.assertEquals(200, tranChk[3].Sop_Pop_Wo_Qty__c);
        system.assertEquals(140, tranChk[3].Balance_Inc_On_Hand__c);
        system.assertEquals(0, tranChk[3].Quantity_On_Hand__c);
        system.assertEquals(40, tranChk[4].Sop_Pop_Wo_Qty__c);
        system.assertEquals(100, tranChk[4].Balance_Inc_On_Hand__c);
        system.assertEquals(0, tranChk[4].Quantity_On_Hand__c);
        system.assertEquals(50, tranChk[5].Sop_Pop_Wo_Qty__c);
        system.assertEquals(50, tranChk[5].Balance_Inc_On_Hand__c);
        system.assertEquals(0, tranChk[5].Quantity_On_Hand__c);
    }
    
    @isTest
    public static void testProductNull()
    {
        // setup
        List<Transaction__c> trans = new List<Transaction__c>();
        Date start = Date.newInstance(2021, 1, 1);
        trans.add(new Transaction__c(Product__c = null, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 10, Sop_Ship_Pop_Arrive__c = start));
        TransactionTriggerHelper.disabled = true;
        insert trans;
        TransactionTriggerHelper.disabled = true;
        
        // test
        test.startTest();
        initialiseTransactions.run();
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c FROM Transaction__c ORDER by Sort__c ASC];
        system.assertEquals(10, tranChk[0].Sop_Pop_Wo_Qty__c);
        system.assertEquals(null, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals(null, tranChk[0].Quantity_On_Hand__c);
    }
}