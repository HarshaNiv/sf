@isTest
private class TestVerifyDate {
    @isTest static void testTask() {
         Date startDate = Date.parse('01/01/2020');
        Date endDate = Date.parse('01/05/2020');
        Date Middate = Date.parse('05/05/2020');
        Date startD = date.newInstance(2020, 01, 01);
         Date endD = date.newInstance(2019, 12, 30);
        Date D= VerifyDate.CheckDates(startDate,endDate);
        System.assertEquals(Date.parse('01/05/2020'),D);
        Date A= VerifyDate.CheckDates(endDate,Middate);
        System.assertEquals(Date.parse('01/05/2020'),A);
         Boolean B = VerifyDate.DateWithin30Days(startDate,endDate);
        System.assertEquals(false,B);
        VerifyDate.SetEndOfMonthDate(startDate);
    }               
}