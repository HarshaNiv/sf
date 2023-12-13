public class oliUpdateCustPriceBookEntry 
{

    /////////////////////////////////////////////////////////////////////////////////
    // Update Line Item with Customer Pricebook Entry (R.P.Grigorian Jan'18)
    /////////////////////////////////////////////////////////////////////////////////

    static public void updateOliPrices(List<OpportunityLineItem> oliList)
    {
        System.assert(!oliList.isEmpty());  // should never be empty!
        
        // get info from line items
        List<Id> productIdList = new List<Id>();
        Set<Id> OppIds = new Set<Id>();
        Set<Id> pbeIds = new Set<Id>();
        Set<String> ccs = new Set<String>();
        for (OpportunityLineItem oli: oliList)
        {
            // collect information from olis
            productIdList.Add(oli.Product2Id);
            pbeIds.Add(oli.PricebookEntryId);
            OppIds.Add(oli.OpportunityId);
            ccs.Add(oli.CurrencyIsoCode);
        }
        System.assert(!productIdList.isEmpty());  // should never be empty!
        
        // get products
        Map<Id,Product2> productIds = new Map<Id,Product2>([SELECT Id, Name, ProductCode,
                                        Buy_Price__c, 
                                        Buy_Price_1__c,
                                        Buy_Price_2__c,
                                        Buy_Price_3__c,
                                        Buy_Price_4__c,
                                        Buy_Price_5__c,
                                        Buy_Price_6__c,
                                        Buy_Price_7__c,
                                        Buy_Price_8__c,
                                        Buy_Price_9__c,
                                        Buy_Price_10__c,
                                        Volume_1__c,
                                        Volume_2__c,                                        
                                        Volume_3__c,                                        
                                        Volume_4__c,                                        
                                        Volume_5__c,                                        
                                        Volume_6__c,                                        
                                        Volume_7__c,                                        
                                        Volume_8__c,                                        
                                        Volume_9__c,                                        
                                        Volume_10__c                                        
                                       FROM product2 
                                       WHERE Id in :productIdList]);
        System.assert(!productIds.isEmpty());  // should never be empty!
        
        // get pbs
        List<Account> accs = [SELECT Id, Active_Contract__r.PriceBook2Id FROM Account WHERE Id in (SELECT AccountId FROM Opportunity WHERE ID in :OppIds) AND Active_Contract__c != null];
        Map<Id,Id> pbs = new Map<Id,Id>();
        for(Account acc :accs)
            pbs.put(acc.Active_Contract__r.PriceBook2Id,acc.Id);

        
        // get cpbes (customer special pricebook)
        List<PriceBookEntry> cpbes = [
            SELECT Id,
                Product2Id, 
                Name,
                ProductCode,
                UnitPrice,
                Pricebook2Id,
                CurrencyIsoCode,
                Volume_1__c, Sell_Price_1__c,
                Volume_2__c, Sell_Price_2__c,
                Volume_3__c, Sell_Price_3__c,
                Volume_4__c, Sell_Price_4__c,
                Volume_5__c, Sell_Price_5__c,
                Volume_6__c, Sell_Price_6__c,
                Volume_7__c, Sell_Price_7__c,
                Volume_8__c, Sell_Price_8__c,
                Volume_9__c, Sell_Price_9__c,
                Volume_10__c, Sell_Price_10__c
            FROM PriceBookEntry 
            WHERE CurrencyIsoCode in :ccs AND 
                PriceBook2Id in :pbs.keySet() AND 
                Product2Id in :productIdList AND
                IsActive = true];
    
        // get pbes (opportunity pricebook - should always be standard procebook)
        Map<Id,PriceBookEntry> pbes = new Map<Id,PricebookEntry>([
            SELECT Id,
                Product2Id, 
                Name,
                ProductCode,
                UnitPrice,
                Pricebook2Id,
                CurrencyIsoCode,
                Volume_1__c, Sell_Price_1__c,
                Volume_2__c, Sell_Price_2__c,
                Volume_3__c, Sell_Price_3__c,
                Volume_4__c, Sell_Price_4__c,
                Volume_5__c, Sell_Price_5__c,
                Volume_6__c, Sell_Price_6__c,
                Volume_7__c, Sell_Price_7__c,
                Volume_8__c, Sell_Price_8__c,
                Volume_9__c, Sell_Price_9__c,
                Volume_10__c, Sell_Price_10__c
            FROM PriceBookEntry 
            WHERE Id in :pbeIds]);

        // work through all OpportunityLineItems making pricing updates...
        List<OpportunityLineItem> updateList = new List<OpportunityLineItem>();
        for (OpportunityLineItem oliIterator: oliList)
        {
            // get a writable version of the oli record...
            OpportunityLineItem oli = new OpportunityLineItem();
            oli.id = oliIterator.id;
            oli.UnitPrice = oliIterator.UnitPrice;
            oli.Quantity = oliIterator.Quantity;
            oli.FOC_Quantity__c = oliIterator.FOC_Quantity__c;
            oli.Total_Cost__c = oliIterator.Total_Cost__c;
            oli.TotalPrice = oliIterator.TotalPrice;
            oli.Discount = oliIterator.Discount;
            oli.isClone__c = False;  // clear clone flag
            
            // get product
            Product2 oliProd = productIds.get(oliIterator.Product2Id);
            System.assert(oliProd != null); // should never be null!
            
            // get cost price according to quantity...
            if(oliProd.Volume_1__c == null || oliProd.Buy_Price_1__c == null || oliIterator.Quantity < oliProd.Volume_1__c)
                oli.Cost_Price__c = oliProd.Buy_Price__c; 
            else if(oliProd.Volume_2__c == null || oliProd.Buy_Price_2__c == null || oliIterator.Quantity < oliProd.Volume_2__c)
                oli.Cost_Price__c = oliProd.Buy_Price_1__c;
            else if(oliProd.Volume_3__c == null || oliProd.Buy_Price_3__c == null || oliIterator.Quantity < oliProd.Volume_3__c)
                oli.Cost_Price__c = oliProd.Buy_Price_2__c;
            else if(oliProd.Volume_4__c == null || oliProd.Buy_Price_4__c == null || oliIterator.Quantity < oliProd.Volume_4__c)
                oli.Cost_Price__c = oliProd.Buy_Price_3__c;
            else if(oliProd.Volume_5__c == null || oliProd.Buy_Price_5__c == null || oliIterator.Quantity < oliProd.Volume_5__c)
                oli.Cost_Price__c = oliProd.Buy_Price_4__c;
            else if(oliProd.Volume_6__c == null || oliProd.Buy_Price_6__c == null || oliIterator.Quantity < oliProd.Volume_6__c)
                oli.Cost_Price__c = oliProd.Buy_Price_5__c;
            else if(oliProd.Volume_7__c == null || oliProd.Buy_Price_7__c == null || oliIterator.Quantity < oliProd.Volume_7__c)
                oli.Cost_Price__c = oliProd.Buy_Price_6__c;
            else if(oliProd.Volume_8__c == null || oliProd.Buy_Price_8__c == null || oliIterator.Quantity < oliProd.Volume_8__c)
                oli.Cost_Price__c = oliProd.Buy_Price_7__c;
            else if(oliProd.Volume_9__c == null || oliProd.Buy_Price_9__c == null || oliIterator.Quantity < oliProd.Volume_9__c)
                oli.Cost_Price__c = oliProd.Buy_Price_8__c;
            else if(oliProd.Volume_10__c == null || oliProd.Buy_Price_10__c == null || oliIterator.Quantity < oliProd.Volume_10__c)
                oli.Cost_Price__c = oliProd.Buy_Price_9__c;
            else
                oli.Cost_Price__c = oliProd.Buy_Price_10__c;

            // get list price according to quantity...
            PriceBookEntry oli_pbe = pbes.get(oliIterator.PricebookEntryId);
            if(oli_pbe.Volume_1__c == null || oli_pbe.Sell_Price_1__c == null || oliIterator.Quantity < oli_pbe.Volume_1__c)
                oli.List_Price__c = oli_pbe.UnitPrice; 
            else if(oli_pbe.Volume_2__c == null || oli_pbe.Sell_Price_2__c == null || oliIterator.Quantity < oli_pbe.Volume_2__c)
                oli.List_Price__c = oli_pbe.Sell_Price_1__c;
            else if(oli_pbe.Volume_3__c == null || oli_pbe.Sell_Price_3__c == null || oliIterator.Quantity < oli_pbe.Volume_3__c)
                oli.List_Price__c = oli_pbe.Sell_Price_2__c;
            else if(oli_pbe.Volume_4__c == null || oli_pbe.Sell_Price_4__c == null || oliIterator.Quantity < oli_pbe.Volume_4__c)
                oli.List_Price__c = oli_pbe.Sell_Price_3__c;
            else if(oli_pbe.Volume_5__c == null || oli_pbe.Sell_Price_5__c == null || oliIterator.Quantity < oli_pbe.Volume_5__c)
                oli.List_Price__c = oli_pbe.Sell_Price_4__c;
            else if(oli_pbe.Volume_6__c == null || oli_pbe.Sell_Price_6__c == null || oliIterator.Quantity < oli_pbe.Volume_6__c)
                oli.List_Price__c = oli_pbe.Sell_Price_5__c;
            else if(oli_pbe.Volume_7__c == null || oli_pbe.Sell_Price_7__c == null || oliIterator.Quantity < oli_pbe.Volume_7__c)
                oli.List_Price__c = oli_pbe.Sell_Price_6__c;
            else if(oli_pbe.Volume_8__c == null || oli_pbe.Sell_Price_8__c == null || oliIterator.Quantity < oli_pbe.Volume_8__c)
                oli.List_Price__c = oli_pbe.Sell_Price_7__c;
            else if(oli_pbe.Volume_9__c == null || oli_pbe.Sell_Price_9__c == null || oliIterator.Quantity < oli_pbe.Volume_9__c)
                oli.List_Price__c = oli_pbe.Sell_Price_8__c;
            else if(oli_pbe.Volume_10__c == null || oli_pbe.Sell_Price_10__c == null || oliIterator.Quantity < oli_pbe.Volume_10__c)
                oli.List_Price__c = oli_pbe.Sell_Price_9__c;
            else
                oli.List_Price__c = oli_pbe.Sell_Price_10__c;

            // each price book entry...
            for(PriceBookEntry pbe :cpbes)
            {
                // check for a match
                if(oliIterator.CurrencyIsoCode == pbe.CurrencyIsoCode &&
                   oliIterator.Product2Id == pbe.Product2Id &&
                   oliIterator.AccountId__c == pbs.get(pbe.PriceBook2Id))
                {
                    // Found entry, update pricing...
                    oli.Customer_Pricebook_Entry_ID__c = pbe.Id;
                    
                    // update list price according to quantity...
                    if(pbe.Volume_1__c == null || pbe.Sell_Price_1__c == null || oliIterator.Quantity < pbe.Volume_1__c)
                        oli.List_Price__c = pbe.UnitPrice; 
                    else if(pbe.Volume_2__c == null || pbe.Sell_Price_2__c == null || oliIterator.Quantity < pbe.Volume_2__c)
                        oli.List_Price__c = pbe.Sell_Price_1__c;
                    else if(pbe.Volume_3__c == null || pbe.Sell_Price_3__c == null || oliIterator.Quantity < pbe.Volume_3__c)
                        oli.List_Price__c = pbe.Sell_Price_2__c;
                    else if(pbe.Volume_4__c == null || pbe.Sell_Price_4__c == null || oliIterator.Quantity < pbe.Volume_4__c)
                        oli.List_Price__c = pbe.Sell_Price_3__c;
                    else if(pbe.Volume_5__c == null || pbe.Sell_Price_5__c == null || oliIterator.Quantity < pbe.Volume_5__c)
                        oli.List_Price__c = pbe.Sell_Price_4__c;
                    else if(pbe.Volume_6__c == null || pbe.Sell_Price_6__c == null || oliIterator.Quantity < pbe.Volume_6__c)
                        oli.List_Price__c = pbe.Sell_Price_5__c;
                    else if(pbe.Volume_7__c == null || pbe.Sell_Price_7__c == null || oliIterator.Quantity < pbe.Volume_7__c)
                        oli.List_Price__c = pbe.Sell_Price_6__c;
                    else if(pbe.Volume_8__c == null || pbe.Sell_Price_8__c == null || oliIterator.Quantity < pbe.Volume_8__c)
                        oli.List_Price__c = pbe.Sell_Price_7__c;
                    else if(pbe.Volume_9__c == null || pbe.Sell_Price_9__c == null || oliIterator.Quantity < pbe.Volume_9__c)
                        oli.List_Price__c = pbe.Sell_Price_8__c;
                    else if(pbe.Volume_10__c == null || pbe.Sell_Price_10__c == null || oliIterator.Quantity < pbe.Volume_10__c)
                        oli.List_Price__c = pbe.Sell_Price_9__c;
                    else
                        oli.List_Price__c = pbe.Sell_Price_10__c;                    
                }
            }

            // only update the list unit price if it is following the list price...
            if((oliIterator.UnitPrice == oliIterator.List_Price__c || oliIterator.List_Price__c == null) 
               && !oliIterator.isClone__c)   // if cloning leave the original price
                oli.UnitPrice = oli.List_Price__c;
        
            // update totals...
            Double vDiscount = 0;
            if(oli.Discount != null)
               	vDiscount = oli.Discount/100;
            Double vTotalPrice = oli.UnitPrice * oli.Quantity * (1-vDiscount);
            if(oli.FOC_Quantity__c != null)
                oli.Total_Quantity__c = oli.Quantity + oli.FOC_Quantity__c;
            else
                oli.Total_Quantity__c = oli.Quantity;
            oli.Total_Cost__c = null;
            oli.Margin__c = null;
            if(oli.Cost_Price__c != null)
            {
                oli.Total_Cost__c = oli.Cost_Price__c * oli.Total_Quantity__c;
                if(vTotalPrice != 0)
                    oli.Margin__c = ((vTotalPrice - oli.Total_Cost__c) / vTotalPrice) * 100;
            }
            oli.Effective_Discount__c = null;
            oli.Total_List_Value__c = null;
            if(oli.List_Price__c != null && oli.Total_Quantity__c != null && vTotalPrice != null && oli.List_Price__c != 0 && oli.Total_Quantity__c != 0)
            {
                oli.Effective_Discount__c = (((oli.List_Price__c * oli.Total_Quantity__c) - vTotalPrice) / (oli.List_Price__c * oli.Total_Quantity__c))* 100;
                oli.Total_List_Value__c = oli.List_Price__c * oli.Total_Quantity__c;
            }          
            
            // add to update list
            oli.SkipValidationRules__c = true;   // skip validation rules...
            updateList.add(oli);
        }
        
        // do update, disabling impacted triggers!
        TriggerStopper.stopOpp = true;
        TriggerStopper.stopQuote = true;        
        TriggerStopper.stopOppLine = true;        
        TriggerStopper.stopQuoteLine = true; 
        Update updateList;
        TriggerStopper.stopOpp = false;
        TriggerStopper.stopQuote = false;         
        TriggerStopper.stopOppLine = false;          
        TriggerStopper.stopQuoteLine = false; 
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    static public void updateQliPrices(List<QuoteLineItem> qliList)
    {
        System.assert(!qliList.isEmpty());  // should never be empty!
        
        // get info from line items
        List<Id> productIdList = new List<Id>();
        Set<Id> QtIds = new Set<Id>();
        Set<Id> pbeIds = new Set<Id>();
        Set<String> ccs = new Set<String>();
        for (QuoteLineItem qli: qliList)
        {
            // collect information from olis
            productIdList.Add(qli.Product2Id);
            pbeIds.Add(qli.PricebookEntryId);
            QtIds.Add(qli.QuoteId);
            ccs.Add(qli.CurrencyIsoCode);
        }
        System.assert(!productIdList.isEmpty());  // should never be empty!
        
        // get products
        Map<Id,Product2> productIds = new Map<Id,Product2>([SELECT Id, Name, ProductCode,
                                        Buy_Price__c, 
                                        Buy_Price_1__c,
                                        Buy_Price_2__c,
                                        Buy_Price_3__c,
                                        Buy_Price_4__c,
                                        Buy_Price_5__c,
                                        Buy_Price_6__c,
                                        Buy_Price_7__c,
                                        Buy_Price_8__c,
                                        Buy_Price_9__c,
                                        Buy_Price_10__c,
                                        Volume_1__c,
                                        Volume_2__c,                                        
                                        Volume_3__c,                                        
                                        Volume_4__c,                                        
                                        Volume_5__c,                                        
                                        Volume_6__c,                                        
                                        Volume_7__c,                                        
                                        Volume_8__c,                                        
                                        Volume_9__c,                                        
                                        Volume_10__c                                        
                                       FROM product2 
                                       WHERE Id in :productIdList]);
        System.assert(!productIds.isEmpty());  // should never be empty!
        
        // get pbs...
        List<Account> accs = [SELECT Id, Active_Contract__r.PriceBook2Id FROM Account WHERE Id in (SELECT AccountId FROM Quote WHERE ID in :QtIds) AND Active_Contract__c != null];
        Map<Id,Id> pbs = new Map<Id,Id>();
        for(Account acc :accs)
            pbs.put(acc.Active_Contract__r.PriceBook2Id,acc.Id);
        
        // get cpbes (customer special pricebook)
        List<PriceBookEntry> cpbes = [
            SELECT Id,
                Product2Id, 
                Name,
                ProductCode,
                UnitPrice,
                Pricebook2Id,
                CurrencyIsoCode,
                Volume_1__c, Sell_Price_1__c,
                Volume_2__c, Sell_Price_2__c,
                Volume_3__c, Sell_Price_3__c,
                Volume_4__c, Sell_Price_4__c,
                Volume_5__c, Sell_Price_5__c,
                Volume_6__c, Sell_Price_6__c,
                Volume_7__c, Sell_Price_7__c,
                Volume_8__c, Sell_Price_8__c,
                Volume_9__c, Sell_Price_9__c,
                Volume_10__c, Sell_Price_10__c
            FROM PriceBookEntry 
            WHERE CurrencyIsoCode in :ccs AND 
                PriceBook2Id in :pbs.keySet() AND 
                Product2Id in :productIdList AND
                IsActive = true];
    
        // get pbes (opportunity pricebook - should always be standard procebook)
        Map<Id,PriceBookEntry> pbes = new Map<Id,PricebookEntry>([
            SELECT Id,
                Product2Id, 
                Name,
                ProductCode,
                UnitPrice,
                Pricebook2Id,
                CurrencyIsoCode,
                Volume_1__c, Sell_Price_1__c,
                Volume_2__c, Sell_Price_2__c,
                Volume_3__c, Sell_Price_3__c,
                Volume_4__c, Sell_Price_4__c,
                Volume_5__c, Sell_Price_5__c,
                Volume_6__c, Sell_Price_6__c,
                Volume_7__c, Sell_Price_7__c,
                Volume_8__c, Sell_Price_8__c,
                Volume_9__c, Sell_Price_9__c,
                Volume_10__c, Sell_Price_10__c
            FROM PriceBookEntry 
            WHERE Id in :pbeIds]);

        // work through all OpportunityLineItems making pricing updates...
        List<QuoteLineItem> updateList = new List<QuoteLineItem>();
        for (QuoteLineItem qliIterator: qliList)
        {
            // get a writable version of the oli record...
            QuoteLineItem qli = new QuoteLineItem();
            qli.id = qliIterator.id;
            qli.UnitPrice = qliIterator.UnitPrice;
            qli.Quantity = qliIterator.Quantity;
            qli.FOC_Quantity__c = qliIterator.FOC_Quantity__c;
            qli.Total_Cost__c = qliIterator.Total_Cost__c;
            qli.Discount = qliIterator.Discount;
            
            // get product
            Product2 qliProd = productIds.get(qliIterator.Product2Id);
            System.assert(qliProd != null); // should never be null!
            
            // get cost price according to quantity...
            if(qliProd.Volume_1__c == null || qliProd.Buy_Price_1__c == null || qliIterator.Quantity < qliProd.Volume_1__c)
                qli.Cost_Price__c = qliProd.Buy_Price__c; 
            else if(qliProd.Volume_2__c == null || qliProd.Buy_Price_2__c == null || qliIterator.Quantity < qliProd.Volume_2__c)
                qli.Cost_Price__c = qliProd.Buy_Price_1__c;
            else if(qliProd.Volume_3__c == null || qliProd.Buy_Price_3__c == null || qliIterator.Quantity < qliProd.Volume_3__c)
                qli.Cost_Price__c = qliProd.Buy_Price_2__c;
            else if(qliProd.Volume_4__c == null || qliProd.Buy_Price_4__c == null || qliIterator.Quantity < qliProd.Volume_4__c)
                qli.Cost_Price__c = qliProd.Buy_Price_3__c;
            else if(qliProd.Volume_5__c == null || qliProd.Buy_Price_5__c == null || qliIterator.Quantity < qliProd.Volume_5__c)
                qli.Cost_Price__c = qliProd.Buy_Price_4__c;
            else if(qliProd.Volume_6__c == null || qliProd.Buy_Price_6__c == null || qliIterator.Quantity < qliProd.Volume_6__c)
                qli.Cost_Price__c = qliProd.Buy_Price_5__c;
            else if(qliProd.Volume_7__c == null || qliProd.Buy_Price_7__c == null || qliIterator.Quantity < qliProd.Volume_7__c)
                qli.Cost_Price__c = qliProd.Buy_Price_6__c;
            else if(qliProd.Volume_8__c == null || qliProd.Buy_Price_8__c == null || qliIterator.Quantity < qliProd.Volume_8__c)
                qli.Cost_Price__c = qliProd.Buy_Price_7__c;
            else if(qliProd.Volume_9__c == null || qliProd.Buy_Price_9__c == null || qliIterator.Quantity < qliProd.Volume_9__c)
                qli.Cost_Price__c = qliProd.Buy_Price_8__c;
            else if(qliProd.Volume_10__c == null || qliProd.Buy_Price_10__c == null || qliIterator.Quantity < qliProd.Volume_10__c)
                qli.Cost_Price__c = qliProd.Buy_Price_9__c;
            else
                qli.Cost_Price__c = qliProd.Buy_Price_10__c;

            // get list price according to quantity...
            PriceBookEntry qli_pbe = pbes.get(qliIterator.PricebookEntryId);
            if(qli_pbe.Volume_1__c == null || qli_pbe.Sell_Price_1__c == null || qliIterator.Quantity < qli_pbe.Volume_1__c)
                qli.List_Price__c = qli_pbe.UnitPrice; 
            else if(qli_pbe.Volume_2__c == null || qli_pbe.Sell_Price_2__c == null || qliIterator.Quantity < qli_pbe.Volume_2__c)
                qli.List_Price__c = qli_pbe.Sell_Price_1__c;
            else if(qli_pbe.Volume_3__c == null || qli_pbe.Sell_Price_3__c == null || qliIterator.Quantity < qli_pbe.Volume_3__c)
                qli.List_Price__c = qli_pbe.Sell_Price_2__c;
            else if(qli_pbe.Volume_4__c == null || qli_pbe.Sell_Price_4__c == null || qliIterator.Quantity < qli_pbe.Volume_4__c)
                qli.List_Price__c = qli_pbe.Sell_Price_3__c;
            else if(qli_pbe.Volume_5__c == null || qli_pbe.Sell_Price_5__c == null || qliIterator.Quantity < qli_pbe.Volume_5__c)
                qli.List_Price__c = qli_pbe.Sell_Price_4__c;
            else if(qli_pbe.Volume_6__c == null || qli_pbe.Sell_Price_6__c == null || qliIterator.Quantity < qli_pbe.Volume_6__c)
                qli.List_Price__c = qli_pbe.Sell_Price_5__c;
            else if(qli_pbe.Volume_7__c == null || qli_pbe.Sell_Price_7__c == null || qliIterator.Quantity < qli_pbe.Volume_7__c)
                qli.List_Price__c = qli_pbe.Sell_Price_6__c;
            else if(qli_pbe.Volume_8__c == null || qli_pbe.Sell_Price_8__c == null || qliIterator.Quantity < qli_pbe.Volume_8__c)
                qli.List_Price__c = qli_pbe.Sell_Price_7__c;
            else if(qli_pbe.Volume_9__c == null || qli_pbe.Sell_Price_9__c == null || qliIterator.Quantity < qli_pbe.Volume_9__c)
                qli.List_Price__c = qli_pbe.Sell_Price_8__c;
            else if(qli_pbe.Volume_10__c == null || qli_pbe.Sell_Price_10__c == null || qliIterator.Quantity < qli_pbe.Volume_10__c)
                qli.List_Price__c = qli_pbe.Sell_Price_9__c;
            else
                qli.List_Price__c = qli_pbe.Sell_Price_10__c;

            // each price book entry...
            for(PriceBookEntry pbe :cpbes)
            {
                // check for a match
                if(qliIterator.CurrencyIsoCode == pbe.CurrencyIsoCode &&
                   qliIterator.Product2Id == pbe.Product2Id &&
                   qliIterator.AccountId__c == pbs.get(pbe.PriceBook2Id))
                {
                    // Found entry, update pricing...
                    qli.Customer_Pricebook_Entry_ID__c = pbe.Id;
                    
                    // update list price according to quantity...
                    if(pbe.Volume_1__c == null || pbe.Sell_Price_1__c == null || qliIterator.Quantity < pbe.Volume_1__c)
                        qli.List_Price__c = pbe.UnitPrice; 
                    else if(pbe.Volume_2__c == null || pbe.Sell_Price_2__c == null || qliIterator.Quantity < pbe.Volume_2__c)
                        qli.List_Price__c = pbe.Sell_Price_1__c;
                    else if(pbe.Volume_3__c == null || pbe.Sell_Price_3__c == null || qliIterator.Quantity < pbe.Volume_3__c)
                        qli.List_Price__c = pbe.Sell_Price_2__c;
                    else if(pbe.Volume_4__c == null || pbe.Sell_Price_4__c == null || qliIterator.Quantity < pbe.Volume_4__c)
                        qli.List_Price__c = pbe.Sell_Price_3__c;
                    else if(pbe.Volume_5__c == null || pbe.Sell_Price_5__c == null || qliIterator.Quantity < pbe.Volume_5__c)
                        qli.List_Price__c = pbe.Sell_Price_4__c;
                    else if(pbe.Volume_6__c == null || pbe.Sell_Price_6__c == null || qliIterator.Quantity < pbe.Volume_6__c)
                        qli.List_Price__c = pbe.Sell_Price_5__c;
                    else if(pbe.Volume_7__c == null || pbe.Sell_Price_7__c == null || qliIterator.Quantity < pbe.Volume_7__c)
                        qli.List_Price__c = pbe.Sell_Price_6__c;
                    else if(pbe.Volume_8__c == null || pbe.Sell_Price_8__c == null || qliIterator.Quantity < pbe.Volume_8__c)
                        qli.List_Price__c = pbe.Sell_Price_7__c;
                    else if(pbe.Volume_9__c == null || pbe.Sell_Price_9__c == null || qliIterator.Quantity < pbe.Volume_9__c)
                        qli.List_Price__c = pbe.Sell_Price_8__c;
                    else if(pbe.Volume_10__c == null || pbe.Sell_Price_10__c == null || qliIterator.Quantity < pbe.Volume_10__c)
                        qli.List_Price__c = pbe.Sell_Price_9__c;
                    else
                        qli.List_Price__c = pbe.Sell_Price_10__c;                   
                }
            }
            
            // only update the unit price if it is following the list price...
            if((qliIterator.UnitPrice == qliIterator.List_Price__c || qliIterator.List_Price__c == null) 
               && !QuoteSyncUtil.isNewQuote(qliIterator.QuoteId))   // note unit price used to match with oli, so if changed here it will not match and fields will not be updated
                qli.UnitPrice = qli.List_Price__c;                  // for new quotes leave the unit price such that it inherits the oli values...
                            
            // update totals...
            Double Discount = 0;
            if(qli.Discount != null)
                Discount = qli.Discount/100;
            Double TotalPrice = qli.UnitPrice * qli.Quantity * (1-Discount);
            if(qli.FOC_Quantity__c != null)
                qli.Total_Quantity__c = qli.Quantity + qli.FOC_Quantity__c;
            else
                qli.Total_Quantity__c = qli.Quantity;
            qli.Total_Cost__c = null;
            qli.Margin__c = null;
            if(qli.Cost_Price__c != null)
            {
                qli.Total_Cost__c = qli.Cost_Price__c * qli.Total_Quantity__c;
                if(TotalPrice != 0)
                    qli.Margin__c = ((TotalPrice - qli.Total_Cost__c) / TotalPrice) * 100;
            }
            qli.Effective_Discount__c = null;
            qli.Total_List_Value__c = null;
            if(qli.List_Price__c != null && qli.Total_Quantity__c != null && TotalPrice != null && qli.List_Price__c != 0 && qli.Total_Quantity__c != 0)
            {
                qli.Effective_Discount__c = (((qli.List_Price__c * qli.Total_Quantity__c) - TotalPrice) / (qli.List_Price__c * qli.Total_Quantity__c)) * 100;
                qli.Total_List_Value__c = qli.List_Price__c * qli.Total_Quantity__c;
            }

            // add to update list
            qli.SkipValidationRules__c = true;   // skip validation rules...
            updateList.add(qli);
        }
        
        // do update, disabling impacted triggers!
        TriggerStopper.stopOpp = true;
        TriggerStopper.stopQuote = true;        
        TriggerStopper.stopOppLine = true;        
        TriggerStopper.stopQuoteLine = true; 
        Update updateList;
        TriggerStopper.stopOpp = false;
        TriggerStopper.stopQuote = false;         
        TriggerStopper.stopOppLine = false;          
        TriggerStopper.stopQuoteLine = false; 
    }

    
    /////////////////////////////////////////////////////////////////////////////////
}