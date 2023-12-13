public class RecommendationService {
    private Http client;

    public RecommendationService(Http client) {
        this.client = client;
    }

    public String getRecs(String recommender, String anchorValues, String webstoreId) {
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setMethod('GET');
        httpRequest.setEndpoint('callout:Einstein_Recommendation/services/data/v55.0/commerce/webstores/' + webstoreId + '/ai/recommendations?asGuest=true&recommender=' + recommender + '&anchorValues=' + anchorValues);

        HttpResponse res = client.send(httpRequest);

        System.debug('Response Code- ' + res.getStatusCode());
        System.debug('Response Body- ' + res.getBody());

        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new AuraHandledException('The status code is ' + res.getStatusCode());
        }
    }
}