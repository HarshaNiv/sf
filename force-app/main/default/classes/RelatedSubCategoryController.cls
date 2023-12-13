/**
 * Author: Owais Amin Ahanger
 * Description: [This class fetches specified CMS content/image information and returns to snpNewlyLaunchedSection lwc component]
 * Date: [21-JUN-2023]
 * Test Class: [NA]
 */
public with sharing class RelatedSubCategoryController {
    
	@AuraEnabled
    public static List<ProductCategory> getRelatedSubCategories(Id parentCategoryId){
        try {
            	
            	List<ProductCategory>subCategory=
                                                    [SELECT Id,Name
                                                     FROM ProductCategory 
                                                     WHERE ParentCategoryId=:parentCategoryId];
            
               /* List<ProductCategoryProduct> productIds=
                                                        [SELECT ProductId 
                                                        FROM ProductCategoryProduct 
                                                        WHERE ProductCategoryId IN :subCategoryId];*/
             	
            
            	//Set<ProductCategoryProduct> uniqueProductIds = new Set<ProductCategoryProduct>(productIds);
				//List<ProductCategoryProduct> uniqueProductListIds = new List<ProductCategoryProduct>(uniqueProductIds);
           
            /*for(ProductCategoryProduct p:uniqueProductIds){
               system.debug('Unique'+p.ProductId);
            }*/
            	//system.debug('Ids'+uniqueProductListIds);
            	
            	//return uniqueProductListIds;
            	system.debug(subCategory);
            	return subCategory;
            	
            	
            
           
        } catch (Exception e) {
            
            throw new AuraHandledException('An error occurred while retrieving the products from sub category.');
        }
        
    }
}