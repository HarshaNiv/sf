public class AccountTriggerHandler 
{
    private Map<Id, Postcode__c> postcodeMap = new Map<Id, Postcode__c>();
    private Map<Id, Account> accountMap = new Map<Id, Account>();
    private Map<Id, Id> accountToPostcodeMap = new Map<Id, Id>();
    private Map<Id, String> accountToPostcodeStringMap = new Map<Id, String>();
    private Map<Id, String> accountToCountryStringMap = new Map<Id, String>();
    private static Boolean triggerDisabled = false;
    
 	public AccountTriggerHandler(List<Account> accList)
    {
        for(Account acc :accList)
        {
        	if(acc.Type == null || acc.Type == 'Supplier')
            	continue;
        
            // for lookups...
            accountMap.put(acc.id, acc);
            
            /// get relevant postcode...
            String postcode;
            if(acc.GeoCodeAddress__c == null || acc.GeoCodeAddress__c == 'Billing')
            {
                 if(acc.BillingPostalCode != null) 
	                 postcode = acc.billingPostalcode.trim();
            }
            else
            {
                if(acc.shippingPostalCode != null)  
	                postcode = acc.shippingPostalcode.trim();
            }
                
            if(postcode != null)
            {
                // get first 3 characters
                postcode = postcode.left(postcode.length()-3).trim();                
                accountToPostcodeStringMap.put(acc.Id, postcode);
            }
            
            // also capture country
            String country = acc.BillingCountry;
            if(country != null)
	            accountToCountryStringMap.put(acc.Id, country);
            
            system.debug('Account trigger, processing '+acc.Name+', postcode '+acc.BillingPostalCode+', country '+acc.BillingCountry);
        }
            
        // find enteries...
        List<Postcode__c> pcList = [SELECT Id, Name, Country__c, Sales_Person_OEM__c, Sales_Person_OEM_Lighting_Din_Rail__c, Sales_Person_Wholesale__c 
                              		FROM Postcode__c 
                              		WHERE Name in :accountToPostcodeStringMap.values() OR Country__c in :accountToCountryStringMap.values()];

        // attribute postcode region to account...
        for(Account acc :accList)
        {
            Boolean found = false;
            for(Postcode__c pc :pcList)
            {
                if(accountToPostcodeStringMap.get(acc.id) == pc.name)
                {
            		postcodeMap.put(pc.Id, pc);
            		accountToPostcodeMap.put(acc.id, pc.id);
		            system.debug('Acc.name '+acc.Name+', postcode__c.name '+pc.name);
                    found = true;
                }
            }
            
            if(!found)
            {
                // postcode not found, try for a country match...
                for(Postcode__c pc :pcList)
                {
                	if(accountToCountryStringMap.get(acc.id) == pc.Country__c)
                    {
                        postcodeMap.put(pc.Id, pc);
                        accountToPostcodeMap.put(acc.id, pc.id);
                        system.debug('Acc.name '+acc.Name+', postcode__c.name '+pc.name+', Country__c '+pc.Country__c);
                        found = true;
                    }
                }
            }
        }
    }
    
    public Id getNewOwner(Account acc)
    {
        system.debug('getNewOwner '+acc.Name);
        Id PostcodeId = accountToPostcodeMap.get(acc.Id);
        if(PostcodeId == null) 
            return null;  // abort!
        
        Postcode__c pc = postcodeMap.get(postcodeId);
        if(pc == null)
            return null;  // abort!
        
        if(acc.Team__c == 'Industrial')
            return pc.Sales_Person_OEM__c;
        else if(acc.Team__c == 'OEM Lighting')
            return pc.Sales_Person_OEM_Lighting_Din_Rail__c;            
        else if(acc.Team__c == 'Wholesale')
            return pc.Sales_Person_Wholesale__c;
        return null;   // shouldn't get here!
    }

    public Id getNewOwner(Id accId)
    {
        system.debug('getNewOwner '+accId);
        Account acc = accountMap.get(accId);
        if(acc != null)
            return getNewOwner(acc);
        return null;
    }
    
    public Id getPostcodeRegion(Account acc)
    {
        system.debug('getPostcodeRegion '+acc.Name);
        return accountToPostcodeMap.get(acc.Id);
    }
    
    public Boolean isNewOwner(Account acc)
    {
        system.debug('isNewOwner '+acc.Name);
        Id AccountOwner = acc.OwnerId;
        Id NewOwner = getNewOwner(acc);
        
		if(NewOwner == null)
            return False;   // no new owner
                
        // true if there is a new owner...
        return (AccountOwner != NewOwner);
    }

    public static Boolean isTriggerDisabled()
    {
        return triggerDisabled;
    }
    
    public static void disableTrigger()
    {
        triggerDisabled = true;
    }

    public static void enableTrigger()
    {
        triggerDisabled = false;
    }
}