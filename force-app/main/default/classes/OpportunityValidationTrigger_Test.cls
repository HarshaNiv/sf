@isTest(seeAllData=false)
private class OpportunityValidationTrigger_Test 
{
    static testMethod void OpportunityValidationTrigger_InsertNonDuplicateTest() 
    {
       // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;
            
        Opportunity op1 = new Opportunity(Name = 'test1', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id, Customer_PO__c = '12');
        insert op1;        

        Opportunity op2 = new Opportunity(Name = 'test2', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id, Customer_PO__c = '13');    
        
        // do test...
		try
        {
            insert op2;
        }
        catch(DMLexception e)
        {
            system.assert(true); // should never get here!
        }      
	}

   	static testMethod void OpportunityValidationTrigger_UpdateNonDuplicateTest() 
    {
       // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;
            
        Opportunity op1 = new Opportunity(Name = 'test1', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id, Customer_PO__c = '12');
        insert op1;        

        Opportunity op2 = new Opportunity(Name = 'test2', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id, Customer_PO__c = '11');
        insert op2;    
        
        // do test...
		try
        {
    		op2.Customer_PO__c = '13';
            update op2;
        }
        catch(DMLexception e)
        {
            system.assert(true); // should never get here!
        }    
	}
    
    static testMethod void OpportunityValidationTrigger_InsertDuplicateTest() 
    {
       // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;
            
        Opportunity op1 = new Opportunity(Name = 'test1', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id, Customer_PO__c = '12');
        insert op1;        

        Opportunity op2 = new Opportunity(Name = 'test2', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id, Customer_PO__c = '12');    
        
        // do test...
		try
        {
            insert op2;
            system.assert(true); // should never get here!
        }
        catch(DMLexception e)
        {
            system.assert(e.getMessage().contains('Duplicate Customer PO found (on opportunity "test1")!'));                
        }
	}

	static testMethod void OpportunityValidationTrigger_UpdateDuplicateTest() 
    {
       // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;
            
        Opportunity op1 = new Opportunity(Name = 'test1', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id, Customer_PO__c = '12');
        insert op1;        

        Opportunity op2 = new Opportunity(Name = 'test2', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id, Customer_PO__c = '11');
        insert op2;    
        
        // do test...
		try
        {
    		op2.Customer_PO__c = '12';
            update op2;
            system.assert(true); // should never get here!
        }
        catch(DMLexception e)
        {
            system.assert(e.getMessage().contains('Duplicate Customer PO found (on opportunity "test1")!'));                
        }  
	}
}