public without sharing class CommunityAuthController {
    public CommunityAuthController() {

    }

    @AuraEnabled
    public static string doLogin(String username, String password){
        try {
            
            String startUrl = System.Label.Community_Url;
            ApexPages.PageReference pageRef = Site.login(username, password, startUrl);
            system.debug('pageRef'+pageRef);

            if(pageRef != null) {
                return pageRef.getUrl();
            }
            throw new CalloutException();
          //  return null;


        } catch (Exception e) {
            system.debug('e.getMessagelogin+   '+e.getMessage());
            throw new AuraHandledException(e.getMessage());
         //   return null;
        }
       
  }
    @AuraEnabled
    public static boolean forgotPassword(String username){
        try {
            boolean ispassword = Site.forgotPassword(username);
            system.debug('ispassword'+ispassword);

            if(ispassword==true) {
                return ispassword;
            }
            throw new CalloutException();
          //  return null;


        } catch (Exception e) {
            system.debug('e.getMessagelogin+   '+e.getMessage());
            throw new AuraHandledException(e.getMessage());
         //   return null;
        }
       
  }
    
}