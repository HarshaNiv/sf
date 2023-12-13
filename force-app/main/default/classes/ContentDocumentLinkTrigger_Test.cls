@isTest
private class ContentDocumentLinkTrigger_Test
{
    static testMethod void test_addFiles()
    {
        // Perform our data preparation...
        Account acc = new Account(Name = 'test');
        insert acc;

        Opportunity op = new Opportunity(Name = 'test', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id);
        op.Quote_Type__c = 'Proforma';
        op.Quote_Billing_City__c = 'New York';
        op.Quote_Billing_Post_Code__c = 'NY1';
        op.Quote_Shipping_City__c = 'New York';
        op.Quote_Shipping_Post_Code__c = 'NY1';

        insert op;

        ContentVersion cv = new ContentVersion();
        cv.ContentLocation = 'S';
        //cv.ContentDocumentId = contentDocumentId;
        cv.VersionData = Blob.valueOf('UNIT.TEST');
        cv.Title = 'filename1';
        cv.PathOnClient = cv.Title + '.pdf';        
        insert cv;
        
        ContentVersion cv2 = new ContentVersion();
        cv2.ContentLocation = 'S';
        cv2.VersionData = Blob.valueOf('UNIT.TEST');
        cv2.Title = 'filename2';
        cv2.PathOnClient = cv2.Title + '.pdf';  
        insert cv2;

        ContentVersion cv3 = new ContentVersion();
        cv3.ContentLocation = 'S';
        cv3.VersionData = Blob.valueOf('UNIT.TEST');
        cv3.Title = 'filename3';
        cv3.PathOnClient = cv3.Title + '.pdf';  
        insert cv3;

        ContentVersion cv4 = new ContentVersion();
        cv4.ContentLocation = 'S';
        cv4.VersionData = Blob.valueOf('UNIT.TEST');
        cv4.Title = 'filename4';
        cv4.PathOnClient = cv4.Title + '.pdf';  
        insert cv4;
        
        ContentDocument cd4 = [SELECT Id FROM ContentDocument WHERE Id IN (SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv4.Id) LIMIT 1];
        
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv.Id LIMIT 1].ContentDocumentId;
        cdl.LinkedEntityId = op.ID;
        cdl.ShareType = 'V';
        
        ContentDocumentLink cdl2 = new ContentDocumentLink();
        cdl2.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv2.Id LIMIT 1].ContentDocumentId;
        cdl2.LinkedEntityId = op.ID;
        cdl2.ShareType = 'V';
        
        ContentDocumentLink cdl4 = new ContentDocumentLink();
        cdl4.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv4.Id LIMIT 1].ContentDocumentId;
        cdl4.LinkedEntityId = op.ID;
        cdl4.ShareType = 'V';

        ContentDocumentLink cdl3 = new ContentDocumentLink();
        cdl3.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv3.Id LIMIT 1].ContentDocumentId;
        cdl3.LinkedEntityId = op.ID;
        cdl3.ShareType = 'V';
       
        ContentDocumentLink cdl_acc = new ContentDocumentLink();
        cdl_acc.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv.Id LIMIT 1].ContentDocumentId;
        cdl_acc.LinkedEntityId = acc.ID;
        cdl_acc.ShareType = 'V';

        
        test.startTest();
        insert cdl;
        insert cdl2;
        insert cdl3;
        insert cdl4;
        insert cdl_acc;
        delete cdl3;  // unshare (only ContentDocumentLink is deleted not ContentDocument)
        delete cd4;   // delete the content document (full delete, does not trigger ContentDocumentLinkTrigger, rather ContentDocumentTrigger...)
        test.stopTest();
        
        // validation
        op = [SELECT File_Names__c, File_Count__c FROM Opportunity WHERE Id = :op.Id LIMIT 1];
        System.debug('File_Names__c = ' + op.File_Names__c);
        System.assert(op.File_Names__c == 'filename1.pdf; filename2.pdf');
        System.debug('File_Count__c = ' + op.File_Count__c);
        System.assert(op.File_Count__c == 2);
    }
}