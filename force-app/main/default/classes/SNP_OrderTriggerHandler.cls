/**

 * Description: [Dummmy Class For POC To Convert Order Into Opportunity]
 * Date: []

 */

public class SNP_OrderTriggerHandler {
    
    public static void handleAfterInsert(List<Order> newOrders) {
        List<Opportunity> opportunitiesToInsert = new List<Opportunity>();

        for (Order order : newOrders) {
            if (isOrderValid(order)) {
                Opportunity newOpportunity = createOpportunityFromOrder(order);
                opportunitiesToInsert.add(newOpportunity);
            } else {
                order.addError('Cannot create Opportunity: Required fields are missing.');
            }
        }

        if (!opportunitiesToInsert.isEmpty()) {
            insert opportunitiesToInsert;
        }
    }

    private static Boolean isOrderValid(Order order) {
        return !String.isBlank(order.AccountId) &&
               order.EffectiveDate != null &&
               !String.isBlank(order.OwnerId) &&
               !String.isBlank(order.OrderNumber) &&
               !String.isBlank(order.CurrencyIsoCode);
    }

    private static Opportunity createOpportunityFromOrder(Order order) {
        return new Opportunity(
            AccountId = order.AccountId,
            OwnerId = order.OwnerId,
            Name = 'Opportunity created from Order Record',
            StageName = 'Submitted',
            CloseDate = order.EffectiveDate,
            Customer_PO__c = order.OrderNumber,
            CurrencyIsoCode = order.CurrencyIsoCode
        );
    }
}