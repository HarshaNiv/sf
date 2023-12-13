@isTest
public class oliUpdateCustPriceBookEntry_Test 
{
    private static Account acc;
    private static Account acc2;
    private static Contract con;
    //private static Pricebook2 pb;
    private static Pricebook2 cpb;
    private static Product2 prod;
    private static Product2 prod2;
    private static PricebookEntry pbe;
    private static PricebookEntry pbe2;
    private static PricebookEntry cpbe;
    
    static 
    {    
        //pb = [select Id, isActive from Pricebook2 where Id = :test.getStandardPricebookId()];
        //if (!pb.isActive) 
        //{
        //     pb.isActive = true;
        //     update(pb);
        //}     

        cpb = new Pricebook2();
        cpb.Name = 'cust PB';
        cpb.IsActive = true;
        insert cpb;
        
        prod = new Product2(Name='test product', IsActive=true);  
        prod.Buy_Price__c = 5;
        insert(prod);                            

        prod2 = new Product2(Name='test product2', IsActive=true);   
        prod2.Buy_Price__c = 4;
        prod2.Buy_Price_1__c = 3.9;
        prod2.Volume_1__c = 10;
        prod2.Buy_Price_2__c = 3.8;
        prod2.Volume_2__c = 20;
        prod2.Buy_Price_3__c = 3.7;
        prod2.Volume_3__c = 30;
        prod2.Buy_Price_4__c = 3.6;
        prod2.Volume_4__c = 40;
        prod2.Buy_Price_5__c = 3.5;
        prod2.Volume_5__c = 50;
        prod2.Buy_Price_6__c = 3.4;
        prod2.Volume_6__c = 60;
        prod2.Buy_Price_7__c = 3.3;
        prod2.Volume_7__c = 70;
        prod2.Buy_Price_8__c = 3.2;
        prod2.Volume_8__c = 80;
        prod2.Buy_Price_9__c = 3.1;
        prod2.Volume_9__c = 90;
        prod2.Buy_Price_10__c = 3.0;
        prod2.Volume_10__c = 100;
        insert(prod2);  
        
        pbe = new PricebookEntry(Pricebook2Id=test.getStandardPricebookId(), Product2Id=prod.Id, IsActive=true, UnitPrice=10);
        pbe.Sell_Price_1__c = 9.9;
        pbe.Volume_1__c = 10;
        pbe.Sell_Price_2__c = 9.8;
        pbe.Volume_2__c = 20;
        pbe.Sell_Price_3__c = 9.7;
        pbe.Volume_3__c = 30;
        pbe.Sell_Price_4__c = 9.6;
        pbe.Volume_4__c = 40;
        pbe.Sell_Price_5__c = 9.5;
        pbe.Volume_5__c = 50;
        pbe.Sell_Price_6__c = 9.4;
        pbe.Volume_6__c = 60;
        pbe.Sell_Price_7__c = 9.3;
        pbe.Volume_7__c = 70;
        pbe.Sell_Price_8__c = 9.2;
        pbe.Volume_8__c = 80;
        pbe.Sell_Price_9__c = 9.1;
        pbe.Volume_9__c = 90;
        pbe.Sell_Price_10__c = 9.0;
        pbe.Volume_10__c = 100;
        insert(pbe);                   

        pbe2 = new PricebookEntry(Pricebook2Id=test.getStandardPricebookId(), Product2Id=prod2.Id, IsActive=true, UnitPrice=8);
        pbe2.Sell_Price_1__c = 7.9;
        pbe2.Volume_1__c = 10;
        pbe2.Sell_Price_2__c = 7.8;
        pbe2.Volume_2__c = 20;
        pbe2.Sell_Price_3__c = 7.7;
        pbe2.Volume_3__c = 30;
        pbe2.Sell_Price_4__c = 7.6;
        pbe2.Volume_4__c = 40;
        pbe2.Sell_Price_5__c = 7.5;
        pbe2.Volume_5__c = 50;
        pbe2.Sell_Price_6__c = 7.4;
        pbe2.Volume_6__c = 60;
        pbe2.Sell_Price_7__c = 7.3;
        pbe2.Volume_7__c = 70;
        pbe2.Sell_Price_8__c = 7.2;
        pbe2.Volume_8__c = 80;
        pbe2.Sell_Price_9__c = 7.1;
        pbe2.Volume_9__c = 90;
        pbe2.Sell_Price_10__c = 7.0;
        pbe2.Volume_10__c = 100;
        insert(pbe2);                   
        
        cpbe = new PricebookEntry(Pricebook2Id=cpb.Id, Product2Id=prod.Id, IsActive=true, UnitPrice=9);
        cpbe.Sell_Price_1__c = 8.9;
        cpbe.Volume_1__c = 10;
        cpbe.Sell_Price_2__c = 8.8;
        cpbe.Volume_2__c = 20;
        cpbe.Sell_Price_3__c = 8.7;
        cpbe.Volume_3__c = 30;
        cpbe.Sell_Price_4__c = 8.6;
        cpbe.Volume_4__c = 40;
        cpbe.Sell_Price_5__c = 8.5;
        cpbe.Volume_5__c = 50;
        cpbe.Sell_Price_6__c = 8.4;
        cpbe.Volume_6__c = 60;
        cpbe.Sell_Price_7__c = 8.3;
        cpbe.Volume_7__c = 70;
        cpbe.Sell_Price_8__c = 8.2;
        cpbe.Volume_8__c = 80;
        cpbe.Sell_Price_9__c = 8.1;
        cpbe.Volume_9__c = 90;
        cpbe.Sell_Price_10__c = 8.0;
        cpbe.Volume_10__c = 100;
        insert(cpbe);                   

        acc = new Account(name='test acc');         
        insert(acc);           

        con = new Contract();
        con.AccountId = acc.Id;
        con.Pricebook2Id = cpb.Id;
        con.National_Rebate__c = 'n/a';
        con.Rebate_Scheme_Agreed__c = 'n/a';
        con.Regional_Rebate__c = 'n/a';
        insert(con);
        
		Contact cust = new Contact();
        cust.LastName = 'LN';
        cust.Email = 'email@email.com';
        cust.AccountId = acc.id;
        insert cust;
        
        con.Status = 'Activated';
        con.CompanySignedDate = System.today();
        con.CompanySignedId = System.UserInfo.getUserId();
        con.CustomerSignedDate = System.today();
        con.CustomerSignedId = cust.id;
        con.CustomerSignedTitle = 'Director';
        update con;

        // contract associated directly with account
		acc.Active_Contract__c = con.id;
        update acc;

        // contract associated indirectly with account
        acc2 = new Account(name='test acc2');         
		acc2.Active_Contract__c = con.id;
        insert(acc2);           
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testOppProdWithCustPriceBookEntry() 
    {  
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;
        
        OpportunityLineItem oli = new OpportunityLineItem();
        oli.OpportunityId = opp.id;
        oli.Product2Id = prod.id;
        oli.Quantity = 1;
        oli.UnitPrice = 10;
        insert oli;

        OpportunityLineItem oli_check = [SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM OpportunityLineItem WHERE Id = :oli.id];
        System.assertEquals(9, oli_check.UnitPrice);   
        System.assertEquals(5, oli_check.Cost_Price__c);   
        System.assertEquals(9, oli_check.List_Price__c);          
        System.assertEquals(9, oli_check.TotalPrice);
        System.assertEquals(1, oli_check.Total_Quantity__c);
        System.assertEquals((4.0/9.0)*100, oli_check.Margin__c);
        System.assertEquals(0, oli_check.Effective_Discount__c);
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testOppProdWithCustPriceBookEntryIndirect() 
    {
        // note acc2 - for indirect contract relationship
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc2.Id);
        insert opp;
        
        OpportunityLineItem oli = new OpportunityLineItem();
        oli.OpportunityId = opp.id;
        oli.Product2Id = prod.id;
        oli.Quantity = 1;
        oli.UnitPrice = 10;
        insert oli;

        OpportunityLineItem oli_check = [SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM OpportunityLineItem WHERE Id = :oli.id];
        System.assertEquals(9, oli_check.UnitPrice);   
        System.assertEquals(5, oli_check.Cost_Price__c);   
        System.assertEquals(9, oli_check.List_Price__c);          
        System.assertEquals(9, oli_check.TotalPrice);
        System.assertEquals(1, oli_check.Total_Quantity__c);
        System.assertEquals((4.0/9.0)*100, oli_check.Margin__c);
        System.assertEquals(0, oli_check.Effective_Discount__c);
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testOppProdWithCustPriceBookEntryPriceBreaks() 
    {  
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;
        
        // insert line items with different quantities...
        List<OpportunityLineItem> olis = new List<OpportunityLineItem>();
        Integer x = 1;
        for(x=1; x<11; x++)
        {
            OpportunityLineItem oli = new OpportunityLineItem();
            oli.OpportunityId = opp.id;
            oli.Product2Id = prod.id;
            oli.Quantity = (x*10);
            oli.UnitPrice = 9-(0.1*x);
            olis.add(oli);
        }
        insert olis;

        // get ids
        List<Id> oliIds = new List<Id>();
        for(OpportunityLineItem oli :olis)
            oliIds.add(oli.id);
        
        // check results
        Map<Id,OpportunityLineItem> oli_check = new Map<Id,OpportunityLineItem>([SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM OpportunityLineItem WHERE Id in :oliIds]);
        for(x=1; x<11; x++)
        {
            System.assertEquals(9-(0.1*x), oli_check.get(olis[x-1].Id).UnitPrice);     
            System.assertEquals(9-(0.1*x), oli_check.get(olis[x-1].Id).List_Price__c); 
        }
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testOppProdWithCustPriceBookNoEntry() 
    {  
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;
        
        OpportunityLineItem oli = new OpportunityLineItem();
        oli.OpportunityId = opp.id;
        oli.Product2Id = prod2.id;
        oli.FOC_Quantity__c = 1;
        oli.Quantity = 1;
        oli.UnitPrice = 8;
        insert oli;

        OpportunityLineItem oli_check = [SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM OpportunityLineItem WHERE Id = :oli.id];
        System.assertEquals(8, oli_check.UnitPrice);   
        System.assertEquals(4, oli_check.Cost_Price__c);   
        System.assertEquals(8, oli_check.List_Price__c);          
        System.assertEquals(8, oli_check.TotalPrice);
        System.assertEquals(2, oli_check.Total_Quantity__c);
        System.assertEquals(0, oli_check.Margin__c);
        System.assertEquals(50, oli_check.Effective_Discount__c);
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testOppProdWithCustPriceBookNoEntryPriceBreaks() 
    {  
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;
        
        // insert line items with different quantities...
        List<OpportunityLineItem> olis = new List<OpportunityLineItem>();
        Integer x = 1;
        for(x=1; x<11; x++)
        {
            OpportunityLineItem oli = new OpportunityLineItem();
            oli.OpportunityId = opp.id;
            oli.Product2Id = prod2.id;
            oli.Quantity = (x*10);
            oli.UnitPrice = 8-(0.1*x);
            olis.add(oli);
        }
        insert olis;

        // get ids
        List<Id> oliIds = new List<Id>();
        for(OpportunityLineItem oli :olis)
            oliIds.add(oli.id);
        
        // check results
        Map<Id,OpportunityLineItem> oli_check = new Map<Id,OpportunityLineItem>([SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM OpportunityLineItem WHERE Id in :oliIds]);
        for(x=1; x<11; x++)
        {
            System.assertEquals(8-(0.1*x), oli_check.get(olis[x-1].Id).UnitPrice);     
            System.assertEquals(8-(0.1*x), oli_check.get(olis[x-1].Id).List_Price__c);
            System.assertEquals(4-(0.1*x), oli_check.get(olis[x-1].Id).Cost_Price__c);  // also verify the cost price breaks
        }
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testQuoteProdWithCustPriceBookEntry() 
    {  
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;

        Quote qt = new Quote(Name='test quote', OpportunityId=opp.Id, PriceBook2Id=test.getStandardPricebookId());
        insert qt;
        
        QuoteLineItem qli = new QuoteLineItem();
        qli.QuoteId = qt.id;
        qli.Product2Id = prod.id;
        qli.PricebookEntryId = pbe.id;
        qli.Quantity = 1;
        qli.UnitPrice = 10;
        insert qli;

        QuoteLineItem qli_check = [SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM QuoteLineItem WHERE Id = :qli.id];
        System.assertEquals(9, qli_check.UnitPrice);   
        System.assertEquals(5, qli_check.Cost_Price__c);   
        System.assertEquals(9, qli_check.List_Price__c);          
        System.assertEquals(9, qli_check.TotalPrice);
        System.assertEquals(1, qli_check.Total_Quantity__c);
        System.assertEquals((4.0/9.0)*100, qli_check.Margin__c);
        System.assertEquals(0, qli_check.Effective_Discount__c);
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testQuoteProdWithCustPriceBookEntryIndirect() 
    {  
        // note acc2 - for indirect contract relationship
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc2.Id);
        insert opp;

        Quote qt = new Quote(Name='test quote', OpportunityId=opp.Id, PriceBook2Id=test.getStandardPricebookId());
        insert qt;
        
        QuoteLineItem qli = new QuoteLineItem();
        qli.QuoteId = qt.id;
        qli.Product2Id = prod.id;
        qli.PricebookEntryId = pbe.id;
        qli.Quantity = 1;
        qli.UnitPrice = 10;
        insert qli;

        QuoteLineItem qli_check = [SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM QuoteLineItem WHERE Id = :qli.id];
        System.assertEquals(9, qli_check.UnitPrice);   
        System.assertEquals(5, qli_check.Cost_Price__c);   
        System.assertEquals(9, qli_check.List_Price__c);          
        System.assertEquals(9, qli_check.TotalPrice);
        System.assertEquals(1, qli_check.Total_Quantity__c);
        System.assertEquals((4.0/9.0)*100, qli_check.Margin__c);
        System.assertEquals(0, qli_check.Effective_Discount__c);
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testQuoteProdWithCustPriceBookEntryPriceBreaks() 
    {  
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;

        Quote qt = new Quote(Name='test quote', OpportunityId=opp.Id, PriceBook2Id=test.getStandardPricebookId());
        insert qt;
                
        // insert line items with different quantities...
        List<QuoteLineItem> qlis = new List<QuoteLineItem>();
        Integer x = 1;
        for(x=1; x<11; x++)
        {
            QuoteLineItem qli = new QuoteLineItem();
            qli.QuoteId = qt.id;
            qli.Product2Id = prod.id;
            qli.PricebookEntryId = pbe.id;
            qli.Quantity = (x*10);
            qli.UnitPrice = 9-(0.1*x);
            qlis.add(qli);
        }
        insert qlis;

        // get ids
        List<Id> qliIds = new List<Id>();
        for(QuoteLineItem qli :qlis)
            qliIds.add(qli.id);
        
        // check results
        Map<Id,QuoteLineItem> qli_check = new Map<Id,QuoteLineItem>([SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM QuoteLineItem WHERE Id in :qliIds]);
        for(x=1; x<11; x++)
        {
            System.assertEquals(9-(0.1*x), qli_check.get(qlis[x-1].Id).UnitPrice);     
            System.assertEquals(9-(0.1*x), qli_check.get(qlis[x-1].Id).List_Price__c); 
        }
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testQuoteProdWithCustPriceBookNoEntry() 
    {  
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;

        Quote qt = new Quote(Name='test quote', OpportunityId=opp.Id, PriceBook2Id=test.getStandardPricebookId());
        insert qt;
                
        QuoteLineItem qli = new QuoteLineItem();
        qli.QuoteId = qt.id;
        qli.Product2Id = prod2.id;
        qli.PricebookEntryId = pbe2.id;
        qli.FOC_Quantity__c = 1;
        qli.Quantity = 1;
        qli.UnitPrice = 8;
        insert qli;

        QuoteLineItem qli_check = [SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM QuoteLineItem WHERE Id = :qli.id];
        System.assertEquals(8, qli_check.UnitPrice);   
        System.assertEquals(4, qli_check.Cost_Price__c);   
        System.assertEquals(8, qli_check.List_Price__c);          
        System.assertEquals(8, qli_check.TotalPrice);
        System.assertEquals(2, qli_check.Total_Quantity__c);
        System.assertEquals(0, qli_check.Margin__c);
        System.assertEquals(50, qli_check.Effective_Discount__c);
    }

    
    //////////////////////////////////////////////////////////////////////////////////////////
    static testMethod void testQuoteProdWithCustPriceBookNoEntryPriceBreaks() 
    {  
        Opportunity opp = new Opportunity(Name='test opp', Amount=100, StageName='Prospecting', CloseDate=System.today(), Pricebook2Id=test.getStandardPricebookId(), AccountId=acc.Id);
        insert opp;

        Quote qt = new Quote(Name='test quote', OpportunityId=opp.Id, PriceBook2Id=test.getStandardPricebookId());
        insert qt;
                
        // insert line items with different quantities...
        List<QuoteLineItem> qlis = new List<QuoteLineItem>();
        Integer x = 1;
        for(x=1; x<11; x++)
        {
            QuoteLineItem qli = new QuoteLineItem();
            qli.QuoteId = qt.id;
            qli.Product2Id = prod2.id;
            qli.PricebookEntryId = pbe2.id;
            qli.Quantity = (x*10);
            qli.UnitPrice = 8-(0.1*x);
            qlis.add(qli);
        }
        insert qlis;

        // get ids
        List<Id> qliIds = new List<Id>();
        for(QuoteLineItem qli :qlis)
            qliIds.add(qli.id);
        
        // check results
        Map<Id,QuoteLineItem> qli_check = new Map<Id,QuoteLineItem>([SELECT List_Price__c, UnitPrice, TotalPrice, Total_Quantity__c, Cost_Price__c, Margin__c, Effective_Discount__c FROM QuoteLineItem WHERE Id in :qliIds]);
        for(x=1; x<11; x++)
        {
            System.assertEquals(8-(0.1*x), qli_check.get(qlis[x-1].Id).UnitPrice);     
            System.assertEquals(8-(0.1*x), qli_check.get(qlis[x-1].Id).List_Price__c);
            System.assertEquals(4-(0.1*x), qli_check.get(qlis[x-1].Id).Cost_Price__c);  // also verify the cost price breaks
        }
    }

}