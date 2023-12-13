global class initialiseTransactions implements Database.Batchable<sObject>
{
    Decimal balance;
    Id currentProductId;
    
    global Database.QueryLocator start(Database.BatchableContext bc) 
    {
        return Database.getQueryLocator('SELECT Product__r.Quantity_on_Hand__c, Quantity_on_Hand__c, Balance_Inc_On_Hand__c, Qty__c FROM Transaction__c ORDER BY Product__c ASC, Sort__c ASC');
    }
    
    global void execute(Database.BatchableContext bc, List<Transaction__c> trans)
    {
        TransactionTriggerHelper.disabled = true;   // disable trigger!
        
        // process each batch of records
        List<Transaction__c> transToUpdate = new List<Transaction__c>();
        for (Transaction__c tran :trans) 
        {
            if(tran.Product__c == null)
                continue;
            if(currentProductId != tran.Product__c)
            {
                // first transaction for product...
                if(tran.Product__r.Quantity_on_Hand__c != null)
            		balance = tran.Product__r.Quantity_on_Hand__c;
                else
                    balance = 0;
                currentProductId = tran.Product__c;
            }
            //if(tran.Quantity_on_Hand__c != null)
                //balance = tran.Quantity_on_Hand__c;
            if(tran.Qty__c != null)
                balance += tran.Qty__c;
            tran.Balance_Inc_On_Hand__c = balance;
            if(tran.Product__r.Quantity_on_Hand__c != null)
            	tran.Quantity_on_Hand__c = tran.Product__r.Quantity_on_Hand__c;   // set to current product on hand level
            else
                tran.Quantity_on_Hand__c = 0;
            transToUpdate.add(tran);
        }
        update transToUpdate;
    }    
    
    global void finish(Database.BatchableContext bc)
    {
        // do nothing!
    } 
    
    global static void run()
    {
        Database.executeBatch(new initialiseTransactions(), 200);
    }
}