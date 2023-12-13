public class generateOpportunityPdfController
{
    // Constructor - this only really matters if the autoRun function doesn't work right
    private Opportunity op;
    private String recordId;
    private SObject record;

    public generateOpportunityPdfController(ApexPages.StandardController stdController)
    {
        // get record...
        record = stdController.getRecord();
        this.op = (Opportunity) record;
    }

    // Code we will invoke on page load (Opportunity).
    public PageReference autoRun()
    {
        String templateId;
        recordId = ApexPages.currentPage().getParameters().get('id');
        String opportunityId = recordId;

        if (opportunityId == null)
        {
            // Display the Visualforce page's content if no Id is passed over
            ApexPages.Message myMsg = new ApexPages.Message(ApexPages.Severity.ERROR, 'Error: No Opportunity ID!');
            ApexPages.addMessage(myMsg);
            return null;
        }

        List<Id> opportunities = new List<Id> ();
        opportunities.add(opportunityId);
        generateOpportunityPdf.generatePdf(opportunities, recordId);

        // Redirect the user back to the original page
        PageReference pageRef = new PageReference('/' + recordId);
        pageRef.setRedirect(true);
        return pageRef;
    }
}