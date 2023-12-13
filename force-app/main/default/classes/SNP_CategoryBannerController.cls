/**
 * Author: Owais Amin Ahanger
 * Date: 27-June-2023
 * Description: This controller class provides functionalities related to Product Categories 
 * 				and their associated banner images.Primarily, it retrieves the banner image 
 * 				associated with a given product category and also fetches the name and 
 * 				description of a product category.
 * Test Class: 
 */

public with sharing class SNP_CategoryBannerController {
    
    
/*
* Inner Class: CombinedResponse
* Description: A utility inner class designed to encapsulate and 
			   consolidate the combined data of  a product
* 			   category details and image assocaited with it.
* 
* Properties:
* - categoryListResponse: A list containing the details of product categories.
* - contentNodesResponse: A map associating a String key with the managed content node value fetched from the Connect API.

*/
      public class CombinedResponse {
        @AuraEnabled  
        public List<ProductCategory> categoryListResponse { get; set; }
        @AuraEnabled
        public Map<String, ConnectApi.ManagedContentNodeValue> contentNodesResponse { get; set; }
	
        // Default constructor
        public CombinedResponse() {
            categoryListResponse = new List<ProductCategory>();
            contentNodesResponse = new Map<String, ConnectApi.ManagedContentNodeValue>();
        }

         // Parameterized constructor
        public CombinedResponse(List<ProductCategory> categoryList, Map<String, ConnectApi.ManagedContentNodeValue> contentNodes) {
            this.categoryListResponse = categoryList;
            this.contentNodesResponse = contentNodes;
        }
    }
    
    

     /**
     * Retrieves the category banner image by category ID.
     * @param currentCommunityId The ID of the current community.
     * @param categoryId The ID of the category.
     * @return Map<String, ConnectApi.ManagedContentNodeValue> representing the category banner image.
     */
    @AuraEnabled(cacheable=true)
    public static CombinedResponse  getCategoryBannerImageById(String currentCommunityId, String categoryId) {
        List<String> electronicMediaIds = new List<String>();

        try {
             // Retrieve ProductCategory Details for the given category
            List<ProductCategory> productCategoryDescDetail =  getCategoryDescription(categoryId);
            
            // Retrieve ElectronicMediaId/Banner Image for the given category
            //Banner Images Sort Order >> 1
             //Tile Images Sort Order >> 2
            List<ProductCategoryMedia> pcmList = [
                                                    SELECT ElectronicMediaId
                                                    FROM ProductCategoryMedia
                                                    WHERE ProductCategoryId = :categoryId  
                                                    ORDER BY SortOrder ASC   
                                                    LIMIT 1									
                                                ];
            
            if (pcmList.isEmpty()) {
                throw new SNP_CustomException('No banner image found.');
            }


             // Fetch content associated with the media IDs
            ConnectApi.ManagedContentVersionCollection contentCollection = SNP_CommerceHelper.getManagedContent(currentCommunityId, new List<String>{ pcmList[0].ElectronicMediaId});
			return new CombinedResponse(productCategoryDescDetail,contentCollection.items[0].contentNodes);
            
        } catch (Exception e) {
            throw new SNP_CustomException('An error occurred :- '+ e.getMessage());
        }
    }



    
     /**
     * Retrieves the category name and description by category ID.
     * @param categoryId The ID of the category.
     * @return List<ProductCategory> containing the category name and description.
     */

    private static List<ProductCategory> getCategoryDescription(String categoryId) {
        try {
            List<ProductCategory> categoryList = [
                                                    SELECT Name, Description
                                                    FROM ProductCategory
                                                    WHERE Id = :categoryId
                                                    LIMIT 1
                                                ];

            if (categoryList.isEmpty()) {
                throw new SNP_CustomException('No category found.');
            }

        	return categoryList;
        } catch (Exception e) {
            throw new SNP_CustomException('An error occurred :- '+e.getMessage());
        }
    }
    
    
    
    
    /**
     * Checks and updates the sort order of ProductCategoryMedia based on specific ElectronicMediaGroup names.
     * This method specifically sets the sort order for Banner and Tile media groups.
     */
     @AuraEnabled(cacheable=true)
    public static void updateCategoryMediaSortOrder(){
        //Banner Image Sort Order >> 1
        //Tile Image Sort Order >> 	 2
        try{
            //Get ElectronicMediaIdGroup Of Banner Images
        String categoryBannerMediaGroupId=[Select Id  FROM ElectronicMediaGroup WHERE NAME LIKE '%Banner%'].Id;
        UpdateSortOrder(categoryBannerMediaGroupId,1);
        
        //Get ElectronicMediaIdGroup Of Tile Images
      	String categoryTileMediaGroupId= [Select Id  FROM ElectronicMediaGroup WHERE NAME LIKE '%Tile%'].Id;
        UpdateSortOrder(categoryTileMediaGroupId,2);
        }
        catch(EXception e){
            	throw new SNP_CustomException('Sort order for category images failed to update .');
        }
    }
    
    
    
    /**
     * Updates the sort order of ProductCategoryMedia records based on the provided ElectronicMediaGroupId.
     * @param Id The ElectronicMediaGroupId to filter ProductCategoryMedia records.
     * @param sOrder The sort order to be set for the retrieved ProductCategoryMedia records.
     */
    private static void UpdateSortOrder(String Id, Integer sOrder){
        
            List<ProductCategoryMedia> pcmList = [
                SELECT Id, SortOrder 
                FROM ProductCategoryMedia 
                WHERE ElectronicMediaGroupId = :Id
            ];
    
    // Create a separate list to store the updated records
    List<ProductCategoryMedia> recordsToUpdate = new List<ProductCategoryMedia>();
    
    for(ProductCategoryMedia pcm : pcmList) {
        pcm.SortOrder = sOrder;
        recordsToUpdate.add(pcm); // Add the updated record to the list
    }
    
    // Update all the records in one DML operation
    update recordsToUpdate;
}

    
}