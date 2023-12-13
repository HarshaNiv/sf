@isTest
public class deleteOpeningBalanceTransactions_Test
{
    @isTest
    public static void test()
    {
        // setup
        Product2 prod1 = new Product2(name = 'test prod 1', Quantity_on_Hand__c  = 100);
        insert prod1;

        Product2 prod2 = new Product2(name = 'test prod 2', Quantity_on_Hand__c  = 10);
        insert prod2;
        
        List<Transaction__c> trans = new List<Transaction__c>();
        Date start = Date.newInstance(2021, 1, 1);
        insert new Transaction__c(Product__c = prod1.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 10, Sop_Ship_Pop_Arrive__c = start);
        insert new Transaction__c(Product__c = prod2.id, Transit_Type__c = 'Sales Order', Sop_Pop_Wo_Qty__c = 20, Sop_Ship_Pop_Arrive__c = start);

        // check that we have opening balance records (created by trigger)
        List<Transaction__c> tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c, Transit_Type__c FROM Transaction__c WHERE Product__c = :prod1.Id ORDER by Sort__c DESC];
        system.assertEquals(2, tranChk.size());        
        system.assertEquals(10, tranChk[0].Sop_Pop_Wo_Qty__c);
        system.assertEquals(90, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[0].Quantity_On_Hand__c);
        system.assertEquals('Sales Order', tranChk[0].Transit_Type__c);        
        system.assertEquals(null, tranChk[1].Sop_Pop_Wo_Qty__c);
        system.assertEquals(100, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[1].Quantity_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[1].Transit_Type__c);

        tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c, Transit_Type__c FROM Transaction__c WHERE Product__c = :prod2.Id ORDER by Sort__c DESC];
        system.assertEquals(2, tranChk.size());
        system.assertEquals(20, tranChk[0].Sop_Pop_Wo_Qty__c);
        system.assertEquals(-10, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals(10, tranChk[0].Quantity_On_Hand__c);
        system.assertEquals('Sales Order', tranChk[0].Transit_Type__c);        
        system.assertEquals(null, tranChk[1].Sop_Pop_Wo_Qty__c);
        system.assertEquals(10, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals(10, tranChk[1].Quantity_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[1].Transit_Type__c);
        
        // test
        test.startTest();
        deleteOpeningBalanceTransactions.run();
		test.stopTest();        
        
        // validate
        tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c, Transit_Type__c FROM Transaction__c WHERE Product__c = :prod1.Id ORDER by Sort__c DESC];
        system.assertEquals(1, tranChk.size());        
        system.assertEquals(10, tranChk[0].Sop_Pop_Wo_Qty__c);
        system.assertEquals(90, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals(100, tranChk[0].Quantity_On_Hand__c);
        system.assertEquals('Sales Order', tranChk[0].Transit_Type__c);        

        tranChk = [SELECT Sop_Pop_Wo_Qty__c, Balance_Inc_On_Hand__c, Quantity_On_Hand__c, Transit_Type__c FROM Transaction__c WHERE Product__c = :prod2.Id ORDER by Sort__c DESC];
        system.assertEquals(1, tranChk.size());
        system.assertEquals(20, tranChk[0].Sop_Pop_Wo_Qty__c);
        system.assertEquals(-10, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals(10, tranChk[0].Quantity_On_Hand__c);
        system.assertEquals('Sales Order', tranChk[0].Transit_Type__c);        
    }
}