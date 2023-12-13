global class CurrencyUpdateCheck implements Schedulable
{
   	// nightly check for updates to currency rates...

   	public static String CRON_EXP = '0 0 0 * * ? *'; // fire every day at midnight
   
   	global void execute(SchedulableContext ctx) 
   	{
        // fire off batch job...
        UpdateCurrencyPricebookEntries batchJob = new UpdateCurrencyPricebookEntries(); 
		Id batchId = Database.executeBatch(batchJob);
        system.debug('UpdateCurrencyPricebookEntries batchjob id = '+batchId);
   	}   
}