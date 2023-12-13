public without sharing class Product2Controller {
    @AuraEnabled
    public static List<Product2> getProducts(String productSearchText ,string communityIdWTB ) {
         // Query the webstoreId
         Id userWebStoreId = [SELECT WebStoreId 
                              FROM WebStoreNetwork 
                              WHERE NetworkId = :communityIdWTB 
                              LIMIT 1].WebStoreId;
        
        // Query the catlog of WebstoreId
         Id CatlogId =[SELECT ProductCatalogId 
                      FROM WebStoreCatalog 
                      WHERE SalesStoreId = : userWebStoreId 
                      LIMIT 1].ProductCatalogId;
        
        //Query the categoryId and Name 
        LIST<ProductCategory> categorys = [SELECT Id, Name
                                		   FROM ProductCategory
                                          WHERE CatalogId = : CatlogId];
        
        //Query the product2 Id which are Matching the serch Inbox
        String searchQueryon = 'SELECT Id, Name, Description FROM Product2 WHERE Name LIKE \'%' + productSearchText + '%\' OR StockKeepingUnit LIKE \'%' + productSearchText + '%\'';
        List<Product2> products = Database.query(searchQueryon);
        System.debug('Krishnamurthy Donat' + products);

        // Unique product ids
        Set<Id> productIds = new Set<Id>();
        for (Product2 product : products) {
            productIds.add(product.Id);
        }
        
   		 // Find the matching categories for the productIds
   		 List<ProductCategoryProduct> categoryProducts = [SELECT ProductId 
                                                     FROM ProductCategoryProduct 
                                                     WHERE ProductId IN :productIds
                                                     AND CatalogId = : CatlogId];
     
        // Collect unique ProductId
        Set<Id> ProductId = new Set<Id>();
        for (ProductCategoryProduct categoryProduct : categoryProducts) {
            ProductId.add(categoryProduct.ProductId);
        }
        List<Product2> product =[SELECT Id, Name, Description FROM Product2 WHERE Id IN:ProductId LIMIT 3];
        
        return product;
    }
    
    
    
    @AuraEnabled
    public static List<ProductCategory> getCategoryNames(String CategorySearchText ,string communityIdWTB) {
        
        // Query the webstoreId
         Id userWebStoreId = [SELECT WebStoreId 
                              FROM WebStoreNetwork 
                              WHERE NetworkId = :communityIdWTB 
                              LIMIT 1].WebStoreId;
        
        // Query the catlog of WebstoreId
         Id CatlogId =[SELECT ProductCatalogId 
                      FROM WebStoreCatalog 
                      WHERE SalesStoreId = : userWebStoreId 
                      LIMIT 1].ProductCatalogId;
        
        //Query the categoryId and Name 
        LIST<ProductCategory> categorys = [SELECT Id, Name
                                		   FROM ProductCategory
                                          WHERE CatalogId = : CatlogId];
        
        //Query the product2 Id which are Matching the serch Inbox
        String searchQueryon = 'SELECT Id, Name, Description FROM Product2 WHERE Name LIKE \'%' + CategorySearchText + '%\' OR StockKeepingUnit LIKE \'%' + CategorySearchText + '%\'';
        List<Product2> products = Database.query(searchQueryon);

        // Unique product ids
        Set<Id> productIds = new Set<Id>();
        for (Product2 product : products) {
            productIds.add(product.Id);
        }
        
        // Find the matching categories for the productIds
        List<ProductCategoryProduct> categoryProducts = [SELECT ProductCategoryId 
                                                         FROM ProductCategoryProduct 
                                                         WHERE ProductId IN :productIds
                                                         AND CatalogId = : CatlogId];
         
        // Collect unique ProductCategoryIds
        Set<Id> categoryIds = new Set<Id>();
        for (ProductCategoryProduct categoryProduct : categoryProducts) {
            categoryIds.add(categoryProduct.ProductCategoryId);
        }
    
        // Query the matching ProductCategory records
        List<ProductCategory> categories = [SELECT Id, Name
                                            FROM ProductCategory
                                            WHERE Id IN :categoryIds
                                            LIMIT 3 ];    
          return categories ;
    }
}