global class deleteOpeningBalanceTransactions implements Database.Batchable<sObject>
{
    global Database.QueryLocator start(Database.BatchableContext bc) 
    {
        return Database.getQueryLocator('SELECT Id FROM Transaction__c WHERE Transit_Type__c = \'Opening Balance\'');
    }
    
    global void execute(Database.BatchableContext bc, List<Transaction__c> trans)
    {
        // process each batch of records
        List<Transaction__c> transToDelete = new List<Transaction__c>();
        for(Transaction__c tran: trans)
        {
            transToDelete.add(tran);
        }
        if(!transToDelete.isEmpty())
        	delete transToDelete;
    }    
    
    global void finish(Database.BatchableContext bc)
    {
        // do nothing!
    }    
    
    global static void run()
    {
        Database.executeBatch(new deleteOpeningBalanceTransactions(), 200);
    }
}