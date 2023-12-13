public class generateQuotePdfController 
{
    // Constructor - this only really matters if the autoRun function doesn't work right
    private Quote qt;
    private Opportunity op;
    private String recordId;
    private SObject record;
    public generateQuotePdfController(ApexPages.StandardController stdController) 
    {
        // get record...
        record = stdController.getRecord();
        
        if(record.getsObjectType() == Opportunity.sObjectType)
        {
            // Opportunity record, get synced quote...
            op = [select Id, QTO_Quote__c from Opportunity where Id = :ApexPages.currentPage().getParameters().get('id')];
            if (op.QTO_Quote__c == null) 
        	{
            	// Display the Visualforce page's content if no synced quote...
            	ApexPages.Message myMsg = new ApexPages.Message(ApexPages.Severity.ERROR,'Error: No Synced Quote!');
            	ApexPages.addMessage(myMsg); 
        	}
            qt = [select Id, name, Quote_Template__c, Proforma_Template__c, Type__c from Quote where Id = :op.QTO_Quote__c];
        }
        else
        {
            // must be a quote!...
        	this.qt = (Quote)record;
        }
    }
    
    // Code we will invoke on page load (Opportunity).
    public PageReference autoRun() 
    {
 		String templateId;
        recordId = ApexPages.currentPage().getParameters().get('id');
        String quoteId = recordId;  // assume it's a quote for now...
        
        if(record.getsObjectType() == Opportunity.sObjectType)
        {
        	// get Opportunity Quote...
        	op = [select Id, QTO_Quote__c, Pricebook2Id from Opportunity where Id = :recordId];
        	quoteId = op.QTO_Quote__c;            
        }

        if (quoteId == null) 
        {
            // Display the Visualforce page's content if no Id is passed over
            ApexPages.Message myMsg = new ApexPages.Message(ApexPages.Severity.ERROR,'Error: No Quote ID!');
            ApexPages.addMessage(myMsg); 
            return null;
        }
        
        List<Id> quotes = new List<Id>();
        quotes.add(quoteId);
        generateQuotePdf.generatePdf(quotes, recordId);

                
        // Redirect the user back to the original page
        PageReference pageRef = new PageReference('/' + recordId);
        pageRef.setRedirect(true);
        return pageRef;
    }
}