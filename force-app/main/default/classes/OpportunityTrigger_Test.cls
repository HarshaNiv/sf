@isTest(seeAllData=false)
private class OpportunityTrigger_Test 
{
	static testMethod void OpportunityTrigger_Test1() 
    {
       // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;
            
        Opportunity op = new Opportunity(Name = 'test', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id);
        op.Pricebook2Id = Test.getStandardPricebookId();
        insert op;
        
        Product2 prod = new Product2();
        prod.IsActive = true;
        prod.Name = 'test';
        prod.Buy_Price__c = 0.5;
        insert prod;
        
        PricebookEntry pe = new PricebookEntry();
        pe.IsActive = true;
        pe.Product2Id = prod.id;
        pe.UnitPrice = 3;
        pe.Pricebook2Id = Test.getStandardPricebookId();
        insert pe;
        
        OpportunityLineItem oli = new OpportunityLineItem();
        oli.Cost_Price__c = 1;
        oli.Description = 'desc';
        oli.Discount = 0;
        oli.FOC_Quantity__c = 0;
        oli.OpportunityId = op.id;
        oli.Product2Id = prod.id;
        oli.Quantity = 2;
        oli.UnitPrice = 1;
        oli.PricebookEntryId = pe.Id;
        insert oli;
        
        Quote qt = new Quote();
        qt.Name = 'test';
        qt.Type__c = 'Proforma';
        qt.OpportunityId = op.id;
        qt.Pricebook2Id = Test.getStandardPricebookId();
        insert qt;

        // for QTO case, opportunity must have synced quote...
        op.QTO_Quote__c = qt.id;
        update op;

        // do test...
        Test.startTest();
        op.StageName = 'Approved';
        op.Approved__c = true;
        update op;
	   	Test.stopTest();

        // Verification        
        List<QuoteLineItem> qliList = [select id, description from QuoteLineItem where QuoteId = :qt.id];
        System.assertEquals(qliList.size(), 1);
		System.assertEquals(qliList[0].description, 'desc');
	}
}