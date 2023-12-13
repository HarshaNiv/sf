global with sharing class SendEmail 
{
    global class DataWrapper 
    {
        @InvocableVariable(label='What Id' required=true)
        public String whatId;
        @InvocableVariable(label='Email Template Name' required=true)
        public String emailTemplateName;
        @InvocableVariable(label='Who Id' required = true)
        public String whoId;
        @InvocableVariable(label='Sender Email' required=false)
        public String sender;
        @InvocableVariable(label='TO Addresses' required=false)
        public String toAddresses;
        @InvocableVariable(label='CC Addresses' required=false)
        public String ccAddresses;
        @InvocableVariable(label='BCC Addresses' required=false)
        public String bccAddresses;
    }

    @invocableMethod(label='Send Email Template')
    global static void sendEmail (List<DataWrapper> passedData) 
    {
       	sendEmailSettings__c settings = null;
        Boolean testMode = false;
      	User testUser = null;
        try
        {
        	settings = sendEmailSettings__c.getInstance();
            if(settings.Email_Redirect__c != null && settings.Email_Redirect__c != '')
            {
                testMode = true;
                testUser = [SELECT Id FROM User WHERE Username = :settings.Email_Redirect__c LIMIT 1];
            }
        }
        catch(Exception e)
        {
            // do nothing - assume not in test mode!
        }
        
        // Validate email tempaltes and org-wide addresses
        Map<String, Id> emails = new Map<String, Id>();
        Map<String, Id> emailTemplateNames = new Map<String, Id>();
        for(DataWrapper dw: passedData) 
        {
            emails.put(dw.sender, null);
            emailTemplateNames.put(dw.emailTemplateName, null);
        }
        for(OrgWideEmailAddress address: [SELECT Id, Address FROM OrgWideEmailAddress WHERE Address = :emails.keySet()]) 
            emails.put(address.Address, address.Id);
        for(Emailtemplate et: [SELECT Id, DeveloperName FROM Emailtemplate WHERE DeveloperName IN :emailTemplateNames.keySet()]) 
            emailTemplateNames.put(et.DeveloperName, et.Id);

        // Build emails
        List<Messaging.Email> mailsToSend = new List<Messaging.Email>();
        for (DataWrapper dw: passedData) 
        {
            // check mandatory fields
            if(dw.whoId == null || dw.sender == null || dw.emailTemplateName == null)   
                continue;
            
            Id orgSenderId = emails.get(dw.sender);
            Id emailTemplateId = emailTemplateNames.get(dw.emailTemplateName);

            if(emailTemplateId == null)
                continue; // Invalid email template - skip

            Messaging.SingleEmailMessage mailToSend = new Messaging.SingleEmailMessage();
            mailToSend.setTemplateId(emailTemplateId);
            mailToSend.setWhatId(dw.whatId);
            Id whoId = dw.whoId;
            if(testMode && testUser != null)
            	whoId = testUser.Id;
            mailToSend.setTargetObjectId(whoId);
            if(whoId.getSobjectType() == Schema.User.SObjectType)
                mailToSend.saveAsActivity = false;
            if (orgSenderId != null && !testMode) 
                mailToSend.setOrgWideEmailAddressId(orgSenderId);
            if(dw.toAddresses != null && !testMode)
                mailToSend.setToAddresses(dw.toAddresses.split(','));
            if(dw.ccAddresses != null && !testMode)
                mailToSend.setCcAddresses(dw.ccAddresses.split(','));
            if(dw.bccAddresses != null && !testMode)
                mailToSend.setBccAddresses(dw.bccAddresses.split(','));
            mailsToSend.add(mailToSend);
        }

        // Send the emails
        if (!Test.isRunningTest())
            Messaging.sendEmail(mailsToSend);
    }
}