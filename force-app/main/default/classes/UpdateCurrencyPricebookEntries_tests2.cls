/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an organization are executed whenever Apex code is deployed
 * to a production organization to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production organization. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the organization size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
public class UpdateCurrencyPricebookEntries_tests2 
{
    static testMethod void testCreatePricebookEntries() 
    {
        // data set is missing USD pricebook entries, ensure that they are created 
        loadDataSet();
        Test.startTest();
        UpdateCurrencyPricebookEntries batchJob = new UpdateCurrencyPricebookEntries(); 
		Id batchId = Database.executeBatch(batchJob);
        Test.stopTest();
        
        List<PricebookEntry> pbGBPList = [SELECT UnitPrice, Product2Id, Pricebook2Id FROM PricebookEntry WHERE CurrencyIsoCode = 'GBP'];
        system.assert(pbGBPList.size() > 0);
		system.assertEquals(30.00, pbGBPList[0].UnitPrice);
		
        List<PricebookEntry> pbUSDList = [SELECT UnitPrice, Product2Id, Pricebook2Id FROM PricebookEntry WHERE CurrencyIsoCode = 'USD'];
        system.assert(pbUSDList.size() > 0);
		system.assertEquals(37.20, pbUSDList[0].UnitPrice);

    }
    
    static private void loadDataset()
    {
        Product2 prod1 = new Product2(Name = 'test product 1');
        insert prod1;
        Product2 prod2 = new Product2(Name = 'test product 2');
        insert prod2;
        Id pbId = Test.getStandardPricebookId();
        Pricebook2 pb2 = new Pricebook2(Name = 'Pricebook 2');
        insert pb2;
        PricebookEntry pbeGBP1 = new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
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
        	);  // GBP entry
        insert pbeGBP1;
        PricebookEntry pbeUSD1 = new PricebookEntry(
        	CurrencyIsoCode = 'USD', 
        	UnitPrice = 30, 
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
        	);  // USD entry
        insert pbeUSD1;
        PricebookEntry pbeGBP2 = new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
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
        	);  // GBP entry
        insert pbeGBP2;
        PricebookEntry pbeUSD2 = new PricebookEntry(
        	CurrencyIsoCode = 'USD', 
        	UnitPrice = 30, 
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
        	);  // USD entry
        insert pbeUSD2;
        PricebookEntry pbeGBP1_2 = new PricebookEntry(
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
        insert pbeGBP1_2;
        PricebookEntry pbeUSD1_2 = new PricebookEntry(
        	CurrencyIsoCode = 'USD', 
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
        	);  // USD entry
        insert pbeUSD1_2;
        PricebookEntry pbeGBP2_2 = new PricebookEntry(
        	CurrencyIsoCode = 'GBP', 
        	UnitPrice = 30, 
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
        	);  // USD entry
        insert pbeGBP2_2;
        PricebookEntry pbeUSD2_2 = new PricebookEntry(
        	CurrencyIsoCode = 'USD', 
        	UnitPrice = 30, 
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
        	);  // USD entry
        insert pbeUSD2_2;    
    }
}