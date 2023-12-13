@isTest public class AccountTrigger_Test 
{
    static private User UserWholesale;
    static private User UserLighting;
    static private User UserIndustrial;
    static private User UserInactive;
    
	static void setupTestData()
    {
        UserWholesale = new User(
                     ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User'].Id,
                     LastName = 'last',
                     Email = 'puser000@amamama.com',
                     Username = 'puser000@amamama.com' + System.currentTimeMillis(),
                     CompanyName = 'TEST',
                     Title = 'title',
                     Alias = 'alias',
                     TimeZoneSidKey = 'America/Los_Angeles',
                     EmailEncodingKey = 'UTF-8',
                     LanguageLocaleKey = 'en_US',
                     LocaleSidKey = 'en_US');
        insert UserWholesale;

        UserLighting = new User(
                     ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User'].Id,
                     LastName = 'last',
                     Email = 'puser000@amamama.com',
                     Username = 'puser000@amamama.com' + System.currentTimeMillis(),
                     CompanyName = 'TEST',
                     Title = 'title',
                     Alias = 'alias',
                     TimeZoneSidKey = 'America/Los_Angeles',
                     EmailEncodingKey = 'UTF-8',
                     LanguageLocaleKey = 'en_US',
                     LocaleSidKey = 'en_US');
        insert UserLighting;
        
        UserIndustrial = new User(
                     ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User'].Id,
                     LastName = 'last',
                     Email = 'puser000@amamama.com',
                     Username = 'puser000@amamama.com' + System.currentTimeMillis(),
                     CompanyName = 'TEST',
                     Title = 'title',
                     Alias = 'alias',
                     TimeZoneSidKey = 'America/Los_Angeles',
                     EmailEncodingKey = 'UTF-8',
                     LanguageLocaleKey = 'en_US',
                     LocaleSidKey = 'en_US');
        insert UserIndustrial;

        UserInactive = new User(
                     ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User'].Id,
                     LastName = 'last',
                     Email = 'puser000@amamama.com',
                     Username = 'puser000@amamama.com' + System.currentTimeMillis(),
                     CompanyName = 'TEST',
                     Title = 'title',
                     Alias = 'alias',
                     TimeZoneSidKey = 'America/Los_Angeles',
                     EmailEncodingKey = 'UTF-8',
                     LanguageLocaleKey = 'en_US',
                     LocaleSidKey = 'en_US',
        			 IsActive = false);
        insert UserInactive;
        
        Postcode__c pc1 = new Postcode__c();
        pc1.Sales_Person_OEM__c = UserIndustrial.id;
        pc1.Sales_Person_OEM_Lighting_Din_Rail__c = UserLighting.id;
        pc1.Sales_Person_Wholesale__c = UserWholesale.id;
        pc1.Name = 'SO22';
        pc1.Country__c = 'United Kingdom';
        insert pc1;

        Postcode__c pc2 = new Postcode__c();
        pc2.Sales_Person_OEM__c = UserIndustrial.id;
        pc2.Sales_Person_OEM_Lighting_Din_Rail__c = UserLighting.id;
        pc2.Sales_Person_Wholesale__c = UserWholesale.id;
        pc2.Name = 'SE12';
        pc2.Country__c = 'United Kingdom';
        insert pc2;

        Postcode__c pc3 = new Postcode__c();
        pc3.Sales_Person_OEM__c = UserIndustrial.id;
        pc3.Sales_Person_OEM_Lighting_Din_Rail__c = UserLighting.id;
        pc3.Sales_Person_Wholesale__c = UserWholesale.id;
        pc3.Name = 'Canada';
        pc3.Country__c = 'Canada';
        insert pc3;
    }
    
    @isTest
	static void test_UK_Postcode_Industrial()
    {
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.Structure__c = 'PowerLed';
        acc.Team__c = 'Industrial';
        acc.BillingPostalCode = 'SO22 5LP';
        
        test.startTest();
        insert acc;
        test.stopTest();
        
        acc = [SELECT Postcode_Region__r.Name, OwnerId FROM Account WHERE Id = :acc.id];
        system.assert(acc.Postcode_Region__r.Name == 'SO22');
        system.assert(acc.OwnerId == UserIndustrial.Id);     
    }

    
    @isTest
	static void test_UK_Postcode_Industrial_manually_assigned()
    {
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.Structure__c = 'PowerLed';
        acc.Team__c = 'Industrial';
        acc.BillingPostalCode = 'SO22 5LP';
        acc.manually_assigned_owner__c = true;
        acc.OwnerId = UserLighting.Id;
        
        test.startTest();
        insert acc;
        test.stopTest();
        
        acc = [SELECT Postcode_Region__r.Name, OwnerId FROM Account WHERE Id = :acc.id];
        system.assert(acc.Postcode_Region__r.Name == 'SO22');
        system.assert(acc.OwnerId == UserLighting.Id);     
    }

    
    @isTest
	static void test_UK_Postcode_Industrial_manually_updated_owner()
    {
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.Structure__c = 'PowerLed';
        acc.Team__c = 'Industrial';
        acc.BillingPostalCode = 'SO22 5LP';
        acc.manually_assigned_owner__c = false;  // set to default i.e. false
        acc.OwnerId = UserLighting.Id;
        insert acc;
        
        test.startTest();
        acc.OwnerId = UserWholesale.Id;
        acc.manually_assigned_owner__c = true;  // allow manual updating
        acc.Transition_Period__c = 'Immediate'; // need transition period!
		update acc;
        test.stopTest();
        
        acc = [SELECT Postcode_Region__r.Name, OwnerId, manually_assigned_owner__c FROM Account WHERE Id = :acc.id];
        system.assert(acc.Postcode_Region__r.Name == 'SO22');
        system.assert(acc.OwnerId == UserWholesale.Id); 
        system.assert(acc.manually_assigned_owner__c == true);
    }

    
    
    @isTest
   	static void test_UK_Postcode_Lighting()
    {
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.Structure__c = 'PowerLed';
        acc.Team__c = 'OEM Lighting';
        acc.BillingPostalCode = 'SO22 5LP';
        
        test.startTest();
        insert acc;
        test.stopTest();
        
        acc = [SELECT Postcode_Region__r.Name, OwnerId FROM Account WHERE Id = :acc.id];
        system.assert(acc.Postcode_Region__r.Name == 'SO22');
        system.assert(acc.OwnerId == UserLighting.Id);      
    }
    
    @isTest
   	static void test_UK_Postcode_Wholesale()
    {
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.Structure__c = 'PowerLed';
        acc.Team__c = 'Wholesale';
        acc.BillingPostalCode = 'SO22 5LP';
        
        test.startTest();
        insert acc;
        test.stopTest();
        
        acc = [SELECT Postcode_Region__r.Name, OwnerId FROM Account WHERE Id = :acc.id];
        system.assert(acc.Postcode_Region__r.Name == 'SO22');
        system.assert(acc.OwnerId == UserWholesale.Id);      
    }

    @isTest
   	static void test_UK_Postcode_Wholesale_update_transition_period_defined()
    {
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.Structure__c = 'PowerLed';
        acc.Team__c = 'Wholesale';
        acc.BillingPostalCode = 'SO22 5LP';
        acc.Transition_Period__c = 'Immediate';
        insert acc;

		acc.Team__c = 'OEM Lighting';

        test.startTest();
        update acc;
        test.stopTest();     
        
        acc = [SELECT Postcode_Region__r.Name, OwnerId FROM Account WHERE Id = :acc.id];
        system.assert(acc.Postcode_Region__r.Name == 'SO22');
        system.assert(acc.OwnerId == UserLighting.Id); 
    }

    
    @isTest
   	static void test_UK_Postcode_Wholesale_update_no_transition_period_defined()
    {
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.Structure__c = 'PowerLed';
        acc.Team__c = 'Wholesale';
        acc.BillingPostalCode = 'SO22 5LP';
        insert acc;

		acc.Team__c = 'OEM Lighting';
        try
        {
	        test.startTest();
        	update acc;
	        test.stopTest();
        }
        catch(Exception e)
        {
			system.assert(e.getMessage().contains('Update is changing the account owner, therefore the transition period is required!'));
        }        
    }

    
    
    @isTest
   	static void test_canada_Lighting()
    {
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.Structure__c = 'PowerLed';
        acc.Team__c = 'OEM Lighting';
        acc.BillingCountry = 'Canada';
        
        test.startTest();
        insert acc;
        test.stopTest();
        
        acc = [SELECT Postcode_Region__r.Name, OwnerId FROM Account WHERE Id = :acc.id];
        system.assert(acc.Postcode_Region__r.Name == 'Canada');
        system.assert(acc.OwnerId == UserLighting.Id);      
    }
    
    
    @isTest
   	static void test_account_inactive_owner_contact_owner_update()
    {
        // tests to ensure that when an account owner is changes to an inactive 
        // user, the contacts are also updated correctly.
        
        setupTestData();
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Type = 'Customer';
        acc.OwnerId = UserIndustrial.Id;
        insert acc;
        
        Contact con = new Contact();
		con.LastName = 'LN';
        con.AccountId = acc.Id;
        con.OwnerId = UserIndustrial.Id;
        insert con;
        
        test.startTest();
        acc.OwnerId = UserInactive.Id;
        update acc;
        test.stopTest();
        
        acc = [SELECT OwnerId FROM Account WHERE Id = :acc.id];
        system.assert(acc.OwnerId == UserInactive.Id);      

        con = [SELECT OwnerId FROM Contact WHERE Id = :con.id];
        system.assert(con.OwnerId == UserInactive.Id);      
    }
}