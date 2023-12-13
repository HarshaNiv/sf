public class Rich_text {
 
    @AuraEnabled(cacheable = true)
    public static String getRecent() {
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
        
        String orgDomain = 'cgi-2f9-dev-ed.develop.lightning.force.com';
        String webstoreId = '0ZE5h000000c1ZaGAI';
        //String endpoint1 = 'https://'+ orgDomain +'/services/data/v55.0/sobjects/Product2/01t5h000008dbLDAAY/richTextImageFields/Photo__c/0EM5h0000089gB4';
        String endpoint1 = 'https://'+ orgDomain +'/services/data/v55.0/sobjects/Product2/01t5h000008dbLDAAY';
        system.debug(endpoint1);
        //Http http = new Http();
        HttpRequest req1 = new HttpRequest();
        req1.setEndpoint(endpoint1);
        system.debug(req1);
        //req.setHeader('Cookie', cookie);
        req1.setMethod('GET');
        req1.setHeader('Authorization', 'Bearer ' + obj.access_token);
        
        system.debug(req1);
        HTTPResponse res = http.send(req1);
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
            system.debug(newRes);
            system.debug(newRes.getBody());
             return newRes.getBody();
        }
        else{
        return res.getBody();
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