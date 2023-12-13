public class nav_trans {
   @AuraEnabled
    public static String getRecs(String recommender, String anchorValues,String cookie) {
        System.debug('recommender- ' + recommender + ' anchorValues- ' + anchorValues);
        HttpRequest req = new HttpRequest();
        String CLIENT_ID = '3MVG95mg0lk4batgWw5MmXy2HXGG8V59.bvZcZu0F0uDsvjlIZHjqSNWhysQ6C9Sbp2EZvCpR5pQqB9r2TeCJ';
        String CLIENT_SECRET='CF7D1DAB8279AC9B7F2270ED569C439993F1E842A2F5FEB9CC50AA4A6A3375A2';
        String username ='hnr123@cgi.com';
        string password = 'Harsha@1998zgHGQdJMP1OcM0RQwxni80Z4';
        req.setMethod('POST');
        req.setHeader('Accept', 'application/json');
        req.setHeader('Content-Type','application/x-www-form-urlencoded');
        req.setEndpoint('https://AP25.salesforce.com/services/oauth2/token');
        req.setBody('grant_type=password' + '&client_id='+CLIENT_ID + '&client_secret='+CLIENT_SECRET + '&username='+username +'&password='+password);
        Http http = new Http();
        HTTPResponse response = http.send(req);
        wrapperclass obj = (wrapperclass)JSON.deserialize(response.getbody(), wrapperclass.class);
        System.debug('Body ' + response.getBody());
        System.debug('Body ' + obj);
        System.debug('Status ' + response.getStatus());
        System.debug('Status code ' + response.getStatusCode());
        return 'sample';
    }
     public class wrapperclass{    
        string access_token;
        string instance_url;
        string id;
        string token_type;
        string signature;
    }
}