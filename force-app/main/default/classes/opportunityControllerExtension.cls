public class opportunityControllerExtension
{
    private final Opportunity op;
    public List<OpportunityLineItem> olis { get; set; }
    public Contact con { get; set; }

    // The extension constructor initializes the private member
    // variable acct by using the getRecord method from the standard
    // controller.
    public opportunityControllerExtension(ApexPages.StandardController stdController)
    {
        this.op = (Opportunity) stdController.getRecord();

        // build query for all OLI fields...
        // 'SELECT * FROM OpportunityLineItem WHERE QuoteId = :qt.id ORDER BY SortOrderAutonumber__c'
        String objectName = 'OpportunityLineItem';
        String query = 'SELECT';
        Map<String, Schema.SObjectField> objectFields = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        for (String s : objectFields.keySet())
        query += ' ' + s + ', ';
        if (query.subString(query.Length() - 1, query.Length()) == ',')
        query = query.subString(0, query.Length() - 1);

        query += 'product2.name, Product2.description, Product2.productcode FROM ' + objectName;
        query += ' WHERE OpportunityId = \'' + op.id + '\' ORDER BY Sort_Order__c ASC';

        // run query...
        olis = database.query(query);


        // get contact details
        Opportunity op2 = [SELECT Contact__c FROM Opportunity WHERE Id = :op.id];
        if(op2.Contact__c != null)
            con = [SELECT name, phone, email FROM Contact WHERE Id = :op2.Contact__c];
    }
}