public without sharing class navigationclass {
    @Auraenabled
    public static string prod_details(string name){
        string var = [select id,Name from ProductCategory where Name =: name and CatalogId = '0ZS5h000000c4TZGAY'].id;
        system.debug('var'+var);
        return var;
    }

}