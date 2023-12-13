/**
 * @description       :
 * @author            : Jonny Harte, adapted by Nitesh Jaruhar
 * @group             :
 * @adapted date  : 10-MAY-2021
 * Modifications Log
 * Ver   Date         Author             Modification
 **/

public without sharing class CreatePdfModalController {
    private static String getRecordName(Id recordId) {
        Schema.SObjectType sObjectType = recordId.getSObjectType();
        String sObjectName = sObjectType.getDescribe().getName();

        List<SObject> records = Database.query('SELECT Name FROM ' + String.escapeSingleQuotes(sObjectName) + ' WHERE Id = :recordId WITH SECURITY_ENFORCED');

        return (String) records[0].get('Name');
    }

    @AuraEnabled
    public static List<ContentDocumentLink> getContentDocuments(Id recordId) {
        String title = CreatePdfModalController.getRecordName(recordId);
        return [
            SELECT Id, ContentDocumentId
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :recordId AND ContentDocumentId IN (SELECT Id FROM ContentDocument WHERE Title = :title)
            WITH SECURITY_ENFORCED
        ];
    }

    @AuraEnabled
    public static Id createPdf(ID recordId, String pageRefURL) {
        ContentVersion doc = new ContentVersion();
        ContentDocumentLink docLink = null;
        List<ContentDocumentLink> previousDocLinks = CreatePdfModalController.getContentDocuments(recordId);

        PageReference pageRef = new PageReference('/apex/' + pageRefURL); //NOPMD
        pageRef.getParameters().put('id', recordId);

        if (!previousDocLinks.isEmpty()) {
            // take the first if there are duplicate names.
            docLink = previousDocLinks[0];
        }

        if (docLink != null) {
            // add new version rather than new file (if exists).
            doc.ContentDocumentId = docLink.ContentDocumentId;
        }

        String title = CreatePdfModalController.getRecordName(recordId);

        doc.Title = title;
        doc.PathOnClient = title + '.pdf';

        // Get file contents
        if (Test.IsRunningTest()) {
            // to support test methods.
            doc.VersionData = Blob.valueOf('UNIT.TEST');
        } else {
            doc.VersionData = pageRef.getContent();
        }

        try {
            insert doc; //NOPMD
        } catch (exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        // new document => need to create link to Record.
        if (docLink == null) {
            // get document id.
            doc = [SELECT id, ContentDocumentId FROM ContentVersion WHERE Id = :doc.id WITH SECURITY_ENFORCED];

            // create link.
            docLink = new ContentDocumentLink();
            docLink.ContentDocumentId = doc.ContentDocumentId;
            docLink.LinkedEntityId = recordId;
            docLink.ShareType = 'V';
            docLink.Visibility = 'AllUsers';

            try {
                insert docLink; //NOPMD
            } catch (exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }

        return doc.id;
    }

    // use case 1
    // @AuraEnabled
    // public static void sendPdf(Id recordId, Id targetObjectId, List<String> ccAddresses, String senderAddressName, String emailTemplateDeveloperName, List<Id> attachmentIds) {
    //     Messaging.reserveSingleEmailCapacity(1);

    //     try {
    //         messaging.SingleEmailMessage mail = new messaging.SingleEmailMessage();

    //         mail.setTargetObjectId(targetObjectId);
    //         mail.setCcAddresses(ccAddresses);
    //         mail.setOrgWideEmailAddressId(getSenderAddressesId(senderAddressName));
    //         mail.setTemplateId(getEmailTemplateId(emailTemplateDeveloperName));
    //         mail.setEntityAttachments(attachmentIds);
    //         mail.setSaveAsActivity(true);
    //         mail.setWhatId(recordId);
    //         mail.setUseSignature(false);

    //         Messaging.sendEmail(new List<messaging.SingleEmailMessage>{ mail });
    //     } catch (exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    // use case 2
    @AuraEnabled
    public static void sendPdf(Id recordId,  String emailAddr,  List<Id> attachmentIds) {
        system.debug('I was here');
        system.debug(emailAddr);
        Messaging.reserveSingleEmailCapacity(1);
        system.debug('I was here2');
        try {
            messaging.SingleEmailMessage mail = new messaging.SingleEmailMessage();

            mail.setToAddresses(new String[]{emailAddr});
            mail.setWhatId(recordId);
            mail.setUseSignature(false);
            mail.setPlainTextBody('Please find attached your PDF.');
            mail.setSubject('Your document');
            mail.setEntityAttachments(attachmentIds);
            Messaging.SendEmailResult[] results= Messaging.sendEmail(new List<messaging.SingleEmailMessage>{ mail });
            system.debug(results);
        } catch (exception e) {
            system.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
    // Leaving these lines in for future use and different use cases
    // private static Id getEmailTemplateId(String emailTemplateDeveloperName) {
    //     List<EmailTemplate> emailTemplates = [SELECT Id FROM EmailTemplate WHERE DeveloperName = :emailTemplateDeveloperName WITH SECURITY_ENFORCED];

    //     if (emailTemplates.size() == 0) {
    //         throw new NoEmailTemplateFoundException(emailTemplateDeveloperName);
    //     }

    //     return emailTemplates[0].Id;
    // }

    // private static Id getSenderAddressesId(String senderAddressName) {
    //     List<OrgWideEmailAddress> senderAddresses = [SELECT Id FROM OrgWideEmailAddress WHERE Address = :senderAddressName WITH SECURITY_ENFORCED];

    //     if (senderAddresses.size() == 0) {
    //         throw new NoSenderAddressesFoundException(senderAddressName);
    //     }

    //     return senderAddresses[0].Id;
    // }

    // private class NoEmailTemplateFoundException extends Exception {
    //     public override String getMessage() {
    //         List<String> args = new List<String>{ super.getMessage() };
    //         return String.format('No email template found with developer name: {0}', args);
    //     }
    // }

    // private class NoSenderAddressesFoundException extends Exception {
    //     public override String getMessage() {
    //         List<String> args = new List<String>{ super.getMessage() };
    //         return String.format('No Org Wide Email Address found with address: {0}', args);
    //     }
    // }
}