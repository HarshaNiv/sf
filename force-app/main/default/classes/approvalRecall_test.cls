@isTest
public class approvalRecall_test 
{
    @isTest
    static private void testRecall_salesAdmin()
    {
        Boolean errorFlag = false;
        
        Account acc = new Account(name='test acc', shippingStreet = 'street', shippingCity = 'city', shippingCountry = 'United Kingdom', shippingPostalCode = 'postcode');         
        insert(acc);           
        
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='New', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;
        List<Id> oppIds = new List<Id>();
        oppIds.add(opp.Id);
                
        Profile salesProfile = [SELECT Id FROM Profile WHERE Name='Sales User']; 
        Profile salesAdminProfile = [SELECT Id FROM Profile WHERE Name='Sales Admin User']; 
        
        User salesUser = new User(Alias = 's', Email='salesUser@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='salesUser', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='salesUser@sunpower.co.uk');
        insert salesUser;
        User salesAdminUser = new User(Alias = 'sa', Email='salesAdminUser@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='salesAdminUser', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesAdminProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='salesAdminUser@sunpower.co.uk');
        insert salesAdminUser;

        // Create an approval request
        Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
        req.setComments('Submitting request for approval.');
        req.setObjectId(opp.id);
        
        //Submit on behalf of a specific submitter
        req.setSubmitterId(salesUser.Id);
        
        // Submit the record to specific process and skip the criteria evaluation
        req.setProcessDefinitionNameOrId('Opportunity_Managment_Approval');
        req.setSkipEntryCriteria(true);
        
        // Submit the approval request
        Approval.ProcessResult result = Approval.process(req);
        
        test.startTest();
        System.runAs(salesAdminUser) 
        {            
            try
            {
                approvalRecall.recallApproval(oppIds);
            }
            catch(exception e)
            {
                errorFlag = true;
            }
        }
        test.stopTest();
        
        system.assertEquals(false, errorFlag);
    }
    
    
    @isTest
    static private void testRecall_systemAdmin()
    {
        Boolean errorFlag = false;
        
        Account acc = new Account(name='test acc', shippingStreet = 'street', shippingCity = 'city', shippingCountry = 'United Kingdom', shippingPostalCode = 'postcode');         
        insert(acc);           
        
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='New', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;
        List<Id> oppIds = new List<Id>();
        oppIds.add(opp.Id);
                
        Profile salesProfile = [SELECT Id FROM Profile WHERE Name='Sales User']; 
        Profile sysAdminProfile = [SELECT Id FROM Profile WHERE Name='System Administrator']; 
        
        User salesUser = new User(Alias = 's', Email='salesUser@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='salesUser', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='salesUser@sunpower.co.uk');
        insert salesUser;
        User sysAdminUser = new User(Alias = 'sa', Email='sysAdminUser@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='sysAdminUser', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = sysAdminProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='sysAdminUser@sunpower.co.uk');
        insert sysAdminUser;

        // Create an approval request
        Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
        req.setComments('Submitting request for approval.');
        req.setObjectId(opp.id);
        
        //Submit on behalf of a specific submitter
        req.setSubmitterId(salesUser.Id);
        
        // Submit the record to specific process and skip the criteria evaluation
        req.setProcessDefinitionNameOrId('Opportunity_Managment_Approval');
        req.setSkipEntryCriteria(true);
        
        // Submit the approval request
        Approval.ProcessResult result = Approval.process(req);
        
        test.startTest();
        System.runAs(sysAdminUser) 
        {            
            try
            {
                approvalRecall.recallApproval(oppIds);
            }
            catch(exception e)
            {
                errorFlag = true;
            }
        }
        test.stopTest();
        
        system.assertEquals(false, errorFlag);
    }
    
    
    
    @isTest
    static private void testRecall_owner()
    {
        Boolean errorFlag = false;
        
        Profile salesProfile = [SELECT Id FROM Profile WHERE Name='Sales User']; 
        
        User owner = new User(Alias = 'o', Email='owner@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='owner', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='owner@sunpower.co.uk');
        insert owner;
        system.debug('RG>>> ownerId: '+owner.Id);
        User submitter = new User(Alias = 's', Email='submitter@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='submitter', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='submitter@sunpower.co.uk');
        insert submitter;
        system.debug('RG>>> submitterId: '+submitter.Id);

        Account acc = new Account(name='test acc', shippingStreet = 'street', shippingCity = 'city', shippingCountry = 'United Kingdom', shippingPostalCode = 'postcode');         
        System.runAs(owner) 
        {            
        	insert acc;           
        }                
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='New', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        System.runAs(owner) 
        {            
            insert opp;
        }                
        List<Id> oppIds = new List<Id>();
        oppIds.add(opp.Id);

        // Create an approval request
        Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
        req.setComments('Submitting request for approval.');
        req.setObjectId(opp.id);
        
        //Submit on behalf of a specific submitter
        req.setSubmitterId(submitter.Id);
        
        // Submit the record to specific process and skip the criteria evaluation
        req.setProcessDefinitionNameOrId('Opportunity_Managment_Approval');
        req.setSkipEntryCriteria(true);
        
        // Submit the approval request
        Approval.ProcessResult result = Approval.process(req);
        
        test.startTest();
        System.runAs(owner) 
        {            
            try
            {
                approvalRecall.recallApproval(oppIds);
            }
            catch(exception e)
            {
                errorFlag = true;
            }
        }
        test.stopTest();
        
        system.assertEquals(false, errorFlag);
    }
    
    
    @isTest
    static private void testRecall_submitter()
    {
        Boolean errorFlag = false;
        
        Profile salesProfile = [SELECT Id FROM Profile WHERE Name='Sales User']; 
        
        User owner = new User(Alias = 'o', Email='owner@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='owner', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='owner@sunpower.co.uk');
        insert owner;
        system.debug('RG>>> ownerId: '+owner.Id);
        User submitter = new User(Alias = 's', Email='submitter@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='submitter', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='submitter@sunpower.co.uk');
        insert submitter;
        system.debug('RG>>> submitterId: '+submitter.Id);
        
        Account acc = new Account(name='test acc', shippingStreet = 'street', shippingCity = 'city', shippingCountry = 'United Kingdom', shippingPostalCode = 'postcode');         
        System.runAs(owner) 
        {            
        	insert acc;           
        }                
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='New', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        System.runAs(owner) 
        {            
            insert opp;
        }                
        List<Id> oppIds = new List<Id>();
        oppIds.add(opp.Id);

        // Create an approval request
        Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
        req.setComments('Submitting request for approval.');
        req.setObjectId(opp.id);
        
        //Submit on behalf of a specific submitter
        req.setSubmitterId(submitter.Id);
        
        // Submit the record to specific process and skip the criteria evaluation
        req.setProcessDefinitionNameOrId('Opportunity_Managment_Approval');
        req.setSkipEntryCriteria(true);
        
        // Submit the approval request
        Approval.ProcessResult result = Approval.process(req);
        
        test.startTest();
        System.runAs(submitter) 
        {            
            try
            {
                approvalRecall.recallApproval(oppIds);
            }
            catch(exception e)
            {
                errorFlag = true;
            }
        }
        test.stopTest();
        
        system.assertEquals(false, errorFlag);
    }

    
    @isTest
    static private void testRecall_someoneElse()
    {
        Boolean errorFlag = false;
        
        Profile salesProfile = [SELECT Id FROM Profile WHERE Name='Sales User']; 
        
        User owner = new User(Alias = 'o', Email='owner@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='owner', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='owner@sunpower.co.uk');
        insert owner;
        User submitter = new User(Alias = 's', Email='submitter@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='submitter', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='submitter@sunpower.co.uk');
        insert submitter;
        User someoneElse = new User(Alias = 'se', Email='someoneElse@sunpower.co.uk', 
                EmailEncodingKey='UTF-8', LastName='someoneElse', LanguageLocaleKey='en_US', 
                LocaleSidKey='en_US', ProfileId = salesProfile.Id, 
                TimeZoneSidKey='America/Los_Angeles', UserName='someoneElse@sunpower.co.uk');
        insert someoneElse;

        Account acc = new Account(name='test acc', shippingStreet = 'street', shippingCity = 'city', shippingCountry = 'United Kingdom', shippingPostalCode = 'postcode');         
        System.runAs(owner) 
        {            
        	insert acc;           
        }                
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='New', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        System.runAs(owner) 
        {            
            insert opp;
        }                
        List<Id> oppIds = new List<Id>();
        oppIds.add(opp.Id);

        // Create an approval request
        Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
        req.setComments('Submitting request for approval.');
        req.setObjectId(opp.id);
        
        //Submit on behalf of a specific submitter
        req.setSubmitterId(submitter.Id);
        
        // Submit the record to specific process and skip the criteria evaluation
        req.setProcessDefinitionNameOrId('Opportunity_Managment_Approval');
        req.setSkipEntryCriteria(true);
        
        // Submit the approval request
        Approval.ProcessResult result = Approval.process(req);
        
        test.startTest();
        System.runAs(someoneElse) 
        {            
            try
            {
                approvalRecall.recallApproval(oppIds);
            }
            catch(exception e)
            {
                errorFlag = true;
            }
        }
        test.stopTest();
        
        system.assertEquals(true, errorFlag);   // expecting this one to fail - as no permission
    }


}