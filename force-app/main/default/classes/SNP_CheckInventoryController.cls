/**
 * Author: [Owais Amin Ahanger]
 * Description: []
 * Date: [14-Aug-2023]
 * Test Class:[] 
 */

public without sharing class SNP_CheckInventoryController {
	
    /**
     * Fetches the available product quantity for a given product ID.
     * @param currentProductId The ID of the product to fetch quantity for.
     * @return The available product quantity.
     * @throws SNP_CustomException If an error occurs while fetching the stock inventory.
     */
    @AuraEnabled(Cacheable=true)
    public static Decimal getAvailableProductQuantity(String currentProductId){
        try {
            return [SELECT Quantity_Available__c FROM Product2 WHERE Id = :currentProductId].Quantity_Available__c;
            
        } catch (Exception e) {
            throw new SNP_CustomException('An error occurred while trying to fetch stock inventory'+e.getMessage());
        }
    }
}