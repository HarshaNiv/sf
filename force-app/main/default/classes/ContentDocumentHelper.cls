public class ContentDocumentHelper 
{
    public static void updateOpportunities(Set<Id> oppId, Set<Id> cdlExcludeIds)
    {
        // got nothing, do nothing!
        if(oppId.IsEmpty())
            return;
        
        // get all files relating to the oppIds found...
        List<ContentDocumentLink> cdlLst = [SELECT LinkedEntityId, ContentDocumentId, ContentDocument.Title, ContentDocument.FileType, ContentDocument.FileExtension FROM ContentDocumentLink WHERE LinkedEntityId IN (SELECT Id FROM Opportunity WHERE Id IN :oppId) ORDER BY ContentDocument.Title];
    
        // get filenames and count...
        Map<Id, Opportunity> oppMap = new Map<Id, Opportunity>();
        for(ContentDocumentLink cdl :cdlLst)
        {
            // skip excluded ids...
            if(cdlExcludeIds != null && cdlExcludeIds.contains(cdl.id))
                continue;
            
            Opportunity opp;
            
            // get opportunity, or initialise new instance (with Id)...
            if(oppMap.containsKey(cdl.LinkedEntityId))
                opp = oppMap.get(cdl.LinkedEntityId);
            else
                opp = new Opportunity(Id = cdl.LinkedEntityId, File_Count__c = 0, File_Names__c = '');
            
            // append new filename and count...
            if(opp.File_Names__c == '')
                opp.File_Names__c = cdl.ContentDocument.Title + '.' + cdl.ContentDocument.FileExtension;
            else
                opp.File_Names__c = opp.File_Names__c + '; ' + cdl.ContentDocument.Title + '.' + cdl.ContentDocument.FileExtension;
            opp.File_Count__c++;
            
            // update map...
            oppMap.put(cdl.LinkedEntityId, opp);
        }
        
        // update opportunity...
        update oppMap.values();
    }
}