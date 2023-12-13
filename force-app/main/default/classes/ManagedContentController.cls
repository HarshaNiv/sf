public without sharing class ManagedContentController {
    @AuraEnabled(cacheable=true)
    public static Map<String, ConnectApi.ManagedContentNodeValue> getContent(
        String contentId,
        Integer page,
        Integer pageSize,
        String language,
        String filterby
    ) 
    {
        try {
            String networkId = Network.getNetworkId();
            ConnectApi.ManagedContentVersionCollection contentCollection = ConnectApi.ManagedContent.getManagedContentByContentKeys(
                networkId,
                new List<String>{ contentId },
                0,
                1,
                language,
                filterby,
                false
            );
            system.debug('TResult'+ contentCollection.items[0].contentNodes);
            return contentCollection.items[0].contentNodes;
        } catch (ConnectApi.ConnectApiException e) {
            System.debug('Error Message : ' + e);
            Map<String, ConnectApi.ManagedContentNodeValue> mcnvMap = new Map<String, ConnectApi.ManagedContentNodeValue>();
            return mcnvMap;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<ConnectApi.ManagedContentVersion> getContentList(
        Integer page,
        Integer pageSize,
        String language,
        String filterby
    ) {
        try {
            String networkId = Network.getNetworkId();
            ConnectApi.ManagedContentVersionCollection contentCollection = ConnectApi.ManagedContent.getAllManagedContent(
                networkId,
                page,
                pageSize,
                language,
                filterby
            );
            return contentCollection.items;
        } catch (ConnectApi.ConnectApiException e) {
            System.debug('Error Message : ' + e);
            List<ConnectApi.ManagedContentVersion> mcnvMap = new List<ConnectApi.ManagedContentVersion>();
            return mcnvMap;
        }
    }
    @AuraEnabled(cacheable=true)
    public static ConnectApi.ProductCategoryPath getcategory(string WebStoreName, string productid){
        system.debug(WebStoreName);
        system.debug(productid);
        id categoryid;
        id webStoreid = [SELECT Id,Name FROM WebStore WHERE Name =:WebStoreName].id;
        list<ProductCategoryProduct> category = [SELECT ProductId, Id, ProductCategoryId,IsPrimaryCategory FROM ProductCategoryProduct where ProductId=:productid];
        
        if(category.size()==1){
            categoryid=category[0].ProductCategoryId;
        }else{
            for(ProductCategoryProduct pcp:category){
                if(pcp.IsPrimaryCategory){
                    categoryid=pcp.ProductCategoryId;
                    break;
                }
            } 
        }
        
        try{
            return  ConnectApi.CommerceCatalog.getProductCategoryPath(webStoreid, categoryid);
        }catch (ConnectApi.ConnectApiException e) {
            System.debug('Error Message : ' + e);
            throw new AuraHandledException(e.getMessage());
        }
      	
    }
   @AuraEnabled(cacheable=true)
		 public static List<Map<String, Object>> getProductSections(string productid) {
             //string productid
        List<Map<String, Object>> sections = new List<Map<String, Object>>();
        
        // Query the product record and its sections
        Product2 productsec = [SELECT Id, Name, Section2_Vertical_Heading__c, Section2_Horizontal_Heading__c, Section2_Description__c, Section2_Image__c, 
                              Section3_Horizontal_Heading__c, Section3_Vertical_Heading__c, Section3_Description__c, Section3_Image__c,
                              Section1_horizontal_heading__c, Section1_vertical_heading__c,Section1_Description__c, Section1_Image__c,
                              Section4_horizontal_heading__c, Section4_vertical_heading__c,Section4_Description__c, Section4_Image__c,
                              Section5_horizontal_heading__c, Section5_vertical_heading__c,Section5_Description__c, Section5_Image__c,
                              Content_Key1__c,Content_Key2__c,Content_Key3__c,Content_Key4__c,Content_Key5__c FROM Product2 where id=:productid];
        
        // Create a map for each section and add it to the sections list
        for (Integer i = 1; i <= 5; i++) {
            Map<String, Object> section = new Map<String, Object>();
            section.put('id', 'Section' + i );
            section.put('verticalHeading', productsec.get('Section' + i + '_Vertical_Heading__c'));
            section.put('horizontalHeading', productsec.get('Section' + i + '_Horizontal_Heading__c'));
            section.put('description', productsec.get('Section' + i + '_Description__c'));
            section.put('image', productsec.get('Section' + i +  '_Image__c'));
            section.put('contentKey', productsec.get('Content_Key' + i +  '__c'));
          /*  Matcher imgMatcher = Pattern.compile( '<img(.+?)>' ).matcher( String.valueof(productsec.get('Section' + i + '_Image__c')) );
                Blob b = null;
                while ( imgMatcher.find() ) {
                    String imageTag = imgMatcher.group();
                    String imageURL = imageTag.substringBetween( ' src="', '"' );
                    String decodedURL = imageURL.unescapeHtml4();
                    PageReference page = new PageReference( decodedURL );
                    b = page.getContent(); 
                }
                string bs = EncodingUtil.base64Encode(b);
                section.put('image',b);*/
                sections.add(section);
            
            
        } 
        system.debug(sections);
        
        return sections;
    }
    
	@AuraEnabled(cacheable=true)
		 public static product2 getProductdetails(string productid) {
             try{
                product2 product=[SELECT StockKeepingUnit,ProductClass,Name, Id FROM Product2 where id=:productid];
                return product;
             }catch(System.QueryException e){
                System.debug('Error Message : ' + e);
            	throw new AuraHandledException(e.getMessage());
             }
                      
    }

    
    
}