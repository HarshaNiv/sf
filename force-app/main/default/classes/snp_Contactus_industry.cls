public class snp_Contactus_industry {
    @AuraEnabled(cacheable=true)
    public static list<Account> listIndustry()
    {
        list<account> listIndustry =[select id,Industry from Account];
        return listIndustry;
    }

}