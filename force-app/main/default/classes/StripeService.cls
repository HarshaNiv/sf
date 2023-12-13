public class StripeService {
    
    private static final String STRIPE_API_URL = 'https://api.stripe.com/v1/';

    private static final String STRIPE_SECRET_KEY = 'sk_test_51NrjVHH1875OfnJj2EWv8RxE1Ln0UCGFLlckFxN9P8BCX8515tbUjM2thcj5FGJD6WUrvtMCVZA3qAv7wR4DviuW005ueiCdzo	'; // You should store this securely, not hardcoded.
    
    public static String createPaymentIntent(Integer amount, String cur) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        
        request.setEndpoint(STRIPE_API_URL + 'payment_intents');
        request.setMethod('POST');
        request.setHeader('Authorization', 'Bearer ' + STRIPE_SECRET_KEY);
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        String requestBody = 
            'amount=' + amount + 
            '&currency=' + cur +
            '&payment_method_types[]=card'; // Assuming card payment
        
        request.setBody(requestBody);
        
        HttpResponse response = http.send(request);
        
        system.debug('Response'+response.getBody());
        return response.getBody();
    }
    
     public static void tokenizeCard(String cardNumber, Integer expiryMonth, Integer expiryYear, String cvc) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(STRIPE_API_URL + 'tokens');
        req.setMethod('POST');
        req.setHeader('Authorization', 'Bearer ' + STRIPE_SECRET_KEY);
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        String body = 'card[number]=' + EncodingUtil.urlEncode(cardNumber, 'UTF-8');
        body += '&card[exp_month]=' + expiryMonth;
        body += '&card[exp_year]=' + expiryYear;
        body += '&card[cvc]=' + EncodingUtil.urlEncode(cvc, 'UTF-8');
        req.setBody(body);
        
        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
                 system.debug('Failed to tokenize card. Response: ' + res.getBody());
           
        } else {
          
            system.debug('Failed to tokenize card. Response: ' + res.getBody());
        }
     }
}



//Old/Legacy Key sk_test_51HJhwOEYJlmrexwWgay72VtD7zb0wINDqPtTxFsfQEW3ShjsTzOq4lKMLtswCKJfmlCSFSfS62ZzciM1goWQEII100L3GNkfqd