public class SNP_CheckingForSubCategory {
    @AuraEnabled(cacheable=true)
    public static Boolean getCategoryId(Id catgoryIdFormJs) {
        Id parentCategory=[SELECT ParentCategoryId FROM ProductCategory WHERE Id=:catgoryIdFormJs].ParentCategoryId;
       //Show sub category grid template
        if(parentCategory==null){
          
            return false;
        }
       return true;
    }

}