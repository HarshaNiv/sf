public without sharing class Snp_Checkout_Controller {
   private final static String ENP_POINT_URL = 'https://test.salesforce.com/services/oauth2/token';
    //For development and production https://login.salesforce.com/services/oauth2/token
    //And for sandbox https://test.salesforce.com/services/oauth2/token
    private final static String REQUEST_BODY = 'grant_type=password&client_id={0}&client_secret={1}&username={2}&password={3}';
    private final static string call_Backurl='https://sunpowergroupholdingsltd--commsit.sandbox.my.salesforce.com/services/authcallback/Einstein_Recommendation_Auth';
    private final static String USERNAME = 'yeswanth.kamaraju@cloudodyssey.co.commsit';
    private final static String PASSWORD = 'Raju@1996cFktEmD3d44ZHA6xXV22HOTt6';
    private final static String CONSUMER_KEY = '3MVG9GXbtnGKjXe7QPEjh2R9ehAsSjwNd0YuE72rKGWQzrvqEeAbx5A018QminWHzUJez0u4QI6TpfAFq';
    private final static String CONSUMER_SECRET = '59D703CF4B538203BB301466E10356BC0AE4EA190890DC03091622E7479ACA55';
    public  static string beartoken;
    
    private static final String STRIPE_API_BASE_URL = 'https://api.stripe.com/v1/';
    
    private static String getStripeSecretKey() {
        List<Integration_Credentials__mdt> credentials = [SELECT API_Key__c FROM Integration_Credentials__mdt WHERE MasterLabel = 'Stripe' LIMIT 1];
        if (!credentials.isEmpty()) {
            return credentials[0].API_Key__c;
        }
        return null;
    }
    @AuraEnabled
   public static String createPaymentIntent(Integer amount, String currencycode) {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(STRIPE_API_BASE_URL + 'payment_intents');
        req.setMethod('POST');
        
        String stripeSecretKey = getStripeSecretKey();
        if (stripeSecretKey == null) {
            System.debug('Stripe API Key not found');
            return null;
        }
        
        req.setHeader('Authorization', 'Bearer ' + stripeSecretKey);
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        String requestBody = 'amount=' + amount +
                             '&currency=' + currencycode +
                             '&automatic_payment_methods[enabled]=true';
        
        req.setBody(requestBody);
        
        try {
            HttpResponse res = http.send(req);
            if (res.getStatusCode() == 200) {
                // Parse the JSON response if needed
                return res.getBody();
            } else {
                System.debug('Stripe API Error: ' + res.getBody());
                return null;
            }
        } catch(Exception e) {
            System.debug('HTTP request exception: ' + e.getMessage());
            return null;
        }
    }
    public static OAuth getaccesstoken(){
        // Define credentials
      //  String clientId = '3MVG9GXbtnGKjXe7QPEjh2R9ehAsSjwNd0YuE72rKGWQzrvqEeAbx5A018QminWHzUJez0u4QI6TpfAFq.NxQ';
        //String clientSecret = '59D703CF4B538203BB301466E10356BC0AE4EA190890DC03091622E7479ACA55';
        //String username = 'yeswanth.kamaraju@cloudodyssey.co.commsit';
        //String password = 'Raju@1996cFktEmD3d44ZHA6xXV22HOTt6';
    /*End point Url to web service callout*/
    
    /*To generate Access token Method*/

        try{
            HttpRequest req = new HttpRequest();
            req.setEndpoint(ENP_POINT_URL);
            req.setMethod('POST');          
            Blob headerValue = Blob.valueOf(USERNAME + ':' + PASSWORD);
            //String authorizationHeader = 'BASIC ' +
           // EncodingUtil.base64Encode(headerValue);
            req.setHeader('Content-Type','application/x-www-form-urlencoded');
           // req.setHeader('Authorization', authorizationHeader); 
           // req.setBody(String.format(REQUEST_BODY ,new string[]{CONSUMER_KEY,CONSUMER_SECRET,USERNAME,PASSWORD,call_Backurl}));
                   req.setBody( 'grant_type=password' +
     '&client_id=3MVG9GXbtnGKjXe7QPEjh2R9ehAsSjwNd0YuE72rKGWQzrvqEeAbx5A018QminWHzUJez0u4QI6TpfAFq.NxQ' +
     '&client_secret=59D703CF4B538203BB301466E10356BC0AE4EA190890DC03091622E7479ACA55' +
     '&username=yeswanth.kamaraju@cloudodyssey.co.commsit' +
     '&password=Raju@1996cFktEmD3d44ZHA6xXV22HOTt6'+'&callbackurl=https://test.salesforce.com/services/authcallback/Einstein_Recommendation_Auth');
            req.setTimeout(60000);
            system.debug('****req'+req.getbody());
            Http http = new Http();
            HttpResponse res = http.send(req);
           
            OAuth objAuthenticationInfo = (OAuth)JSON.deserialize(res.getbody(), OAuth.class);
             beartoken=objAuthenticationInfo.access_token;
            system.debug('beartoken'+beartoken);
            return objAuthenticationInfo;
        }catch(CallOutException ce){
            throw ce;
        }
    }
 
        
    /*To get aouthentication detail Wrapper*/
	 public class OAuth{
        public String id{get;set;}
        public String issued_at{get;set;}
        public String instance_url{get;set;}
        public String signature{get;set;}
        public String access_token{get;set;}    
    }   
   
    
    @AuraEnabled
    public static String authorizepayments(){
        getaccesstoken();
       // system.debug('authorizepaymentsbeartoken'+beartoken);
        String webStoreId = '0ZEMU0000004CFL4A2';
        string cardHolderName='AmericanExpress';
         string cardNumber='378282246310005';
            string expiryMonth='11';
            string expiryYear='24';
           string cvv='141';
           string cardType='AmericanExpress';
        
        String creditCardInfo = '{ cardHolderName: "' + cardHolderName +
                        '", cardNumber: "' + cardNumber +
                        '", cardType: "' + cardType +
                        '", cvv: "' + cvv +
                        '", expiryMonth: "' + expiryMonth +
            '", expiryYear: "' + expiryYear + '"}';
        Map<String, String> creditCardInfoMap = new Map<String, String>{
    'cardHolderName' => 'harsh', // No need for explicit quotes; JSON.serialize will add them.
    'cardNumber' => '4242424242424242',
    'cardType' => 'Visa',
    'cvv' => '876',
    'expiryMonth' => '11',
    'expiryYear' => '28'
	};
	
        system.debug('creditCardInfo'+creditCardInfo);
        Http http = new Http();
        Map<String, string> cardPaymentMethodMap = new Map<String, string>();
        cardPaymentMethodMap.put('cardType','AmericanExpress');
        cardPaymentMethodMap.put('cvv','141');
        cardPaymentMethodMap.put('expiryYear','24');
        cardPaymentMethodMap.put('expiryMonth','11');
        cardPaymentMethodMap.put('cardNumber','378282246310005');
        cardPaymentMethodMap.put('cardHolderName','AmericanExpress');
		system.debug(cardPaymentMethodMap);
        /*{
            cardHolderName => 'John Doe', // Use the actual cardholder's name
            cardNumber => '4242424242424242', // Use the actual card number
            expiryMonth => '12', // Use the actual expiry month
            expiryYear => '24', // Use the actual expiry year
            cvv => '141'// Use the actual CVV code
          cardType => 'Visa'// Use the actual card type
        };*/
        Map<String, Object> payment=new Map<String, Object>();
        payment.put('cardPaymentMethod',cardPaymentMethodMap);
               // 'paymentTokenRequest' => cardPaymentMethodMap
           
        // Wrapping the cardPaymentMethodMap inside the paymentTokenRequest
       /* Map<String, Object> paymentTokenRequestMap = new Map<String, Object>{
            'paymentTokenRequest' => payment
        };*/


		// This is how you can serialize the map back to JSON if needed
		String jsonString = JSON.serialize(payment);
        system.debug(jsonString);
        string res;
        HttpRequest request = new HttpRequest();
       // request.setEndpoint('https://sunpowergroupholdingsltd--commsit.sandbox.my.site.com/services/data/v59.0/commerce/webstores/0ZEMU0000004CFL4A2/payments/token');
       
        request.setMethod('POST');  // Assuming it should be a POST request
        request.setBody(jsonString);
        request.setendpoint('https://api.stripe.com/v1/payment_intents');
        request.setHeader('Content-Type','application/json;charset=UTF-8');
        //String bearerToken = '00D1q0000000Ogz!AQEAQAlLLyrSzRm94vHks0ppecSj3ImV7my5l76hmESP0Sqsv_Wl_lzTnpovzUkTuaBf.xuo_lpHBmN2fUo4IooOhntKnvVA';
        request.setHeader('Authorization', 'Bearer ' + beartoken);
        system.debug('requestbody'+request.getbody());
       // system.debug('requesteader'+request.getHeader());
        try {
            HttpResponse response = http.send(request);
            system.debug(JSON.serialize(response.getbody()));
            if (response.getStatusCode() == 302) {
            // Get the new location from the response headers
            String newLocation = response.getHeader('Location');
                system.debug(newLocation);
            // Create a new request to follow the redirect
            HttpRequest newReq = new HttpRequest();
            newReq.setEndpoint(newLocation);
            newReq.setMethod('POST');
            newReq.setHeader('Authorization', 'Bearer ' + beartoken);
            newReq.setHeader('Content-Type', 'application/json;charset=UTF-8');
                system.debug(jsonString);
            newReq.setBody(jsonString);
            // Send the new request
          HttpResponse newRes = http.send(newReq);
            system.debug(newRes);
            system.debug(newRes.getBody());
             res=newRes.getBody();
        }
            return res;
            
        } catch (Exception e) {
            System.debug('Error making HTTP callout: ' + e.getMessage());
            return 'Error';
        }
    }
    
    public static string tokgen(){
        
    ConnectApi.PaymentMethodTokenizationRequest request = new ConnectApi.PaymentMethodTokenizationRequest();
    request.paymentGatewayId = '0b01q000000000fAAA';
    ConnectApi.CardPaymentMethodRequest cpmRequest = new ConnectApi.CardPaymentMethodRequest();
    cpmRequest.cardHolderName = 'Manager';
    cpmRequest.expiryMonth = 11;
    cpmRequest.expiryYear = 2222;
    cpmRequest.cardNumber = '4242424242424242';
    cpmRequest.cvv = '111';
    cpmRequest.cardCategory = ConnectApi.CardCategory.CreditCard;
    cpmRequest.cardType = ConnectApi.CardType.Visa.name();
    request.cardPaymentMethod = cpmRequest;
    ConnectApi.PaymentMethodTokenizationResponse response = ConnectApi.Payments.tokenizePaymentMethod(request);
    ConnectApi.PaymentMethodTokenizationGatewayResponse tgr =response.gatewayResponse;
       return tgr.gatewayToken;
    }
    

}