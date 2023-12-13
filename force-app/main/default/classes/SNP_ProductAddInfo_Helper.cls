public without sharing class SNP_ProductAddInfo_Helper {
    
    //Geting the Product documents are Availabel or not
     public static ConnectApi.ManagedContentVersionCollection getManagedContent(Id communityId, List<String> managedContentIds){
        try{
             ConnectApi.ManagedContentVersionCollection contentCollection = ConnectApi.ManagedContent.getManagedContentByIds(
                communityId,
                managedContentIds,
                null,
                null,
                'en_US',
                'cms_document',
                false
            );
            return contentCollection;
        }
        catch(Exception e){
            throw new SNP_CustomException('An error occurred '+e.getMessage());
        }
    }

}