public without sharing class SNP_ProductAddInfo_controller {
    //Method for Product Features, Applications, Specifications
    @AuraEnabled(cacheable=true)
    public static product2 getProductAdditionalInformation(string productId){
        system.debug(productId);
    Product2 pro = [SELECT Id, Name, Applications__c ,Features__c 
                    FROM Product2 WHERE Id =:productId LIMIT 1];
    
    if (pro != null) {
        // Access the fields only if the 'pro' object is not null
        //It it contains p tag below line will remove
        system.debug(pro.Applications__c);
        //checking Application points are availabel or not
        if(pro.Applications__c != null){
        pro.Applications__c = pro.Applications__c.replace('<p>', '').replace('</p>', '');
        }
        //It it contains p tag below line will remove
        system.debug(pro.Features__c);
        //checking Features points are availabel or not
        if(pro.Features__c != null){
            pro.Features__c = pro.Features__c.replace('<p>', '').replace('</p>', '');
        }
        
    } else {
        system.debug('No product found with the specified ID');
    }

    return pro;
    } 
    
    //method for checking Availabelity of product Documents
    @AuraEnabled(cacheable=true)
    public static boolean checkDocumentsOfProduct(Id currentCommunityId ,Id productId){
          //  Product2 pro = [SELECT FIELDS(ALL) FROM ProductAttribute WHERE ProductId = :productId LIMIT 1];
        try{
            List<String> electronicMediaIds = new List<String>();
        	for (productmedia pcm : [
            SELECT ElectronicMediaId
            FROM productmedia
            WHERE productid = :productId
        ]) {
            electronicMediaIds.add(pcm.ElectronicMediaId);
        }
            
            if (electronicMediaIds.isEmpty()) {
                return false;
            }
         
		ConnectApi.ManagedContentVersionCollection contentCollection=SNP_ProductAddInfo_Helper.getManagedContent(currentCommunityId,electronicMediaIds);            
			
            List<Map<String, ConnectApi.ManagedContentNodeValue>> contentNodesMapList = new List<Map<String, ConnectApi.ManagedContentNodeValue>>();
				system.debug(contentCollection.items[0].contentNodes);
            if (contentCollection.items[0].contentNodes.isEmpty()){
                return false;
            }else {
                return true ;
            }
            
        }
        catch(Exception e){
              return false;
        }
         
    }
    
    //method for geting product-attributes
	@AuraEnabled(cacheable=true)
    public static ProductAttribute getProductSpecifications(string productId) {
        String allFieldsQuery = 'SELECT ' + String.join(new List<String>(Schema.getGlobalDescribe().get('ProductAttribute').getDescribe().fields.getMap().keySet()), ',') +
                               ' FROM ProductAttribute WHERE productId = :productId LIMIT 1';
        List<ProductAttribute> products = Database.query(allFieldsQuery);
        system.debug(products);
        return (products != null && !products.isEmpty()) ? products[0] : null;
    }
    
    
    //method For geting the Alternative Identifiers
    @AuraEnabled(cacheable=true)
    public static product2 getAlternativeIdentifiers(string productId){
        //Use When Reviews Integratin is done ---->  Reviews_IO__GTIN__c
      product2 pro = [SELECT Rapid_SKU__c, EDP__c, TSI_Code__c, RS_SKU__c, M3_Item_Code__c, Stock_Code__c, Farnell_SKU__c
                      FROM Product2
                      WHERE Id = :productId 
                      LIMIT 1];   
        if(pro != null){
            return pro;
        }

        return Null;
    } 
}