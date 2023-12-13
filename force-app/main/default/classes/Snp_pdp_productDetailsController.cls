public without sharing class Snp_pdp_productDetailsController {
    @AuraEnabled
    public static Product2 getProductData(String productId){
        System.debug('productId- ' + productId);
        Product2 productDetail = new Product2();
        try {
            productDetail = [SELECT Id, Name, ProductCode, Description FROM Product2 WHERE Id =: productId];
            System.debug(productDetail);
        } catch (Exception e) {
            System.debug('Error in Snp_pdp_productDetailsController.getProductData- ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }    
        return productDetail;    
    }
    
    @AuraEnabled
    public static ConnectApi.ProductDetail getProductVariationInfo(String productId,string communityId){
        try {
            id webstoreID=[SELECT WebStoreId FROM WebStoreNetwork WHERE NetworkId = :communityId LIMIT 1].WebStoreId;
            //String webstoreID = '0ZE7Y0000000Da7WAE';
            //String productId = '01t7Y00000Au3L3QAJ';
           
            String effAccId = null;
            //0017Y00001uv4sdQAA
            List<String> fields = new List<String>{'Id', 'Name'};
                Boolean excludeFields = false;
            List<String> mediaGroups = new List<String>();
            Boolean excludeMedia = true;
            Boolean excludeEntitlementDetails = false;
            Boolean excludePrimaryProductCategory = false;
            Boolean excludeVariationInfo = false;
            Boolean excludeAttributeSetInfo = false;
            
            ConnectApi.ProductDetail abc = ConnectApi.CommerceCatalog.getProduct(webstoreID, productId, effAccId, fields, excludeFields, mediaGroups, excludeMedia, excludeEntitlementDetails, excludePrimaryProductCategory, excludeVariationInfo, excludeAttributeSetInfo);
            System.debug('Abc -- ' + abc);
            if(abc != Null){
                return abc;
            }else {
                throw new AuraHandledException('No data found for this product');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<String>  getAttributeValues(string attribute,string variantParentId) {
      //String variantParentId='01tMU000000RPc3YAG';
        
        /* List<ProductAttribute> pa = [SELECT Input_Voltage__c FROM ProductAttribute WHERE VariantParentId = '01t7Y00000Au3L3QAJ'];
        Set<String> uniqueInputVoltages = new Set<String>();
        List<String> ipvList = new List<String>();
        
        for (ProductAttribute p : pa) {
        if (p.Input_Voltage__c != null && !uniqueInputVoltages.contains(p.Input_Voltage__c)) {
        uniqueInputVoltages.add(p.Input_Voltage__c);
        ipvList.add(p.Input_Voltage__c);
        }
        }
        
        
        //System.debug(ipvList);
        
        return ipvList;*/ 
        String query = 'SELECT ' + attribute + ' FROM ProductAttribute WHERE VariantParentId = \'' + variantParentId + '\'';
        
        List<ProductAttribute> pa = Database.query(query);
        Set<String> uniqueAttributeValues = new Set<String>();
        List<String> attributeValueList = new List<String>();
        
        for (ProductAttribute p : pa) {
            String attributeValue = (String) p.get(attribute);
            if (!String.isBlank(attributeValue) && !uniqueAttributeValues.contains(attributeValue)) {
                uniqueAttributeValues.add(attributeValue);
                attributeValueList.add(attributeValue);
            }
        }
        
        return attributeValueList;
        
        
    }
    @AuraEnabled(cacheable=true)
    public static List<string> queryProductAttributes(list <Map<String, String>> selectedValues,string queryAttributes,string variantParentId) {
       //String variantParentId='01tMU000000RPc3YAG';
        List<String> selectedValueList = new List<String>();
        List<String> selectedValuekey = new List<String>();
        
        for (Map<String, String> selectedValue : selectedValues) {
            selectedValueList.add(selectedValue.get('values'));
            selectedValuekey.add(selectedValue.get('label'));
        }
        
        String query = 'SELECT ' + queryAttributes + ' FROM ProductAttribute WHERE VariantParentId = :variantParentId AND '; 
        
        for (Integer i = 0; i < selectedValuekey.size(); i++) {
            if (i > 0) {
                query += ' AND ';
            }
            query += selectedValuekey[i] + ' IN :selectedValueList';
        }
        
        List<ProductAttribute> par = Database.query(query);
        Set<String> uniqueAttributeValues = new Set<String>();
        List<String> attributeValueList = new List<String>();
        
        for (ProductAttribute p : par) {
            String attributeValue = (String) p.get(queryAttributes);
            if (!String.isBlank(attributeValue) && !uniqueAttributeValues.contains(attributeValue)) {
                uniqueAttributeValues.add(attributeValue);
                attributeValueList.add(attributeValue);
            }
        }
        
        return attributeValueList;
        //System.debug(par);
        
        //return par;
    }
     @AuraEnabled(cacheable=true)
    public static List<string> queryProductid(list <Map<String, String>> selectedValues,string variantParentId) {
      //String variantParentId='01tMU000000RPc3YAG';
        List<String> selectedValueList = new List<String>();
        List<String> selectedValuekey = new List<String>();
        
        for (Map<String, String> selectedValue : selectedValues) {
            selectedValueList.add(selectedValue.get('values'));
            selectedValuekey.add(selectedValue.get('label'));
        }
        
        String query = 'SELECT  productid  FROM ProductAttribute WHERE VariantParentId = :variantParentId AND '; 
        
        for (Integer i = 0; i < selectedValuekey.size(); i++) {
            if (i > 0) {
                query += ' AND ';
            }
            query += selectedValuekey[i] + ' IN :selectedValueList';
        }
        
        List<ProductAttribute> par = Database.query(query);
        Set<String> uniqueAttributeValues = new Set<String>();
        List<String> attributeValueList = new List<String>();
        
        for (ProductAttribute p : par) {
            String attributeValue =  p.productid;
            if (!String.isBlank(attributeValue) && !uniqueAttributeValues.contains(attributeValue)) {
                uniqueAttributeValues.add(attributeValue);
                attributeValueList.add(attributeValue);
            }
        }
        
        return attributeValueList;
        //System.debug(par);
        
        //return par;
    }
}