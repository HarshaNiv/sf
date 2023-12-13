public class generateOpportunityPdf 
{
    //@InvocableMethod(label='Generate PDF' description='Generates a PDF quote document.')
    public static List<ID> generatePdf(List<Id> opportunities, ID recordId) 
    {
        // get quote
        List<Opportunity> ops = [select Id, number__c, Quote_Type__c from Opportunity where Id in :opportunities];
        
        for(Opportunity op :ops)
        {    
            PageReference pdf = Page.opportunityPdf;
            pdf.getParameters().put('id',op.Id);
                            
            // write new file...
              
            // existing document with same title?...
            String title =op.Quote_Type__c + ' - ' + op.Number__c;
            LIST<ContentDocumentLink> cdls = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId AND ContentDocumentId IN (SELECT Id FROM ContentDocument WHERE Title = :title)];
            ContentDocumentLink cdl = null;
            if(!cdls.isEmpty()) cdl = cdls[0];  // take the first if there are duplicate names(!)...
              
            // create new document version...
            ContentVersion cont = new ContentVersion();
            if(cdl != null) cont.ContentDocumentId = cdl.ContentDocumentId;  // add new version rather than new file (if exists)
            cont.Title = title;
            cont.PathOnClient = title + '.pdf';
            if (Test.IsRunningTest())
                cont.VersionData = Blob.valueOf('UNIT.TEST');   // to support test methods...
            else
                cont.VersionData = pdf.getContent();
            insert cont;
              
            if(cdl == null)
            {
                // new document => need to create link to Quote...
                  
                // get document id...
                cont = [SELECT id, ContentDocumentId FROM ContentVersion WHERE Id = :cont.id];
                  
                // create link...
                cdl = new ContentDocumentLink();
                cdl.ContentDocumentId = cont.ContentDocumentId;
                cdl.LinkedEntityId = recordId;
                cdl.ShareType = 'V';
                cdl.Visibility = 'AllUsers';
                insert cdl;
            }
        }

            
    // return all as successful!
    return opportunities;
  }
}