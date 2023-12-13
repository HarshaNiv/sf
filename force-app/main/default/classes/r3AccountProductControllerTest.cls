@isTest
private class r3AccountProductControllerTest
{
    @isTest
    static private void r3AccountProductControllerTest() 
    {
        Product2 prod1 = new Product2(Name = 'test product 1');
        insert prod1;
        Id pbId = Test.getStandardPricebookId();
        Pricebook2 pb2 = new Pricebook2(Name = 'Pricebook 2');
        insert pb2;
        PricebookEntry pbeGBP1 = new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
        	Product2Id = prod1.id, 
        	Pricebook2Id = pbId, 
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
        	);  // GBP entry
        insert pbeGBP1;
        PricebookEntry pbeGBP2 = new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
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
        	);  // GBP entry
        insert pbeGBP2;

        Account acc = new Account(Name = 'test acc');
        insert acc;

        Contact con = new Contact(accountid = acc.id, firstname = 'FN', lastname = 'SN');
        insert con;

        Contract cont = new Contract(Name = 'test contract', Pricebook2Id = pb2.id, AccountId = acc.id, National_Rebate__c = 'N/A', Rebate_Scheme_Agreed__c = 'N/A', Regional_Rebate__c = 'N/A', Prompt_Payment_Discount__c = 'N/A');
        insert cont;
        cont.CompanySignedId = UserInfo.getUserId();
        cont.CompanySignedDate = Date.newInstance(2019, 07, 4);
        cont.CustomerSignedId = con.id;
        cont.CustomerSignedDate = Date.newInstance(2019, 07, 4);
        cont.CustomerSignedTitle = 'Director';

        cont.Status = 'Activated';
        update cont;

        acc.Active_Contract__c = cont.id;
        update acc;

        List<PricebookEntry> pbes = r3AccountProductController.getAccountProducts(acc.id, 'test'); 
        system.assertEquals(1, pbes.size());
    }
}