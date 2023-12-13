// SIT org

public with sharing class snp_pdp_relatedProductsController {
    @AuraEnabled
    public static String getRecs(String recommender, String anchorValues, String cookie, String communityId) {
        try {
            System.debug('recommender- ' + recommender + ' anchorValues- ' + anchorValues);
            String webstoreId = getWebstoreId(communityId);
            
            if (recommender != null && anchorValues != null) {
                RecommendationService recommendationService = new RecommendationService(new Http());
                return recommendationService.getRecs(recommender, anchorValues, webstoreId);
            } else {
                throw new AuraHandledException('Recommender and anchor values cannot be null');
            }
        } catch (Exception e) {
            throw new AuraHandledException('Exception in SnpPdpRelatedProductsController.getRecs- ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static ConnectApi.PricingResult ProductPrice(String userId, List<String> productIds, Boolean isGuest, String communityId){
        try {
            System.debug('productIds - ' + productIds);
            String webstoreId = getWebstoreId(communityId);
            String accountOrGuestProfileId;
            if(!isGuest){
                accountOrGuestProfileId = getEffectiveAccountID(userId);
            }else{
                accountOrGuestProfileId = '';
            }
           //ConnectApi.PricingResult priceList = new ConnectApi.PricingResult();
            List<ConnectApi.PricingLineItemInput> pdllist = new List<ConnectApi.PricingLineItemInput>();
            if(productIds.size() > 0){
                for(String pdcId: productIds){
                    ConnectAPI.PricingLineItemInput pdl = new ConnectAPI.PricingLineItemInput();
                    pdl.productid = pdcId;
                    pdllist.add(pdl);
                }
                ConnectApi.PricingInput pdli = new ConnectApi.PricingInput();
                pdli.pricingLineItems = pdllist;
                
                //ConnectApi.PricingInput.pricingLineItems pdli = pdllist;
                ConnectApi.PricingResult priceList = ConnectApi.CommerceStorePricing.getProductPrices(webstoreId, accountOrGuestProfileId, pdli);
                System.debug('priceList - ' + priceList);
                return priceList;  
            }else {
                throw new AuraHandledException('Could not find product Ids');
            }
        } catch (Exception e) {
            throw new AuraHandledException('Exception in ProductPrice method- ' + e.getMessage());
        }
         
    }

    public static string getWebstoreId(String communityId){
        try {
            String webstoreId = [SELECT Id, Name, WebStoreId, NetworkId FROM WebStoreNetwork WHERE NetworkId =: communityId].WebStoreId;
            if(webstoreId != Null){
                return webstoreId;
            }else{
                throw new AuraHandledException('Webstore Id not found');
            }
            
        } catch (Exception e) {
            throw new AuraHandledException('Exception in getWebstoreID - ' + e.getMessage());
        }
    }

    public static string getEffectiveAccountID(String userId){
        try {
            if(userId != Null){
                String effectiveAccountId = [SELECT Id, Name, AccountId FROM User WHERE Id =: userId].AccountId;
                if(effectiveAccountId != Null){
                    return effectiveAccountId;
                }else{
                    throw new AuraHandledException('No user recoed found');
                }
            }else{
                throw new AuraHandledException('User Id is Null');
            }
        } catch (Exception e) {
            throw new AuraHandledException('Exception in getEffectiveAccountID - ' + e.getMessage());
        }
    }

    public static string getGuestProfileId(){
        try{
            String profileId = [SELECT Id, Name, UserType FROM Profile WHERE UserType = 'Guest' AND Name = 'PowerLED Profile'].Id;
            if(profileId != null){
                return profileId;
            }else{
                throw new AuraHandledException('Could not find guest profile.');
            }

        }catch (Exception e) {
            throw new AuraHandledException('Exception in getting guest profile Id - ' + e.getMessage());
        }
    }
    
}