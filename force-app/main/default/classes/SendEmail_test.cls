@isTest
private without sharing class SendEmail_test 
{
    @isTest
    private static void test1() 
    {
        Account acc = new Account(name = 'test acc');
        insert acc;
        Contact con = new Contact(Lastname = 'test con', AccountId = acc.Id, email = 'test@test.com');
        insert con;

        List<SendEmail.DataWrapper> dws = new List<SendEmail.DataWrapper>();
        SendEmail.DataWrapper dw1 = new SendEmail.DataWrapper();
        dw1.whatId = acc.Id;
        dw1.emailTemplateName = 'Order_Confirmation';
        dw1.whoId = con.Id;
        dw1.sender = 'sales@sunpower-uk.com';
        dw1.toAddresses = 'test2@test.com';
        dw1.ccAddresses = 'test2@test.com';
        dw1.bccAddresses = 'test2@test.com';
        dws.add(dw1);

        SendEmail.DataWrapper dw2 = new SendEmail.DataWrapper();
        dw2.whatId = acc.Id;
        dw2.emailTemplateName = null;
        dw2.whoId = con.Id;
        dws.add(dw2);

        test.startTest();
        sendEmail.sendEmail(dws);
        test.stopTest();
    }
}