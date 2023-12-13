/**
 * Author: [Owais Amin Ahanger]
 * Description: [Contains frequently used methods]
 * Date: [27-June-2023]
 * Test Class: 
 */
public class SNP_CommerceHelper {
    
     // A cache which maps community Ids to WebStore Ids
     private static Map<String, String> communityIdToWebStoreIdCache = new Map<String, String>();
    
     /**
     * Retrieves the WebStoreId based on the current community ID.
     * @param currentCommunityId The ID of the current community.
     * @return The WebStoreId.
     */
     public static String getWebStoreId(String currentCommunityId) {
        try{
             if (communityIdToWebStoreIdCache.containsKey(currentCommunityId)) {
        			return communityIdToWebStoreIdCache.get(currentCommunityId);
      			}
        else {
        		String webStoreId = [
                                      SELECT WebStoreId
                                      FROM WebStoreNetwork
                                      WHERE NetworkId = :currentCommunityId
                                      LIMIT 1].WebStoreId;
        		communityIdToWebStoreIdCache.put(currentCommunityId, webStoreId);
        return webStoreId;
      }
        }
        catch(Exception e){
             throw new SNP_CustomException('An error occurred while retrieving the  WebStore Id.');
        }
        
    }
    
    
    
    /**
     * Retrieves the CatalogId based on the WebStoreId.
     * @param webStoreId The WebStoreId.
     * @return The CatalogId.
     */
    public static String getCatalogId(String webStoreId) {
        try{
            return [
                        SELECT ProductCatalogId
                        FROM WebStoreCatalog
                        WHERE SalesStoreId = :webStoreId
                        LIMIT 1
                    ].ProductCatalogId;
        }catch(Exception e){
            throw new SNP_CustomException('An error occurred while retrieving the catalog id.');
        }
        
    }
    
    /**
     * Retrieves the contentCollection based on the communityId and managedContentIds
     * @param webStoreId The communityId.
     * @param webStoreId The managedContentIds.
     * @returns ConnectApi.ManagedContentVersionCollection
     */
    public static ConnectApi.ManagedContentVersionCollection getManagedContent(Id communityId, List<String> managedContentIds){
        try{
             ConnectApi.ManagedContentVersionCollection contentCollection = ConnectApi.ManagedContent.getManagedContentByIds(
                communityId,
                managedContentIds,
                null,
                null,
                'en_US',
                'cms_Image',
                false
            );
            return contentCollection;
        }
        catch(Exception e){
            throw new SNP_CustomException('Error '+e.getMessage());
        }
    }
  
   
}