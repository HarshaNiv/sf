public with sharing class r3AccountProductController {
    @AuraEnabled(cacheable=true)
    public static List<PricebookEntry> getAccountProducts(
        Id recordId,
        String searchCriteria
    ) {
        String searchText = '%' + searchCriteria + '%';
        Account acc = [
            SELECT
                Id,
                CurrencyIsoCode,
                Price_Book_Override__c,
                Price_Book__c,
                Active_Contract__r.Pricebook2Id
            FROM Account
            WHERE Id = :recordId
            LIMIT 1
        ];

        Id pbId = (acc.Price_Book_Override__c == true
            ? acc.Price_Book__c
            : acc.Active_Contract__r.Pricebook2Id);

        if (pbId == null) {
            // get the standard pricebook id...
            Pricebook2 StdPb = [
                SELECT Id, Name, IsActive
                FROM PriceBook2
                WHERE IsStandard = TRUE
                LIMIT 1
            ];

            pbId = StdPb.Id;
        }

        return [
            SELECT
                Id,
                CurrencyIsoCode,
                UnitPrice,
                ProductCode,
                Product2.Name,
                Product2.Family,
                Product_Description__c,
                Sell_Price_1__c,
                Sell_Price_2__c,
                Sell_Price_3__c,
                Sell_Price_4__c,
                Sell_Price_5__c,
                Sell_Price_6__c,
                Sell_Price_7__c,
                Sell_Price_8__c,
                Sell_Price_9__c,
                Sell_Price_10__c,
                Volume_1__c,
                Volume_2__c,
                Volume_3__c,
                Volume_4__c,
                Volume_5__c,
                Volume_6__c,
                Volume_7__c,
                Volume_8__c,
                Volume_9__c,
                Volume_10__c,
                Volume_Pricing__c
            FROM PricebookEntry
            WHERE
                Pricebook2Id = :pbId
                AND CurrencyIsoCode = :acc.CurrencyIsoCode
                AND (Product2.Name LIKE :searchText
                OR ProductCode LIKE :searchText
                OR Product2.Description LIKE :searchText
                OR Product2.Family LIKE :searchText)
            LIMIT 20
        ];
    }
}