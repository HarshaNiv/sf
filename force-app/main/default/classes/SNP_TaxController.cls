/**
 * Author: [Owais Amin Ahanger]
 * Description: [global class to calculate net/vat tax for sunpower store ]
 * Date: [02-September-2023]
 * Test Class: [NA]
 */

global with sharing class SNP_TaxController implements sfdc_checkout.CartTaxCalculations {
    global sfdc_checkout.IntegrationStatus startCartProcessAsync(sfdc_checkout.IntegrationInfo jobInfo, Id cartId) {
        sfdc_checkout.IntegrationStatus integStatus = new sfdc_checkout.IntegrationStatus();
        
        try {
            // Get cart items and their total prices
            Map<String, Id> cartItemIdsBySKU = new Map<String, Id>();
            Map<String, Decimal> cartItemTotalPriceBySKU = new Map<String, Decimal>();
            List<CartItem> cartItems = getCartItems(cartId);
            
            for (CartItem cartItem : cartItems) {
                String cartItemSKU = getCartItemSKU(cartItem); // Validate cart
                if (cartItemSKU == null) {
                    return handleCartValidationFailure(integStatus, 'The SKUs for all products in your cart must be defined.', jobInfo, cartId);
                }
                cartItemIdsBySKU.put(cartItemSKU, cartItem.Id);
                cartItemTotalPriceBySKU.put(cartItemSKU, cartItem.TotalPrice);
            }
            
            // Compute total tax for each SKU
            Map<String, TaxDataFromExternalService> rateAndAmountFromExternalServicePerSku = computeTotalTax(cartItemTotalPriceBySKU);
            
            // Delete previous tax records
            deletePreviousTaxes(cartItemIdsBySKU.values());
            
            // Insert new tax records
            insertTaxRecords(cartItemIdsBySKU, rateAndAmountFromExternalServicePerSku, jobInfo,integStatus,cartId);
            
            integStatus.status = sfdc_checkout.IntegrationStatus.Status.SUCCESS;
        } catch (Exception e) {
            return handleCartValidationFailure(integStatus, 'An error has occurred: ' + e.getMessage(), jobInfo, cartId);
        }
        
        return integStatus;
    }
    
 /**
     * Retrieve cart items for a given cart ID.
     *
     * @param cartId The ID of the cart.
     * @return List of CartItem records.
     */
    private List<CartItem> getCartItems(Id cartId) {
        try{
            return [
            SELECT Sku, TotalPrice, Type
            FROM CartItem
            WHERE CartId = :cartId
            
        ];
        }
        catch(Exception e){
            throw new SNP_CustomException(e.getMessage()+' on cart item');
        }
         
    }
    
     /**
     * Get the SKU for a CartItem.
     *
     * @param cartItem The CartItem to get the SKU for.
     * @return The SKU or null if not found.
     */
    private String getCartItemSKU(CartItem cartItem) {
        if (cartItem.Type == 'Product') {
            if (String.isBlank(cartItem.Sku)) {
                return null;
            }
           	return cartItem.Sku;
        } else if (cartItem.Type == 'Charge') {
            return 'ChargeSKU';
        }
        return null;
    }
    
     /**
     * Delete previous tax records for a list of CartItem IDs.
     *
     * @param cartItemIds List of CartItem IDs to delete tax records for.
     */
    private void deletePreviousTaxes(List<Id> cartItemIds) {
        try{
            delete [
            SELECT Id
            FROM CartTax
            WHERE CartItemId IN :cartItemIds
           
        ];
        }catch(Exception e){
            throw new SNP_CustomException(e.getMessage()+ ' on cart tax');
        }
        
    }
    
     /**
     * Insert tax records for SKUs.
     *
     * @param cartItemIdsBySKU Mapping of SKU to CartItem ID.
     * @param rateAndAmountFromExternalServicePerSku Mapping of SKU to TaxDataFromExternalService.
     * @param jobInfo The integration info.
     * @param integStatus The integration status.
     * @param cartId The cart ID.
     */
    
    private void insertTaxRecords(Map<String, Id> cartItemIdsBySKU, Map<String, TaxDataFromExternalService> rateAndAmountFromExternalServicePerSku,sfdc_checkout.IntegrationInfo jobInfo,sfdc_checkout.IntegrationStatus integStatus, Id cartId) {
        CartTax[] cartTaxestoInsert = new List<CartTax>();
        for (String sku : cartItemIdsBySKU.keySet()) {
            TaxDataFromExternalService rateAndAmountFromExternalService = rateAndAmountFromExternalServicePerSku.get(sku);
            if (rateAndAmountFromExternalService == null) {
                handleCartValidationFailure(integStatus, 'The product with SKU ' + sku + ' could not be found', jobInfo, cartId);
            }
            cartTaxestoInsert.add(createCartTaxRecord(cartItemIdsBySKU.get(sku), sku, rateAndAmountFromExternalService));
        }
        insert cartTaxestoInsert;
    }
    
     /**
     * Create a CartTax record.
     *
     * @param cartItemId The CartItem ID.
     * @param sku The SKU.
     * @param taxData The tax data.
     * @return The CartTax record.
     */
    private CartTax createCartTaxRecord(Id cartItemId, String sku, TaxDataFromExternalService taxData) {
        try{
            return new CartTax(
            Amount = taxData.getAmount(),
            CartItemId = cartItemId,
            Name = taxData.getTaxName(),
            TaxCalculationDate = Date.today(),
            TaxRate = taxData.getRate(),
            TaxType = 'Actual'
        );
        }catch(Exception e){
            throw new SNP_CustomException(e.getMessage()+ 'cart tax');
        }
       
    }
    
     /**
     * Handle a cart validation failure.
     *
     * @param integrationStatus The integration status.
     * @param errorMessage The error message.
     * @param jobInfo The integration info.
     * @param cartId The cart ID.
     * @return The updated integration status.
     */
    private sfdc_checkout.IntegrationStatus handleCartValidationFailure(
        sfdc_checkout.IntegrationStatus integrationStatus, String errorMessage, sfdc_checkout.IntegrationInfo jobInfo, Id cartId) {
        integrationStatus.status = sfdc_checkout.IntegrationStatus.Status.FAILED;
        CartValidationOutput cartValidationError = createCartValidationOutputRecord(errorMessage, jobInfo, cartId);
        insert cartValidationError;
        return integrationStatus;
    }
    
     /**
     * Create a CartValidationOutput record.
     *
     * @param errorMessage The error message.
     * @param jobInfo The integration info.
     * @param cartId The cart ID.
     * @return The CartValidationOutput record.
     */
    private CartValidationOutput createCartValidationOutputRecord(String errorMessage, sfdc_checkout.IntegrationInfo jobInfo, Id cartId) {
        return new CartValidationOutput(
            BackgroundOperationId = jobInfo.jobId,
            CartId = cartId,
            Level = 'Error',
            Message = errorMessage.left(255),
            Name = (String)cartId + ':' + jobInfo.jobId,
            RelatedEntityId = cartId,
            Type = 'Taxes'
        );
    }

     /**
     * Compute total tax based on cart item total amounts by SKU.
     *
     * @param cartItemTotalAmountBySKU Mapping of SKU to total amount.
     * @return Mapping of SKU to TaxDataFromExternalService.
     */
    private Map<String, TaxDataFromExternalService> computeTotalTax(Map<String, Decimal> cartItemTotalAmountBySKU) {
        if (cartItemTotalAmountBySKU == null) {
            throw new SNP_CustomException('Input SKUs list is empty or undefined.');
        }
        
        Decimal taxRate = 20.00;
        Map<String, TaxDataFromExternalService> taxDataFromStaticServiceBySKU = new Map<String, TaxDataFromExternalService>();
        
        for (String sku : cartItemTotalAmountBySKU.keySet()) {
            taxDataFromStaticServiceBySKU.put(sku, new TaxDataFromExternalService(
                taxRate,
                (cartItemTotalAmountBySKU.get(sku) * taxRate)/100,
                'VAT'
            ));
        }
        
        return taxDataFromStaticServiceBySKU;
    }
    
    // Wrapper class to represent tax response
    class TaxDataFromExternalService {
        private Decimal rate;
        private Decimal amount;
        private String taxName;
        
        public TaxDataFromExternalService () {
            rate = 0.0;
            amount = 0.0;
            taxName = '';
        }
        
        public TaxDataFromExternalService (Decimal someRate, Decimal someAmount, String someTaxName) {
            rate = someRate;
            amount = someAmount;
            taxName = someTaxName;
        }
        
        public Decimal getRate() {
            return rate;
        }
        
        public Decimal getAmount() {
            return amount;
        }
        
        public String getTaxName() {
            return taxName;
        }
    }
}