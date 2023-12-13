public class StripeCheckoutService {

    private static final String STRIPE_ENDPOINT = 'https://api.stripe.com/v1/checkout/sessions';
    private static final String STRIPE_SECRET_KEY = 'sk_test_51NrjVHH1875OfnJj2EWv8RxE1Ln0UCGFLlckFxN9P8BCX8515tbUjM2thcj5FGJD6WUrvtMCVZA3qAv7wR4DviuW005ueiCdzo';  // Replace with your Stripe secret key

    public static String createCheckoutSession(Double amount, String cardCurrency, String successUrl, String cancelUrl) {
        HttpRequest request = new HttpRequest();
        request.setEndpoint(STRIPE_ENDPOINT);
        request.setMethod('POST');
        request.setHeader('Authorization', 'Bearer ' + STRIPE_SECRET_KEY);
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        // Prepare request parameters for Stripe Checkout session
        String body = '';
        body += 'payment_method_types[]=card';
        body += '&line_items[0][price_data][currency]=' + cardCurrency;
        body += '&line_items[0][price_data][product_data][name]=Your Product Name';
        body += '&line_items[0][price_data][unit_amount]=' + String.valueOf((Integer) (amount * 100)); // Convert to cents
        body += '&line_items[0][quantity]=1';
        body += '&mode=payment';
        body += '&success_url=' + EncodingUtil.urlEncode(successUrl, 'UTF-8');
        body += '&cancel_url=' + EncodingUtil.urlEncode(cancelUrl, 'UTF-8');

        request.setBody(body);

        Http http = new Http();
        HttpResponse response = http.send(request);

        if (response.getStatusCode() == 200) {
            System.debug('Response'+response.getBody());
            Map<String, Object> responseBody = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            if (responseBody.containsKey('id')) {
                return (String) responseBody.get('id');  // Return session ID
            }
        }

        // Error handling
        System.debug('Error creating Stripe checkout session: ' + response.getBody());
        return null;
    }
}