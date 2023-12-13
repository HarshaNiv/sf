@isTest
public class SalesOrderControllerExtension_Test 
{
	@isTest static void test() 
    {
        Account acc = new Account(Name='account test');
        insert acc;
        
        Opportunity op = new Opportunity(name='opportunity test', CloseDate=System.today()+12, StageName = 'Closed Won', Accountid = acc.id, Order_Generated__c = true, Customer_PO__c = '1234', Shipping_Method__c = 'Sameday');
        insert op;
        
        Sales_Order__c so = new Sales_Order__c();
        so.Account__c = acc.id;
        so.End_Date__c = System.today();
		insert so;
        
        Sales_Order_Line_item__c soli = new Sales_Order_Line_item__c();
        soli.Sales_Order__c = so.id;
        soli.Quantity__c = 1;
        soli.Sales_Price__c = 1;
        insert soli;
                
        Test.startTest();
        PageReference pageRef = Page.SalesOrderProducts;
        pageRef.getParameters().put('id', String.valueOf(so.Id));
        Test.setCurrentPage(pageRef);
        
         ApexPages.StandardController sc = new ApexPages.StandardController(so);
         SalesOrderControllerExtension con = new SalesOrderControllerExtension(sc); 
         
        // call methods
        con.getSortDirection();
        con.ViewData();
        con.newLine();
        con.editLines();
        con.cancelEdit();
        con.saveLines();
        con.selectedLineDel = soli.id;
        con.deleteLine();
        
        test.stopTest();        
    }   
}