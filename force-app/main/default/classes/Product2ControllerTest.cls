@isTest
private class Product2ControllerTest {
    @isTest
    static void testGetProducts() {
        // Test data setup
        WebStoreNetwork network = new WebStoreNetwork(NetworkId = '0DB5i000000oOx2GAE', WebStoreId = '0ZE5i0000008gCIGAY');
        insert network;

        WebStoreCatalog catalog = new WebStoreCatalog(SalesStoreId = '0ZE5i0000008gCIGAY', ProductCatalogId = '0ZS5i0000008o8mGAA');
        insert catalog;

        ProductCategory category = new ProductCategory(CatalogId = '0ZS5i0000008o8mGAA', Name = 'TestCategory');
        insert category;

        Product2 product1 = new Product2(Name = 'Product1', Description = 'Description1');
        Product2 product2 = new Product2(Name = 'Product2', Description = 'Description2');
        Product2 product3 = new Product2(Name = 'Product3', Description = 'Description3');
        insert new List<Product2>{product1, product2, product3};

        ProductCategoryProduct categoryProduct1 = new ProductCategoryProduct(ProductId = product1.Id, ProductCategoryId = category.Id);
        ProductCategoryProduct categoryProduct2 = new ProductCategoryProduct(ProductId = product2.Id, ProductCategoryId = category.Id);
        ProductCategoryProduct categoryProduct3 = new ProductCategoryProduct(ProductId = product3.Id, ProductCategoryId = category.Id);
        insert new List<ProductCategoryProduct>{categoryProduct1, categoryProduct2, categoryProduct3};

        // Call the getProducts method
        Test.startTest();
        List<Product2> products = Product2Controller.getProducts('Product', '0DB5i000000oOx2GAE');
        Test.stopTest();

        // Perform assertions to verify the results
        System.assertEquals(3, products.size(), 'Expected 3 products');
        System.assertEquals('Product1', products[0].Name, 'Expected product1 name');
        System.assertEquals('Description1', products[0].Description, 'Expected product1 description');
        System.assertEquals('Product2', products[1].Name, 'Expected product2 name');
        System.assertEquals('Description2', products[1].Description, 'Expected product2 description');
        System.assertEquals('Product3', products[2].Name, 'Expected product3 name');
        System.assertEquals('Description3', products[2].Description, 'Expected product3 description');
    }

    @isTest
    static void testGetCategoryNames() {
        // Test data setup
        WebStoreNetwork network = new WebStoreNetwork(NetworkId = '0DB5i000000oOx2GAE', WebStoreId = '0ZE5i0000008gCIGAY');
        insert network;

        WebStoreCatalog catalog = new WebStoreCatalog(SalesStoreId = '0ZE5i0000008gCIGAY', ProductCatalogId = '0ZS5i0000008o8mGAA');
        insert catalog;

        ProductCategory category1 = new ProductCategory(CatalogId = '0ZS5i0000008o8mGAA', Name = 'TestCategory1');
        ProductCategory category2 = new ProductCategory(CatalogId = '0ZS5i0000008o8mGAA', Name = 'TestCategory2');
        ProductCategory category3 = new ProductCategory(CatalogId = '0ZS5i0000008o8mGAA', Name = 'TestCategory3');
        insert new List<ProductCategory>{category1, category2, category3};

        Product2 product = new Product2(Name = 'Product', Description = 'Description');
        insert product;

        ProductCategoryProduct categoryProduct1 = new ProductCategoryProduct(ProductId = product.Id, ProductCategoryId = category1.Id);
        ProductCategoryProduct categoryProduct2 = new ProductCategoryProduct(ProductId = product.Id, ProductCategoryId = category2.Id);
        ProductCategoryProduct categoryProduct3 = new ProductCategoryProduct(ProductId = product.Id, ProductCategoryId = category3.Id);
        insert new List<ProductCategoryProduct>{categoryProduct1, categoryProduct2, categoryProduct3};

        // Call the getCategoryNames method
        Test.startTest();
        List<ProductCategory> categories = Product2Controller.getCategoryNames('Product', '0DB5i000000oOx2GAE');
        Test.stopTest();

        // Perform assertions to verify the results
        System.assertEquals(3, categories.size(), 'Expected 3 categories');
        System.assertEquals('TestCategory1', categories[0].Name, 'Expected category1 name');
        System.assertEquals('TestCategory2', categories[1].Name, 'Expected category2 name');
        System.assertEquals('TestCategory3', categories[2].Name, 'Expected category3 name');
    }
}