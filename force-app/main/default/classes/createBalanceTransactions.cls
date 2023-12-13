global class createBalanceTransactions implements Database.Batchable<sObject>
{
    Decimal balance;
    Id currentProductId;
    
    global Database.QueryLocator start(Database.BatchableContext bc) 
    {
        return Database.getQueryLocator('SELECT Id, Quantity_on_Hand__c FROM Product2 ORDER BY Name ASC');
    }
    
    global void execute(Database.BatchableContext bc, List<Product2> prods)
    {
        // process each batch of records
        
        // get opening balance transaction records for products
        Set<Id> prodIds = new Set<Id>();
        for(Product2 prod: prods)
            prodIds.add(prod.Id);
        List<Transaction__c> trans = [SELECT Id, Product__c, Quantity_on_Hand__c FROM Transaction__c WHERE Product__c IN :prodIds AND Transit_Type__c = 'Opening Balance'];
        
        // now trans product id...
        Set<Id> transProdIds = new Set<Id>();
        for(Transaction__c tran: trans)
            transProdIds.add(tran.Product__c);
        
        List<Transaction__c> transToInsert = new List<Transaction__c>();
        Date start = Date.newInstance(2000, 1, 1);
        for(Product2 prod: prods)
        {
            if(!transProdIds.contains(prod.Id))
            {
                // no balance record, so create one!
                Decimal qty = 0;
                if(prod.Quantity_on_Hand__c != null)
                    qty = prod.Quantity_on_Hand__c;
                transToInsert.add(new Transaction__c(Product__c = prod.id, Quantity_on_Hand__c = qty, Balance_Inc_On_Hand__c = qty, Sop_Ship_Pop_Arrive__c = start, Transit_Type__c = 'Opening Balance'));
            	transProdIds.add(prod.Id);
            }
        }
        if(!transToInsert.isEmpty())
        	insert transToInsert;
    }    
    
    global void finish(Database.BatchableContext bc)
    {
        // do nothing!
    }    
    
    global static void run()
    {
        Database.executeBatch(new createBalanceTransactions(), 50);
    }
}