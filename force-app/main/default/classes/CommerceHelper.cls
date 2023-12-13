/**
 * Author: [Owais Amin Ahanger]
 * Description: [Contains frequently used methods]
 * Date: [27-June-2023]
 * Test Class: 
 */
public class CommerceHelper {
     /**
     * Retrieves the WebStoreId based on the current community ID.
     * @param currentCommunityId The ID of the current community.
     * @return The WebStoreId.
     */
     public static Id getWebStoreId(Id currentCommunityId) {
        try{
            return [
            SELECT WebStoreId
            FROM WebStoreNetwork
            WHERE NetworkId = :currentCommunityId
            LIMIT 1
        ].WebStoreId;
        }
        catch(Exception e){
             throw new AuraHandledException('An error occurred while retrieving the  WebStore Id.');
        }
        
    }
    
    
    
    /**
     * Retrieves the CatalogId based on the WebStoreId.
     * @param webStoreId The WebStoreId.
     * @return The CatalogId.
     */
    public static Id getCatalogId(Id webStoreId) {
        try{
            return [
            SELECT ProductCatalogId
            FROM WebStoreCatalog
            WHERE SalesStoreId = :webStoreId
            LIMIT 1
        ].ProductCatalogId;
        }catch(Exception e){
            throw new AuraHandledException('An error occurred while retrieving the catalog id.');
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
            throw new AuraHandledException('An error occurred '+e.getMessage());
        }
    }

}