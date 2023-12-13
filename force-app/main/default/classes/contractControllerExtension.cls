public class contractControllerExtension
{
    private final Contract ct;
    //public List<QuoteLineItem> qlis {get; set;}
    public String currencyISO {get;set;}
    
    // The extension constructor initializes the private member
    // variable acct by using the getRecord method from the standard
    // controller.
    public contractControllerExtension(ApexPages.StandardController stdController)
    {
        this.ct = (Contract)stdController.getRecord();
        
        // build query for all contract fields... allows us to get fields not in the VFP
        // 'SELECT * FROM QuoteLineItem WHERE QuoteId = :qt.id ORDER BY SortOrderAutonumber__c'
        String objectName = 'Contract';
        String query = 'SELECT';
        Map<String, Schema.SObjectField> objectFields = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        for(String s : objectFields.keySet())
           query += ' ' + s + ', ';
        if (query.subString(query.Length()-1,query.Length()) == ',')
            query = query.subString(0,query.Length()-1);
     //   query += 'product2.name, Product2.description, Product2.productcode FROM ' + objectName;
        query += ' WHERE id = \''+ct.id+'\'';

        // run query...
   /*     qlis = database.query(query);
        if (!Test.isRunningTest()) {
            currencyISO=ConnectApi.Organization.getSettings().features.defaultCurrencyIsoCode;
            if (UserInfo.isMultiCurrencyOrganization() && qlis.size()>0)
                currencyISO=(string) ((sobject) qlis[0]).get('CurrencyIsoCode'); 
        }
        else
            currencyISO='GBP'; */
    }
}