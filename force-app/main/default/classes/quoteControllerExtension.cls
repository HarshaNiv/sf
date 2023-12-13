public class quoteControllerExtension 
{
    private final Quote qt;
    public List<QuoteLIneItem> qlis {get; set;}
    
    // The extension constructor initializes the private member
    // variable acct by using the getRecord method from the standard
    // controller.
    public quoteControllerExtension(ApexPages.StandardController stdController) 
    {
        this.qt = (Quote)stdController.getRecord();
        
        // build query for all QLI fields...
        // 'SELECT * FROM QuoteLineItem WHERE QuoteId = :qt.id ORDER BY SortOrderAutonumber__c'
        String objectName = 'QuoteLineItem';
        String query = 'SELECT';
        Map<String, Schema.SObjectField> objectFields = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        for(String s : objectFields.keySet()) 
           query += ' ' + s + ', ';
        if (query.subString(query.Length()-1,query.Length()) == ',')
            query = query.subString(0,query.Length()-1);
        
        query += 'product2.name, Product2.description, Product2.productcode FROM ' + objectName;
        query += ' WHERE QuoteId = \''+qt.id+'\' ORDER BY Sort_Order__c ASC';

        // run query...
        qlis = database.query(query);
    }
}