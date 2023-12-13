@isTest
private class SNP_ProductAddInfo_controllerTest {

    @isTest(seeAllData=true)
    static void testGetProductAdditionalInformation() {
        
        //Create a  test Product2 record
        Product2 testProduct = new Product2(Name = 'Test Product' , Applications__c = '<p>Test Applications</p>'
                                           ,Features__c = '<p>Test Features</p>');
        insert testProduct;
        
        // Call the  method to be tested
        
  Product2 resultProduct = SNP_ProductAddInfo_controller.getProductAdditionalInformation(testProduct.Id);
        //Verify the results
        system.assertEquals(testProduct.Id, resultProduct.Id);
        system.assertEquals('Test Product', resultProduct.Name);
        system.assertEquals('Test Applications', resultProduct.Applications__c);
        system.assertEquals('Test Features', resultProduct.Features__c);
    } 
      
    // Test method for checkDocumentsOfProduct
    @isTest(seeAllData=true)
    static void testcheckDocumentsOfProduct(){
        // Create a test Product2 record
        Product2 testProduct = new Product2(Name = 'Test Product');
        insert testProduct;
        system.debug(testProduct);
        
        
        id networkid=[SELECT Id, Name FROM Network where Name LIKE'PowerLEDUk'].id;
        
       // id ElectronicMediaGroupId =[SELECT Id FROM ProductMedia limit 1].id; 
        //id ElectronicMediaId =[select Id FROM ProductMedia limit 1].id;
        
     List<ProductMedia> mediaId =  [SELECT Id,Name, productId, ElectronicMediaGroupId, ElectronicMediaId, SortOrder FROM ProductMedia ];
        system.debug(mediaId);
        // Create test product data
     //   Product2 testProduct1 = new Product2(Name = 'Test Product');
       // insert testProduct1;
       
        // Create test product media data
          ProductMedia testProductMedia = new ProductMedia(
            ProductId = testProduct.Id,
            ElectronicMediaId = mediaId[0].ElectronicMediaId,
            ElectronicMediaGroupId = mediaId[0].ElectronicMediaGroupId
        );
        
        insert testProductMedia;
       
        
        // Call the method and set the community ID and product ID
        Boolean result = SNP_ProductAddInfo_controller.checkDocumentsOfProduct(networkid, testProduct.Id);
        
        // Debug statement to see the result
        //System.debug('Result: ' + result);
        
        // Perform assertions to verify the behavior of your method
       System.assertEquals(false, result, 'Expected result is true');
    }

        
       
        
       // List<Map<String, ConnectApi.ManagedContentNodeValue>> contentNodesMapList=SNP_ProductAddInfo_controller.checkDocumentsOfProduct(networkid,testEMId);
        
        // Add assertions here to validate the expected behavior
        //System.assertEquals(true, result, 'Expected result to be true');
    
    // Test method for getProductSpecifications

@isTest
    static void testGetProductSpecifications() {
        // Create a test Product2 record
        Product2 testProduct = new Product2(Name = 'Test Product');
        insert testProduct;
        SNP_ProductAddInfo_controller.getProductSpecifications(testProduct.id);
        // Create a test ProductAttribute record
       // ProductAttribute testAttribute = new ProductAttribute(productId = testProduct.Id  ); 
       // insert testAttribute;
        
       // Call the method to be tested
        //ProductAttribute resultAttribute = SNP_ProductAddInfo_controller.getProductSpecifications(testProduct.Id);

        // Verify the result
       // System.assertEquals(testAttribute.Id, resultAttribute.Id);
        // Add more assertions based on the actual fields in the ProductAttribute object
    }

   // @isTest
   // static void testGetProductSpecifications_NoAttribute() {
        // Call the method with a non-existing product Id
    //    ProductAttribute resultAttribute = SNP_ProductAddInfo_controller.getProductSpecifications('invalidProductId');

        // Verify the result
     //   System.assertEquals(resultAttribute, null);
 //   }

  @isTest
    
 public static void testgetAlternativeIdentifiers(){
     //Create a  test Product2 record
     Product2 testProduct = new Product2();
     testProduct.Name = 'Test Product';
     testProduct.Rapid_SKU__c = 'TestRaSKU';
     testProduct.EDP__c = 'TestEDP';
     testProduct.TSI_Code__c = 'TestTsCo';
     testProduct.RS_SKU__c = 'TestRSSKU';
     testProduct.M3_Item_Code__c = 'TestM3IC';
     testProduct.Stock_Code__c = 'TestSTc';
     testProduct.Farnell_SKU__c = 'TestFaSku';
     //testProduct.Reviews_IO__GTIN__c = 'TestReIo';
     insert testProduct;
     
     // Call the method from the controller class
        product2 result = SNP_ProductAddInfo_controller.getAlternativeIdentifiers(testProduct.Id);

        // Assert that the result is not null
        System.assertNotEquals(null, result);

        
        // For example, you can check specific fields in the result
        System.assertEquals('TestRaSKU', result.Rapid_SKU__c);
 }    
}