/**
 * Author: [Owais Amin Ahanger]
 * Description: [Fetches Sub Category Id,Name and Tile Image]
 * Date: [05-July-2023]
 * Test Class: 
 */
public with sharing class SNP_SubCategoriesController {

 /**
     * Fetches the ParentCategoryId based on the categoryId.
     * @param currentCommunityId - The ID of the category.
     * @return boolean to show or hide sub category grid.
     * @throws CustomException if no categories are found or an error occurs.
     */    
    @AuraEnabled(cacheable=true)
    public static Boolean checkParentOrSubCategory(Id categoryId){
        try{
        Id parentCategory=[SELECT ParentCategoryId FROM ProductCategory WHERE Id=:categoryId].ParentCategoryId;
      
        if(parentCategory==null){
            
            return true;	 //Show sub category grid template
        }
       return false;		//Hide sub category grid template
        }
    	catch(Exception e){
            throw new SNP_CustomException('An error occured while trying to check a parent or sub category.');
        }
    
    }
    
        
 /**
     * Fetches the sub-categories based on the current community ID.
     * @param currentCommunityId - The ID of the current community.
     * @return List of ProductCategory objects representing the sub-categories.
     * @throws CustomException if no categories are found or an error occurs.
     */
    @AuraEnabled(cacheable=true)
    public static List<ProductCategory>getSubCategories(String currentCommunityId){
        try{
            String currentWebStoreId=SNP_CommerceHelper.getWebStoreId(currentCommunityId);
            String currentCatalogId=SNP_CommerceHelper.getCatalogId(currentWebStoreId);
           // SNP_CommerceHelper.checkCategoryMediaSortOrder();
            List<ProductCategory> pcList= [
                                            SELECT Id,Name FROM ProductCategory 
                                            WHERE CatalogId=:currentCatalogId
                                            AND ParentCategoryId !=NULL                                              
                                        ];
            
            if (pcList.isEmpty()) {
                throw new SNP_CustomException('No categories found .');
            }
            
            return pcList;
            
        }
        catch(Exception e){
            throw new SNP_CustomException('Error. '+e.getMessage());
        }
    }
    
/**
     * Retrieves the tile image for a specific sub-category.
     * @param currentCommunityId - The ID of the current community.
     * @param subCategoryId - The ID of the sub-category.
     * @return Map of String and ConnectApi.ManagedContentNodeValue representing the tile image.
     * @throws CustomException if no category is found, no category banner image is found, or an error occurs.
     */
    
    @AuraEnabled(cacheable=true)
    public static Map<String, ConnectApi.ManagedContentNodeValue> getSubCategoryTileImageById(Id currentCommunityId, String subCategoryId) {
       
        try {
            //Banner Images Sort Order >> 1
            //Tile Images Sort Order >> 2
            
            List<ProductCategoryMedia> pcmList = [
                                                    SELECT ElectronicMediaId
                                                    FROM ProductCategoryMedia
                                                    WHERE ProductCategoryId = :subCategoryId
													ORDER BY SortOrder DESC   
                                                    LIMIT 1   
                                                ];

            
       if (pcmList.isEmpty()) {
          	throw new SNP_CustomException('No tile image associated .');
            }
           
            ConnectApi.ManagedContentVersionCollection contentCollection = SNP_CommerceHelper.getManagedContent(currentCommunityId, new List<String>{ pcmList[0].ElectronicMediaId});

            return contentCollection.items[0].contentNodes;
        } 
        catch (Exception e) {
            throw new SNP_CustomException('An error occurred while retrieving the category tile image.'+ e.getMessage());
        }
            
    }
    
    
    
   

}