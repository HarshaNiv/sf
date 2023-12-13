/**
 * @description       :
 * @author            : Jonny Harte
 * @group             :
 * @last modified on  : 02-03-2021
 * @last modified by  : Jonny Harte
 * Modifications Log
 * Ver   Date         Author        Modification
 * 1.0   04-02-2021   Jonny Harte   Initial Version
 **/
@isTest
private with sharing class CreatePdfModalControllerTest {
   @testSetup
    static void setup() {
        Account acc = new Account(Name = 'test');
        insert acc;
            
        Opportunity op = new Opportunity(Name = 'test', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id);  //, Email_Address__c='test@test.invalid'
        op.Pricebook2Id = Test.getStandardPricebookId();
        insert op;
  
        
        Product2 prod = new Product2();
        prod.IsActive = true;
        prod.Name = 'test';
        //prod.Buy_Price__c = 0.5;
        insert prod;
        
        PricebookEntry pe = new PricebookEntry();
        pe.IsActive = true;
        pe.Product2Id = prod.id;
        pe.UnitPrice = 3;
        pe.Pricebook2Id = Test.getStandardPricebookId();
        insert pe;
        
        OpportunityLineItem oli = new OpportunityLineItem();
        oli.Description = 'desc';
        oli.Discount = 0;

        oli.OpportunityId = op.id;
        oli.Product2Id = prod.id;
        oli.Quantity = 2;
        oli.UnitPrice = 1;
        oli.PricebookEntryId = pe.Id;
        insert oli;
        
        Quote qt = new Quote();
        qt.Name = 'test';
        //qt.Quote_Type__c = 'Proforma';
        qt.OpportunityId = op.id;
        qt.Pricebook2Id = Test.getStandardPricebookId();
        insert qt;
    }

    @isTest
    static void createNewPdfTest() {
        Opportunity opp = [SELECT Id, Name FROM Opportunity LIMIT 1];

        Test.startTest();
        CreatePdfModalController.createPdf(opp.Id, 'OpportunityPDF');
        Test.stopTest();

        System.assertEquals(
            1,
            [SELECT COUNT() FROM ContentDocumentLink WHERE LinkedEntityId = :opp.Id AND ContentDocumentId IN (SELECT Id FROM ContentDocument WHERE Title = :opp.Name)],
            'Document hasn\'t be created'
        );
    }

    @isTest
    static void createNewPdfVersionTest() {
        Opportunity opp = [SELECT Id, Name FROM Opportunity LIMIT 1];

        Test.startTest();
        CreatePdfModalController.createPdf(opp.Id, 'OpportunityPDF');
        CreatePdfModalController.createPdf(opp.Id, 'OpportunityPDF');
        Test.stopTest();

        System.assertEquals(
            1,
            [SELECT COUNT() FROM ContentDocumentLink WHERE LinkedEntityId = :opp.Id AND ContentDocumentId IN (SELECT Id FROM ContentDocument WHERE Title = :opp.Name)],
            'Document hasn\'t be created'
        );
    }

    @isTest
    static void sendPdfEmailTest() {
        Opportunity opp = [SELECT Id, Name FROM Opportunity LIMIT 1];  //,Email_Address__c

        Test.startTest();
            Id docId = CreatePdfModalController.createPdf(opp.Id, 'OpportunityPDF');
            CreatePdfModalController.sendPdf(opp.id, 'diane.baker@sunpower-uk.com',  new List<String>{ docId });  //opp.Email_Address__c
            Integer invocations = Limits.getEmailInvocations();
        Test.stopTest();

                System.assertEquals(1, invocations, 'An email has not been sent');
    }
}