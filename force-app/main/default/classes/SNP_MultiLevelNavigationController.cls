/**
 * Author: [Owais Amin Ahanger]
 * Description: [To fetch categories,subcategoires and related CMS images]
 * Date: [27-June-2023]
 * Test Class: 
 */
public with sharing class SNP_MultiLevelNavigationController {

    /**
     * Retrieves subcategories based on the parent category ID.
     * @param currentCommunityId The ID of the current community.
     * @param parentCategoryId The ID of the parent category.
     * @return List of subcategory ProductCategory records.
     */
    @AuraEnabled(cacheable=true)
    public static List<ProductCategory> getSubCategories(String currentCommunityId, String parentCategoryId) {
        try{
            String currentWebStoreId = SNP_CommerceHelper.getWebStoreId(currentCommunityId);
        	String currentCatalogId = SNP_CommerceHelper.getCatalogId(currentWebStoreId);
			List<ProductCategory> pcList= [
                SELECT Id,Name FROM ProductCategory 
                WHERE CatalogId=:currentCatalogId
                AND ParentCategoryId = :parentCategoryId
                						
            ];
            if (pcList.isEmpty()) {
                throw new SNP_CustomException('No categories found .');
            }
            
            return pcList;
     
        }
        catch(Exception e){
            throw new SNP_CustomException('An error occurred :-'+e.getMessage());
        }
        
    }

    /**
     * Retrieves CMS images for a specified community and category.
     * @param communityId The ID of the community.
     * @param categoryId The ID of the category.
     * @return List of ConnectApi.ManagedContentVersion for the CMS images.
     */
    @AuraEnabled
    public static List<Map<String, ConnectApi.ManagedContentNodeValue>> getCmsImages(Id currentCommunityId, Id categoryId) { 
        
        try{
            List<String> electronicMediaIds = new List<String>();
        	for (ProductCategoryMedia pcm : [
            SELECT ElectronicMediaId
            FROM ProductCategoryMedia
            WHERE ProductCategoryId = :categoryId
        ]) {
            electronicMediaIds.add(pcm.ElectronicMediaId);
        }
            if (electronicMediaIds.isEmpty()) {
                throw new SNP_CustomException('No images found .');
            }
		
		ConnectApi.ManagedContentVersionCollection contentCollection=SNP_CommerceHelper.getManagedContent(currentCommunityId,electronicMediaIds);            
			
            List<Map<String, ConnectApi.ManagedContentNodeValue>> contentNodesMapList = new List<Map<String, ConnectApi.ManagedContentNodeValue>>();

            for(Integer i=0;i<contentCollection.total;i++){
                contentNodesMapList.add(contentCollection.items[i].contentNodes);
             }
          
        return contentNodesMapList;
            
        }
        catch(Exception e){
              throw new SNP_CustomException('An error occurred .'+e.getMessage());
        }
         
    }

}