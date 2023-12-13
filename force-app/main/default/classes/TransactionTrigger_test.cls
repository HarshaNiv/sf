@isTest
public class TransactionTrigger_test 
{
    @isTest
    public static void testBasicSoNew()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 100);
        insert prod;
        
        // test
        test.startTest();
        Transaction__c tran = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Sales Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(100, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(90, tranChk[0].Balance_Inc_On_Hand__c);
            
        system.assertEquals(100, tranChk[1].Quantity_on_Hand__c);
        system.assertEquals(100, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[1].Transit_Type__c);
    }
    
    
    @isTest
    public static void testBasicWoNew()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 100);
        insert prod;
        
        // test
        test.startTest();
        Transaction__c tran = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Work Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(100, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(90, tranChk[0].Balance_Inc_On_Hand__c);
            
        system.assertEquals(100, tranChk[1].Quantity_on_Hand__c);
        system.assertEquals(100, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[1].Transit_Type__c);
    }
    
    
    @isTest
    public static void testBasicPoNew()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 100);
        insert prod;
        
        // test
        test.startTest();
        Transaction__c tran = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Purchase Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(100, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(110, tranChk[0].Balance_Inc_On_Hand__c);
            
        system.assertEquals(100, tranChk[1].Quantity_on_Hand__c);
        system.assertEquals(100, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[1].Transit_Type__c);
    }
    
    
    @isTest
    public static void testBasicSo()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 100);
        insert prod;

        Transaction__c tran1 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Sales Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran1;
        
        // test
        test.startTest();
        Transaction__c tran2 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Sales Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran2;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(100, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(80, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals('Sales Order', tranChk[0].Transit_Type__c);    
        
        system.assertEquals(100, tranChk[1].Quantity_on_Hand__c);
        system.assertEquals(90, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals('Sales Order', tranChk[1].Transit_Type__c);    
        
        system.assertEquals(100, tranChk[2].Quantity_on_Hand__c);
        system.assertEquals(100, tranChk[2].Balance_Inc_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[2].Transit_Type__c);    
    }
    
    @isTest
    public static void testBasicPo()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 100);
        insert prod;

        Transaction__c tran1 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Purchase Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran1;
        
        // test
        test.startTest();
        Transaction__c tran2 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Purchase Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran2;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(100, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(120, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals('Purchase Order', tranChk[0].Transit_Type__c);    
        
        system.assertEquals(100, tranChk[1].Quantity_on_Hand__c);
        system.assertEquals(110, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals('Purchase Order', tranChk[1].Transit_Type__c);    
        
        system.assertEquals(100, tranChk[2].Quantity_on_Hand__c);
        system.assertEquals(100, tranChk[2].Balance_Inc_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[2].Transit_Type__c);    
    }
    
    
    @isTest
    public static void testBasicWo()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 100);
        insert prod;

        Transaction__c tran1 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Work Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran1;
        
        // test
        test.startTest();
        Transaction__c tran2 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Work Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran2;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(100, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(80, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals('Work Order', tranChk[0].Transit_Type__c);    
        
        system.assertEquals(100, tranChk[1].Quantity_on_Hand__c);
        system.assertEquals(90, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals('Work Order', tranChk[1].Transit_Type__c);    
        
        system.assertEquals(100, tranChk[2].Quantity_on_Hand__c);
        system.assertEquals(100, tranChk[2].Balance_Inc_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[2].Transit_Type__c);    
    }
    
    
    @isTest
    public static void testUpdateQOH()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 100);
        insert prod;

        Transaction__c tran1 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Work Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran1;

        // update quantity on hand
        prod.Quantity_on_Hand__c  = 200;
        update prod;
        
        // test
        test.startTest();
        Transaction__c tran2 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Work Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran2;
		test.stopTest();        
        
        // validate        
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(200, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(190, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals('Work Order', tranChk[0].Transit_Type__c);    
        
        system.assertEquals(100, tranChk[1].Quantity_on_Hand__c);
        system.assertEquals(90, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals('Work Order', tranChk[1].Transit_Type__c);    
        
        system.assertEquals(100, tranChk[2].Quantity_on_Hand__c);
        system.assertEquals(100, tranChk[2].Balance_Inc_On_Hand__c);
        system.assertEquals('Opening Balance', tranChk[2].Transit_Type__c);    
    }
    
    
     @isTest
    public static void testNullQOH()
    {
        // setup
        Product2 prod = new Product2(name = 'test prod', Quantity_on_Hand__c  = 3);
        insert prod;

        TransactionTriggerHelper.disabled = true;
        Transaction__c tran1 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Sales Order', 
            Sop_Pop_Wo_Qty__c = 212, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1,
            Balance_Inc_on_Hand__c = -212,
            Quantity_on_Hand__c = null
        );
        insert tran1;
        TransactionTriggerHelper.disabled = false;
        
        // test
        test.startTest();
        Transaction__c tran2 = new Transaction__c(
            Product__c = prod.id, 
            Transit_Type__c = 'Purchase Order', 
            Sop_Pop_Wo_Qty__c = 209, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran2;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(3, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(-3, tranChk[0].Balance_Inc_On_Hand__c);
        system.assertEquals('Purchase Order', tranChk[0].Transit_Type__c);    
        
        system.assertEquals(null, tranChk[1].Quantity_on_Hand__c);
        system.assertEquals(-212, tranChk[1].Balance_Inc_On_Hand__c);
        system.assertEquals('Sales Order', tranChk[1].Transit_Type__c);    
        
        // no opening balance as trigger was disabled for first insert
    }
    
    @isTest
    public static void testNullProduct()
    {
        // setup
        // <none>
        
        // test
        test.startTest();
        Transaction__c tran = new Transaction__c(
            //Product__c = prod.id, => null
            Transit_Type__c = 'Purchase Order', 
            Sop_Pop_Wo_Qty__c = 10, 
            Actual_Date__c = system.today(), 
            Cust_Suppo_Order_No__c = '1234',
            Line_ID__c = 1
        );
        insert tran;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name DESC];
        system.assertEquals(1, tranChk.size());
        system.assertEquals(0, tranChk[0].Quantity_on_Hand__c);
        system.assertEquals(10, tranChk[0].Balance_Inc_On_Hand__c);
    }
    
    @isTest
    public static void testBatchInsert()
    {
        // setup
        Product2 prod1 = new Product2(name = 'test prod 1', Quantity_on_Hand__c  = 100);
        insert prod1;

        Product2 prod2 = new Product2(name = 'test prod 2', Quantity_on_Hand__c  = 200);
        insert prod2;

        List<Transaction__c> trans = new List<Transaction__c>();
        for(Integer idx = 0; idx < 100; idx++)
        {
            trans.add(new Transaction__c(
                Product__c = prod1.id, 
                Transit_Type__c = 'Sales Order', 
                Sop_Pop_Wo_Qty__c = 1, 
                Actual_Date__c = system.today(), 
                Cust_Suppo_Order_No__c = '1234',
                Line_ID__c = idx
            ));
            trans.add(new Transaction__c(
                Product__c = prod2.id, 
                Transit_Type__c = 'Work Order', 
                Sop_Pop_Wo_Qty__c = 2, 
                Actual_Date__c = system.today(), 
                Cust_Suppo_Order_No__c = '1234',
                Line_ID__c = idx
            ));
        }
        
        // test
        test.startTest();
        insert trans;
		test.stopTest();        
        
        // validate
        List<Transaction__c> tranChk = [SELECT Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Transit_Type__c FROM Transaction__c ORDER BY Name ASC];
		system.assertEquals(202, tranChk.size());  // 200 records + 2 opening balance records		
        
        Integer boh1 = 100;
        Integer boh2 = 200;        
        for(Transaction__c tran: tranChk)
        {
            if(tran.Transit_Type__c == 'Work Order')
            {
                boh2-=2;
                system.assertEquals(200, tran.Quantity_on_Hand__c);
            	system.assertEquals(boh2, tran.Balance_Inc_On_Hand__c);
            }
            else if(tran.Transit_Type__c == 'Sales Order') 
            {
                boh1--;
            	system.assertEquals(100, tran.Quantity_on_Hand__c);
            	system.assertEquals(boh1, tran.Balance_Inc_On_Hand__c);
            }
            else if(tran.Transit_Type__c == 'Opening Balance') 
            {
            	// don't care about the two opening balance records, so ignore
            }
        }
    }
}