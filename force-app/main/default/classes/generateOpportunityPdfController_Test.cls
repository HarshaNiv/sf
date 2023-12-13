@isTest
private class generateOpportunityPdfController_Test
{
    static testMethod void test1()
    {
        // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;

        Opportunity op = new Opportunity(Name = 'test', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id);
        op.Quote_Type__c = 'Proforma';
        op.Quote_Billing_City__c = 'Somewhere';
        op.Quote_Billing_Post_Code__c = 'postcode';
        op.Quote_Shipping_City__c = 'Somewhere';
        op.Quote_Shipping_Post_Code__c = 'postcode';
        insert op;

        PageReference pageRef = Page.generateOpportunityPdf;
        Test.setCurrentPage(pageRef);
        pageRef.getParameters().put('id', String.valueOf(op.Id));
        ApexPages.StandardController sc = new ApexPages.StandardController(op);
        generateOpportunityPdfController controller = new generateOpportunityPdfController(sc);
        String nextPage = controller.autoRun().getUrl();

        ApexPages.StandardController sc2 = new ApexPages.StandardController(op);
        generateOpportunityPdfController controller2 = new generateOpportunityPdfController(sc);
        String nextPage2 = controller.autoRun().getUrl();
    }

    static testMethod void test2()
    {
        // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;

        Opportunity op = new Opportunity(Name = 'test', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id);
        op.Quote_Type__c = 'Proforma';
        op.Quote_Billing_City__c = 'Somewhere';
        op.Quote_Billing_Post_Code__c = 'postcode';
        op.Quote_Shipping_City__c = 'Somewhere';
        op.Quote_Shipping_Post_Code__c = 'postcode';
        insert op;

        PageReference pageRef = Page.generateOpportunityPdf;
        Test.setCurrentPage(pageRef);
        pageRef.getParameters().put('id', String.valueOf(op.Id));
        ApexPages.StandardController sc = new ApexPages.StandardController(op);
        generateOpportunityPdfController controller = new generateOpportunityPdfController(sc);
        String nextPage = controller.autoRun().getUrl();

        ApexPages.StandardController sc2 = new ApexPages.StandardController(op);
        generateOpportunityPdfController controller2 = new generateOpportunityPdfController(sc);
        String nextPage2 = controller.autoRun().getUrl();
    }

    static testMethod void test3_opportunityController()
    {
        // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;

        Opportunity op = new Opportunity(Name = 'test', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id);
        op.Pricebook2Id = Test.getStandardPricebookId();
        op.Quote_Type__c = 'Proforma';
        op.Quote_Billing_City__c = 'Somewhere';
        op.Quote_Billing_Post_Code__c = 'postcode';
        op.Quote_Shipping_City__c = 'Somewhere';
        op.Quote_Shipping_Post_Code__c = 'postcode';
        insert op;

        Product2 prod = new Product2();
        prod.IsActive = true;
        prod.Name = 'test';
        prod.Buy_Price__c = 0.5;
        insert prod;

        PricebookEntry pe = new PricebookEntry();
        pe.IsActive = true;
        pe.Product2Id = prod.id;
        pe.UnitPrice = 3;
        pe.Pricebook2Id = Test.getStandardPricebookId();
        insert pe;

        OpportunityLineItem oli = new OpportunityLineItem();
        oli.Cost_Price__c = 1;
        oli.Description = 'desc';
        oli.Discount = 0;
        oli.FOC_Quantity__c = 0;
        oli.OpportunityId = op.id;
        oli.Product2Id = prod.id;
        oli.Quantity = 2;
        oli.UnitPrice = 1;
        oli.PricebookEntryId = pe.Id;
        insert oli;

        PageReference pageRef = Page.generateOpportunityPdf;
        Test.setCurrentPage(pageRef);
        pageRef.getParameters().put('id', String.valueOf(op.Id));
        ApexPages.StandardController sc = new ApexPages.StandardController(op);
        generateOpportunityPdfController controller = new generateOpportunityPdfController(sc);
        String nextPage = controller.autoRun().getUrl();

        //ApexPages.StandardController sc2 = new ApexPages.StandardController(op);
        //generateQuotePdfController controller2 = new generateQuotePdfController(sc2);
        //String nextPage2 = controller.autoRun().getUrl();
    }

    static testMethod void test4_QuotePDF()
    {
        // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;

        Opportunity op = new Opportunity(Name = 'test', StageName = 'Qualification', CloseDate = Date.today(), AccountId = acc.id);
        op.Quote_Type__c = 'Proforma';
        op.Quote_Billing_City__c = 'Somewhere';
        op.Quote_Billing_Post_Code__c = 'postcode';
        op.Quote_Shipping_City__c = 'Somewhere';
        op.Quote_Shipping_Post_Code__c = 'postcode';
        insert op;

        PageReference pageRef = Page.generateOpportunityPdf;
        Test.setCurrentPage(pageRef);
        pageRef.getParameters().put('id', String.valueOf(op.Id));
        ApexPages.StandardController sc = new ApexPages.StandardController(op);
        opportunityControllerExtension controller = new opportunityControllerExtension(sc);
    }

}