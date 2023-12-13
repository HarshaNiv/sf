public without sharing class SNP_ReorderController {
    
    @AuraEnabled(Cacheable=true)
    public static String createOrderToCart(String currentCommunityId, String currentOrderSummaryId,String currentUserId) {
        String cartId = getCartId(currentCommunityId);
        if (String.isBlank(cartId)) {
            return 'Error: Unable to retrieve cart ID';
        }
        return createOrder(currentCommunityId, currentOrderSummaryId, cartId);
       
    }

    private static Decimal getApiVersion() {
        return [SELECT ApiVersion FROM ApexClass WHERE Name = 'SNP_ReorderController' LIMIT 1].ApiVersion;
    }
    
    private static HttpRequest buildHttpRequest(String apiUrl, String httpMethod) {
        String baseUrl = URL.getOrgDomainUrl().toExternalForm();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(baseUrl + apiUrl);
        request.setMethod(httpMethod);
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());
        return request;
    }

    private static String getCartId(String currentCommunityId) {
        String webStoreId = SNP_CommerceHelper.getWebStoreId(currentCommunityId);
        String apiUrl = '/services/data/v' + getApiVersion() + '/commerce/webstores/' + webStoreId + '/carts/active';

        HttpRequest httpRequest = buildHttpRequest(apiUrl, 'PUT');
        HttpResponse response = makeHttpRequest(httpRequest);
        
        if (response != null && response.getStatusCode() == 200) {
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            return (String) responseMap.get('cartId');
        }
        return null;
    }

    private static String createOrder(String currentCommunityId, String currentOrderNumber, String cartId) {
        String webStoreId = SNP_CommerceHelper.getWebStoreId(currentCommunityId);
        String orderSummaryId=[SELECT Id from OrderSummary WHERE orderNumber=:currentOrderNumber LIMIT 1].Id;
        String apiUrl = '/services/data/v' + getApiVersion() + '/commerce/webstores/'+webStoreId+'/order-summaries/'+orderSummaryId+'/actions/add-order-to-cart';

        HttpRequest httpRequest = buildHttpRequest(apiUrl, 'POST');
        httpRequest.setBody(JSON.serialize(new Map<String, String>{'cartStateOrId' => cartId}));
        HttpResponse response = makeHttpRequest(httpRequest);
        
        if (response != null) {
            return response.getBody();
        }
        return 'Error: Unable to create order';
    }
    
    private static HttpResponse makeHttpRequest(HttpRequest request) {
        Http http = new Http();
        try {
            return http.send(request);
        } catch (Exception e) {
             
            return null;
        }
    }
}