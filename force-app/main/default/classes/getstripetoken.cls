public class getstripetoken {
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