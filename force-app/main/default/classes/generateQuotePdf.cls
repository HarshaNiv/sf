public class generateQuotePdf 
{
    //@InvocableMethod(label='Generate PDF' description='Generates a PDF quote document.')
    public static List<ID> generatePdf(List<Id> quotes, ID recordId) 
    {
        // get quote
        List<Quote> qts = [select Id, name, Quote_Template__c, Proforma_Template__c, Type__c from Quote where Id in :quotes];
        
        for(Quote qt :qts)
        {
            //Id templateId;
            
            // get template
            //if(qt.Type__c == 'Proforma')
                //templateId = qt.Proforma_Template__c;
            //else if(qt.Type__c == 'Quote')
                //templateId = qt.Quote_Template__c;
            //else
                //return null;  // should never happen!
            
            //final List<Attachment> attList = new List<Attachment>();
    
            //String quoteTemplateDataViewerUrl = '/quote/quoteTemplateDataViewer.apexp?id={!QuoteId}&headerHeight=100&footerHeight=100&summlid={!TemplateId}';
            //PageReference pageRef = new PageReference(quoteTemplateDataViewerUrl.replace('{!QuoteId}', qt.Id).replace('{!TemplateId}', templateId));
            PageReference pdf = Page.quotePdf;
    		pdf.getParameters().put('id',qt.Id);
                            
            // write new file...
              
            // existing document with same title?...
            String title = qt.Type__c + ' - ' + qt.name;
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
    return quotes;
  }
}