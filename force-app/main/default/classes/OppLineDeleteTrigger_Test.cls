@isTest
private class OppLineDeleteTrigger_Test 
{
    private static Opportunity op;
    private static OpportunityLineItem oli;
    private static quote qt;
    private static quote qt2;
    
    static void doDataPrep()
    {
        // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;
            
        op = new Opportunity(Name = 'test', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id);
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
        
        oli = new OpportunityLineItem();
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
        
        qt = new Quote();
        qt.Name = 'test';
        qt.Type__c = 'Proforma';
        qt.OpportunityId = op.id;
        qt.Pricebook2Id = Test.getStandardPricebookId();
        insert qt;
        
        qt2 = new Quote();
        qt2.Name = 'test';
        qt2.Type__c = 'Proforma';
        qt2.OpportunityId = op.id;
        qt2.Pricebook2Id = Test.getStandardPricebookId();
        insert qt2;
    }
    
    static testMethod void OppLineDeleteTrigger_attemptToDeleteApproved() 
    {
        doDataPrep();

        // approve the opportunity
        op.StageName = 'Approved';
        op.Approved__c = true;
        update op;
        
        // do test...
        try
        {
            delete oli;
            system.assert(true); // should never get here!
        }
        catch(DMLexception e)
        {
            system.assert(e.getMessage().contains('Cannot deleted line items from approved opportunity!'));                
        }
	}
     
    static testMethod void OppLineDeleteTrigger_deleteUnapproved() 
    {
        doDataPrep();

        // do test...
        try
        {
            delete oli;
        }
        catch(DMLexception e)
        {
            system.assert(true); // should never get here!
        }
	}
    
    static testMethod void OppLineDeleteTrigger_newQuoteSync() 
    {
        doDataPrep();
        
        // approve the opportunity
        op.StageName = 'Approved';
        op.Approved__c = true;
        update op;

        // do test...
        try
        {
            op.SyncedQuoteId = qt2.id;   // causes deletion of oli (when sync with quote occurs)...
            update op;
        }
        catch(DMLexception e)
        {
            system.assert(true); // should never get here!
        }
	}
}