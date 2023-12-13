@IsTest
public class contractControllerExtension_Test {
    
    static testMethod void test()
    {
        // Perform our data preparation.
        Account acc = new Account(Name = 'test');
        insert acc;
            
		Contract cont = new Contract();
        cont.AccountId = acc.id;
        cont.Trading_Terms__c = '30 Days End of Month 1.5%/15';
        cont.Prompt_Payment_Discount__c = '1.5% PPD applies as per trade agreement';
        insert cont;
        
        PageReference pageRef = Page.contractPDF;
        Test.setCurrentPage(pageRef);
        pageRef.getParameters().put('id', String.valueOf(cont.Id));
        ApexPages.StandardController sc = new ApexPages.StandardController(cont);
        contractControllerExtension controller = new contractControllerExtension(sc);
        //String nextPage = controller.autoRun().getUrl();
        
        //ApexPages.StandardController sc2 = new ApexPages.StandardController(op);
        //generateQuotePdfController controller2 = new generateQuotePdfController(sc2);
        //String nextPage2 = controller.autoRun().getUrl();
    }
    

}