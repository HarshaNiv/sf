global class UpdateCurrencyPricebookEntries implements Database.Batchable<sObject> 
{
    global Database.QueryLocator start(Database.BatchableContext bc) 
    {
        // collect the batches of records or objects to be passed to execute
        return Database.getQueryLocator(
            'Select p.IsActive, p.Product2Id, p.Pricebook2Id, p.UseStandardPrice, p.UnitPrice, ' +
                                   'p.Volume_1__c, p.Sell_Price_1__c, ' + 
                                   'p.Volume_2__c, p.Sell_Price_2__c, ' +
                                   'p.Volume_3__c, p.Sell_Price_3__c, ' +
                                   'p.Volume_4__c, p.Sell_Price_4__c, ' +
                                   'p.Volume_5__c, p.Sell_Price_5__c,' +
                                   'p.Volume_6__c, p.Sell_Price_6__c, ' +
                                   'p.Volume_7__c, p.Sell_Price_7__c, ' +
                                   'p.Volume_8__c, p.Sell_Price_8__c, ' +
                                   'p.Volume_9__c, p.Sell_Price_9__c, ' +
                                   'p.Volume_10__c, p.Sell_Price_10__c, ' +
                                   'p.Name, p.CurrencyIsoCode ' +
   										'From PricebookEntry p WHERE p.CurrencyIsoCode = \'GBP\' AND p.Pricebook2Id = \'' + getStdPricebookId() + '\''
        );
    }

    global void execute(Database.BatchableContext bc, List<PricebookEntry> records)
    {
        // process each batch of records
		list<CurrencyType> cList = [SELECT ISOCode, ConversionRate, LastModifiedDate FROM CurrencyType WHERE IsActive=TRUE AND ISOCode != 'GBP'];
        
        // get USD rate...
        //Double conversionRateUSD = 0;
        //for(CurrencyType c: cList)
            //if(c.IsoCode == 'USD')
                //conversionRateUSD = c.ConversionRate;
        //system.assert(conversionRateUSD != 0, 'USD conversion rate has not been setup!');  // should never happen if currencies are setup correctly!
        
        // for each currency entry...
       	for(CurrencyType c: cList)
       	{
            // fix currency rates for testing!
            if(Test.isRunningTest())
            {
            	//conversionRateUSD = 1.24;
                if(c.IsoCode == 'USD') c.conversionRate = 1.24;
                if(c.IsoCode == 'EUR') c.conversionRate = 1.18;
        	}
            
            //Double ConversionRateFromUSD = conversionRateUSD / c.ConversionRate;
            system.debug('>>>>casCloud: ISOCode = '+c.ISOCode+', ConversionRate = '+c.ConversionRate+', LastModifiedDate = '+c.LastModifiedDate);
            //system.debug('>>>>casCloud: USD Rate = '+conversionRateUSD+', ConversionRateFromUSD = '+conversionRateFromUSD);
                        
            // update all pricebook currency entries...
            processBatch(c.IsoCode, c.ConversionRate, records);
       	}
    }    

    global void finish(Database.BatchableContext bc)
    {
        // execute any post-processing operations
    }    
    
    private double round(decimal value)
    {
        // round to 2 decimal places
        return value.setScale(2, RoundingMode.HALF_UP);
    }
    
    global void processBatch(String CurrencyIsoCode, Decimal conversionRate, List<PricebookEntry> peList)
	{
        // loop get product ids...
        List<Id> products = new List<Id>();
        for(PricebookEntry pe: peList)
            products.add(pe.Product2Id);
        
		// Get all pricebook entries using the currency code...
 		List<PriceBookEntry> peCURList = [Select p.IsActive, p.Product2Id, p.Pricebook2Id, p.UnitPrice, 
                                          p.Sell_Price_1__c, 
                                          p.Sell_Price_2__c, 
                                          p.Sell_Price_3__c, 
                                          p.Sell_Price_4__c, 
                                          p.Sell_Price_5__c,
                                          p.Sell_Price_6__c, 
                                          p.Sell_Price_7__c, 
                                          p.Sell_Price_8__c, 
                                          p.Sell_Price_9__c, 
                                          p.Sell_Price_10__c, 
                                          p.Id, p.CurrencyIsoCode 
   										From PricebookEntry p
   										WHERE CurrencyIsoCode = :CurrencyIsoCode
                                         AND p.Product2Id IN :products];
        Map<String, PricebookEntry> peCURMap = new Map<String, PricebookEntry>();
        for(PricebookEntry peCUR: peCURList)
            peCURMap.put((String)peCUR.Product2Id+(String)peCUR.Pricebook2Id, peCUR);
        
        // loop through StdPricebook GBP entries...
        for(PricebookEntry pe: peList)
        {
           	System.debug('>>>>casCloud: UpdateCurrencyPricebookEntries: Seeking '+pe.Pricebook2Id+' '+pe.Product2Id+' '+pe.CurrencyIsoCode);
            
            // check matching 'currency' entry...
            PricebookEntry peCUR = peCURMap.get((String)pe.Product2Id+(String)pe.Pricebook2Id);

            // if not found create new record, and add it to the list...
            if(peCUR == null)
            {
                peCUR = new PricebookEntry(Pricebook2Id = pe.Pricebook2Id, CurrencyIsoCode = CurrencyIsoCode, Product2Id = pe.Product2Id);
           		peCURList.add(peCUR);
	            System.debug('>>>>casCloud: UpdateCurrencyPricebookEntries: Inserting '+peCUR.Pricebook2Id+' '+peCUR.Product2Id+' '+peCUR.CurrencyIsoCode);
            }
            else
                System.debug('>>>>casCloud: UpdateCurrencyPricebookEntries: Updating '+peCUR.Pricebook2Id+' '+peCUR.Product2Id+' '+peCUR.CurrencyIsoCode);
   
            // update rates...
            if(pe.UnitPrice != null) peCUR.UnitPrice = round(pe.UnitPrice * ConversionRate);
            System.debug('>>>>casCloud: UpdateCurrencyPricebookEntries: peCUR.UnitPrice '+peCUR.UnitPrice+' pe.UnitPrice '+pe.UnitPrice);
            if(pe.Sell_Price_1__c != null) peCUR.Sell_Price_1__c = round(pe.Sell_Price_1__c * ConversionRate); else peCUR.Sell_Price_1__c = null;
            if(pe.Sell_Price_2__c != null) peCUR.Sell_Price_2__c = round(pe.Sell_Price_2__c * ConversionRate); else peCUR.Sell_Price_2__c = null;
            if(pe.Sell_Price_3__c != null) peCUR.Sell_Price_3__c = round(pe.Sell_Price_3__c * ConversionRate); else peCUR.Sell_Price_3__c = null;
            if(pe.Sell_Price_4__c != null) peCUR.Sell_Price_4__c = round(pe.Sell_Price_4__c * ConversionRate); else peCUR.Sell_Price_4__c = null;
            if(pe.Sell_Price_5__c != null) peCUR.Sell_Price_5__c = round(pe.Sell_Price_5__c * ConversionRate); else peCUR.Sell_Price_5__c = null;
            if(pe.Sell_Price_6__c != null) peCUR.Sell_Price_6__c = round(pe.Sell_Price_6__c * ConversionRate); else peCUR.Sell_Price_6__c = null;
            if(pe.Sell_Price_7__c != null) peCUR.Sell_Price_7__c = round(pe.Sell_Price_7__c * ConversionRate); else peCUR.Sell_Price_7__c = null;
            if(pe.Sell_Price_8__c != null) peCUR.Sell_Price_8__c = round(pe.Sell_Price_8__c * ConversionRate); else peCUR.Sell_Price_8__c = null;
            if(pe.Sell_Price_9__c != null) peCUR.Sell_Price_9__c = round(pe.Sell_Price_9__c * ConversionRate); else peCUR.Sell_Price_9__c = null;
            if(pe.Sell_Price_10__c != null) peCUR.Sell_Price_10__c = round(pe.Sell_Price_10__c * ConversionRate); else peCUR.Sell_Price_10__c = null;
            if(pe.Volume_1__c != null) peCUR.Volume_1__c = pe.Volume_1__c; else peCUR.Volume_1__c = null;
            if(pe.Volume_2__c != null) peCUR.Volume_2__c = pe.Volume_2__c; else peCUR.Volume_2__c = null;
            if(pe.Volume_3__c != null) peCUR.Volume_3__c = pe.Volume_3__c; else peCUR.Volume_3__c = null;
            if(pe.Volume_4__c != null) peCUR.Volume_4__c = pe.Volume_4__c; else peCUR.Volume_4__c = null;
            if(pe.Volume_5__c != null) peCUR.Volume_5__c = pe.Volume_5__c; else peCUR.Volume_5__c = null;
            if(pe.Volume_6__c != null) peCUR.Volume_6__c = pe.Volume_6__c; else peCUR.Volume_6__c = null;
            if(pe.Volume_7__c != null) peCUR.Volume_7__c = pe.Volume_7__c; else peCUR.Volume_7__c = null;
            if(pe.Volume_8__c != null) peCUR.Volume_8__c = pe.Volume_8__c; else peCUR.Volume_8__c = null;
            if(pe.Volume_9__c != null) peCUR.Volume_9__c = pe.Volume_9__c; else peCUR.Volume_9__c = null;
            if(pe.Volume_10__c != null) peCUR.Volume_10__c = pe.Volume_10__c; else peCUR.Volume_10__c = null;
            peCUR.IsActive = pe.IsActive;
	        System.debug('>>>>casCloud: UpdateCurrencyPricebookEntries: Updating '+peCUR.Pricebook2Id+' '+peCUR.Product2Id+' '+peCUR.CurrencyIsoCode);
        }
		
		// make the changes (don't catch any exceptions, such that they are reported to the user!)...
		upsert peCURList;
	}
    
    ////////////////////////////////
	//  getStdPriceBookId
    ////////////////////////////////
    static Id stdPriceBookId;
	public static Id getStdPriceBookId () 
    {
        Id stdId = Test.isRunningTest() ?
               Test.getStandardPricebookId() :
               [SELECT Id From Pricebook2 
                WHERE IsStandard = true].Id;
    	if (stdPriceBookId == null) 
        	stdPriceBookId = Test.isRunningTest() ? Test.getStandardPricebookId() : [SELECT Id From Pricebook2 WHERE IsStandard = true].Id;
    	return stdPriceBookId;    
	}
}