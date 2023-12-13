@istest
public class CurencyUpdateTestCheck_Test 
{
   static testmethod void test() 
   {
       	// load initial data set...
        loadDataset();
            
        // should be no tasks to start with...
        List<Task> tList = [SELECT id FROM Task];
        system.assert(tList.size() == 0);

   		Test.startTest();
       
      	// Schedule the test job
      	String jobId = System.schedule('CurrencyUpdateCheck', CurrencyUpdateCheck.CRON_EXP, new CurrencyUpdateCheck());

      	// Get the information from the CronTrigger API object
      	CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, NextFireTime FROM CronTrigger WHERE id = :jobId];

      	// Verify the expressions are the same
      	System.assertEquals(CurrencyUpdateCheck.CRON_EXP, ct.CronExpression);

      	// Verify the job has not run
      	System.assertEquals(0, ct.TimesTriggered);

   		Test.stopTest();
       
       	// check for updated data...  - can't do this as fired off as batch job...
        //List<PricebookEntry> pbGBPList = [SELECT UnitPrice, Product2Id, Pricebook2Id FROM PricebookEntry WHERE CurrencyIsoCode = 'GBP'];
        //system.assert(pbGBPList.size() > 0);
   	}
    
    static private void loadDataset()
    {
        Product2 prod1 = new Product2(Name = 'test product 1');
        insert prod1;
        Product2 prod2 = new Product2(Name = 'test product 2');
        insert prod2;
                
        Id pbId = Test.getStandardPricebookId();
        List<PricebookEntry> pbeList = new List<PricebookEntry>();
        pbeList.add(new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
            IsActive = true,
        	Product2Id = prod1.id, 
        	Pricebook2Id = pbid, 
        	Volume_5__c = 500, 
        	Sell_price_5__c = 25, 
        	Volume_4__c = 400, 
        	Sell_price_4__c = 26, 
        	Volume_3__c = 300, 
        	Sell_price_3__c = 27, 
        	Volume_2__c = 200, 
        	Sell_price_2__c = 28, 
        	Volume_1__c = 100, 
        	Sell_price_1__c = 29
        	 ));  // USD entry
        pbeList.add(new PricebookEntry(
        	CurrencyIsoCode = 'USD', 
        	UnitPrice = 30, 
            IsActive = true,
        	Product2Id = prod1.id, 
        	Pricebook2Id = pbid, 
        	Volume_5__c = 500, 
        	Sell_price_5__c = 25, 
        	Volume_4__c = 400, 
        	Sell_price_4__c = 26, 
        	Volume_3__c = 300, 
        	Sell_price_3__c = 27, 
        	Volume_2__c = 200, 
        	Sell_price_2__c = 28, 
        	Volume_1__c = 100, 
        	Sell_price_1__c = 29
        ));  // USD entry
        pbeList.add(new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
            IsActive = true,
        	Product2Id = prod2.id, 
        	Pricebook2Id = pbid, 
        	Volume_5__c = 500, 
        	Sell_price_5__c = 25, 
        	Volume_4__c = 400, 
        	Sell_price_4__c = 26, 
        	Volume_3__c = 300, 
        	Sell_price_3__c = 27, 
        	Volume_2__c = 200, 
        	Sell_price_2__c = 28, 
        	Volume_1__c = 100, 
        	Sell_price_1__c = 29
        	 ));  // USD entry
        pbeList.add(new PricebookEntry(
        	CurrencyIsoCode = 'USD', 
        	UnitPrice = 30, 
            IsActive = true,
        	Product2Id = prod2.id, 
        	Pricebook2Id = pbid, 
        	Volume_5__c = 500, 
        	Sell_price_5__c = 25, 
        	Volume_4__c = 400, 
        	Sell_price_4__c = 26, 
        	Volume_3__c = 300, 
        	Sell_price_3__c = 27, 
        	Volume_2__c = 200, 
        	Sell_price_2__c = 28, 
        	Volume_1__c = 100, 
        	Sell_price_1__c = 29 
        	));  // USD entry
        insert pbeList;
       
        Pricebook2 pb2 = new Pricebook2(Name = 'Pricebook 2');
        insert pb2;       
        List<PricebookEntry> pbeList2 = new List<PricebookEntry>();
        pbeList2.add(new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
            IsActive = true,
        	Product2Id = prod1.id, 
        	Pricebook2Id = pb2.id, 
        	Volume_5__c = 500, 
        	Sell_price_5__c = 25, 
        	Volume_4__c = 400, 
        	Sell_price_4__c = 26, 
            Volume_3__c = 300, 
        	Sell_price_3__c = 27, 
        	Volume_2__c = 200, 
        	Sell_price_2__c = 28, 
        	Volume_1__c = 100, 
        	Sell_price_1__c = 29 
        	));  // GBP entry
        pbeList2.add(new PricebookEntry(
        	CurrencyIsoCode = 'USD', 
        	UnitPrice = 30, 
            IsActive = true,
        	Product2Id = prod1.id, 
        	Pricebook2Id = pb2.id, 
        	Volume_5__c = 500, 
        	Sell_price_5__c = 25, 
        	Volume_4__c = 400, 
        	Sell_price_4__c = 26, 
        	Volume_3__c = 300, 
        	Sell_price_3__c = 27, 
        	Volume_2__c = 200, 
        	Sell_price_2__c = 28, 
        	Volume_1__c = 100, 
        	Sell_price_1__c = 29 
        	));  // USD entry
        pbeList2.add(new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
            IsActive = true,
        	Product2Id = prod2.id, 
        	Pricebook2Id = pb2.id, 
        	Volume_5__c = 500, 
        	Sell_price_5__c = 25, 
        	Volume_4__c = 400, 
        	Sell_price_4__c = 26, 
        	Volume_3__c = 300, 
        	Sell_price_3__c = 27, 
        	Volume_2__c = 200, 
        	Sell_price_2__c = 28, 
        	Volume_1__c = 100, 
        	Sell_price_1__c = 29 
        	));  // USD entry
        pbeList2.add(new PricebookEntry(
        	CurrencyIsoCode = 'USD', 
        	UnitPrice = 30, 
            IsActive = true,
        	Product2Id = prod2.id, 
        	Pricebook2Id = pb2.id, 
        	Volume_5__c = 500, 
        	Sell_price_5__c = 25, 
        	Volume_4__c = 400, 
        	Sell_price_4__c = 26, 
        	Volume_3__c = 300, 
        	Sell_price_3__c = 27, 
        	Volume_2__c = 200, 
        	Sell_price_2__c = 28, 
        	Volume_1__c = 100, 
        	Sell_price_1__c = 29
        	 ));  // USD entry
        insert pbeList2;    

        /*Account a = new Account(Name = 'test account name');
        insert a;
        
        List<Opportunity> oList = new List<Opportunity>();
        oList.add(new Opportunity(Name = 'Test Opportunity', StageName = 'Qualification', Pricebook2Id = pbId, CurrencyIsoCode = 'USD', CloseDate = Date.today()+7, Amount = 200, AccountId = a.id));
        insert oList;
        for(Opportunity o: oList)
        {
            insert new OpportunityLineItem(Quantity = 10, PriceBookEntryId = pbeList[1].id, OpportunityId = oList[0].id, TotalPrice = 100);  	// prod1
            insert new OpportunityLineItem(Quantity = 20, PriceBookEntryId = pbeList[3].id, OpportunityId = oList[0].id, TotalPrice = 100);		// prod2
    	}*/
    }
}