@isTest
public class TestRestrictContactByName {
    @isTest static void Test(){
        list<contact> contact = new list<contact>();
        Contact c1 = new Contact(FirstName = 'Fransico',LastName='Riggio');
        Contact c2 = new Contact(FirstName = 'Fransico1',LastName='INVALIDNAME');
        contact.add(c1);
        contact.add(c2);
        insert contact;
    }

}