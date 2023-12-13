public class recommenderDemo {
    @AuraEnabled(cacheable=true)
    public static String getRec(){
        HttpRequest req = new HttpRequest();
        String CLIENT_ID = '3MVG9GXbtnGKjXe7QPEjh2R9ehAsSjwNd0YuE72rKGWQzrvqEeAbx5A018QminWHzUJez0u4QI6TpfAFq.NxQ';
        String CLIENT_SECRET='59D703CF4B538203BB301466E10356BC0AE4EA190890DC03091622E7479ACA55';
        String username ='harshavardhan.taduvai@cloudodyssey.co';
        string password = 'Harsha1@#2B6SsQqxtIejqDIaZF0flprNC';
        req.setMethod('POST');
        req.setHeader('Accept', 'application/json');
        req.setHeader('Content-Type','application/x-www-form-urlencoded');
        req.setEndpoint('https://sunpowergroupholdingsltd--commsit.sandbox.my.salesforce.com/services/oauth2/token');
        req.setBody('grant_type=password' + '&client_id='+CLIENT_ID + '&client_secret='+CLIENT_SECRET + '&username='+username +'&password='+password);
        Http http = new Http();
        HTTPResponse response = http.send(req);
        wrapperclass obj = (wrapperclass)JSON.deserialize(response.getbody(), wrapperclass.class);
        System.debug('Body ' + response.getBody());
        System.debug('Body ' + obj);
        System.debug('Status ' + response.getStatus());
        System.debug('Status code ' + response.getStatusCode());
        String orgDomain = 'sunpowergroupholdingsltd--commsit.sandbox.my.salesforce.com';
        String webstoreId = '0ZE7Y0000000Da7WAE';
        String endpoint1 = 'https://'+orgDomain +'/services/data/v59.0/commerce/webstores/'+webstoreId+'/ai/recommendations?language=en-US&asGuest=true&recommender='+'CustomersWhoBoughtAlsoBought'+'&anchorValues='+'01t0Y000000o9K7QAI';
        system.debug(endpoint1);
        //Http http = new Http();
        HttpRequest req1 = new HttpRequest();
        req1.setEndpoint(endpoint1);
        system.debug(req1);
      //  req.setHeader('Cookie', cookie);
        req1.setMethod('GET');
        req1.setHeader('Authorization', 'Bearer ' + obj.access_token);
        system.debug(req1);
        HTTPResponse res = http.send(req1);
        // String redirectUrl = httpResponse.getHeader('Location');
        // System.debug('Redirect URL: ' + redirectUrl);
        if (res.getStatusCode() == 302) {
            // Get the new location from the response headers
            String newLocation = res.getHeader('Location');
            // Create a new request to follow the redirect
            HttpRequest newReq = new HttpRequest();
            newReq.setEndpoint(newLocation);
            newReq.setMethod('GET');
            newReq.setHeader('Authorization', 'Bearer ' + obj.access_token);
            // Send the new request
            HttpResponse newRes = http.send(newReq);
            system.debug('43 '+newRes);
            system.debug('44 '+newRes.getBody());
           //  return newRes.getBody();
           return newRes.getBody();
        }
        else{
        system.debug('48 '+res);
        system.debug('49 '+res.getBody());
        return res.getBody();
        //String resp = string.ValueOf(res);
        //System.debug('resp- ' + resp);
       // return res.getBody();
        }
   
    }
     public class wrapperclass{    
        string access_token;
        string instance_url;
        string id;
        string token_type;
        string signature;
    }

}