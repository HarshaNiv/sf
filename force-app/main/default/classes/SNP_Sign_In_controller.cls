public without sharing  class SNP_Sign_In_controller {
    
  	// Fetching Country and dial code
    @AuraEnabled(cacheable=true)
    public static list<Country_Name_Dial_code__mdt> countryDialCode(){
        return [SELECT Id, Label, code__c, CountryDialcode__c FROM Country_Name_Dial_code__mdt Order By Label];
    }
    
    //customer Type From Account.Industry picklist values
    @AuraEnabled(cacheable=true)
    public static List<String> CustomerTypeOne(){
        Schema.DescribeFieldResult F = Account.Industry.getDescribe();
        List<Schema.PicklistEntry> P = F.getPicklistValues();
        
        List<String> picklistValues = new List<String>();
        for(Schema.PicklistEntry entry : P){
            picklistValues.add(entry.getValue());
        }        
        return picklistValues;
    }

    
    //Method for checking the user already exist or create the new user
     @AuraEnabled
    public static string isEmailExist(String username){
        try {
            
            List<User> userList = new List<User>();
            userList = [Select Id, Name From User Where Username = :username];
            if(userList.size() >= 1){
                return 'user exist';
            }
            return 'user Not exist' ;


        } catch (Exception e) {
            return 'create user';
        }
    }
	
    //Method for creating the register user
    @AuraEnabled
    public static string registerUser(String firstName, String lastName, String username, String email, String communityNickname, String password,String country ,string customerType, string phone, string hearAboutUs){
        
        Set<String> communityNicknameSet = new Set<String>();
            for(User usr : [Select Id, communityNickname From User Where communityNickname != null]){
                communityNicknameSet.add(usr.communityNickname);
            }
            String uniqueCommunityNickName;
            if(communityNicknameSet.isEmpty()){
                if(communityNickname.length() > 4){
                    uniqueCommunityNickName = communityNickname.substring(0, 4) + String.valueOf( Integer.valueOf(Math.random() * 10000) );
                } else {
                    uniqueCommunityNickName = communityNickname + String.valueOf( Integer.valueOf(Math.random() * 10000) );
                }
            } else {
                for(Integer i=1; i <= 9999 ; i++){
                    if(communityNickname.length() > 4){
                        uniqueCommunityNickName = communityNickname.substring(0, 4) + String.valueOf( Integer.valueOf(Math.random() * 10000) );
                    } else {
                        uniqueCommunityNickName = communityNickname + String.valueOf( Integer.valueOf(Math.random() * 10000) );
                    }
                    if(!communityNicknameSet.contains(uniqueCommunityNickName)){
                        break;
                    }
                }
            }
       
        String accountId;
        
        // Custom Label should be created in org for B2B profile and used here
        String B2BprofiletoUser = system.label.B2BProfile;
        
        // Custom Label for mandatery field 'Structure' be created in org and used here
        String Structer = system.label.PowerLed;
        
        //Custom label for mandetery field 'team' be created in org and used here
        String Industrial = system.label.Industrial;
        
        
        //The below B2B Profile for sun power guest user should be getting after guest user log in as the log in user.
        Id profileId = [SELECT Id FROM Profile WHERE Name=:B2BprofiletoUser].Id;
       // String profileIdString = profileId;
        
        //PersonAccount instance is created and inserted 
		String recordTypeId = Schema.getGlobalDescribe().get('Account').getDescribe().getRecordTypeInfosByName().get('Person Account').getRecordTypeId();
        Account acc = new Account();
        acc.FirstName = firstName;
        acc.LastName = lastName;
        acc.Description = hearAboutUs;
        acc.Phone = phone;
        acc.PersonEmail = email;
        acc.Structure__c = Structer;
        acc.Team__c = Industrial;
        acc.ShippingCountry = country;
        acc.Industry = customerType;
        acc.RecordTypeId = recordTypeId;
        insert acc;
        
        accountId = acc.Id;
        
        //Enabeling the person account as buyer
        BuyerAccount guestBuyer = new BuyerAccount();
        guestBuyer.Name = firstName + lastName;
        guestBuyer.BuyerId = acc.Id;
        guestBuyer.BuyerStatus= 'Active';
        guestBuyer.IsActive = true;
        
        insert guestBuyer;
        
        // Custom Label should be created in org for StoreBuyerGroup  and used here
        // it will change in every sand box
        String B2BstoreGroupName = system.label.PowerLED_Buyer_Group;
        
        //cutome label for buyerGroup name
        string BuyerGroupIdOfstore = [SELECT Id, Name FROM BuyerGroup where Name =:B2BstoreGroupName].Id;
        
        //adding personAccount to Store-Buyer-Group
        BuyerGroupMember bm = new BuyerGroupMember();
        bm.buyerId = acc.Id;
        bm.BuyerGroupId = BuyerGroupIdOfstore;
        insert bm;
        
        //just need to give the two permission to the guest user so that he can see the products and check out 
        
        //user instance is created 
        User u = new User();
        u.Username = userName;
        u.Email = email;
        u.FirstName = firstName;
        u.LastName = lastName;
        u.MobilePhone = phone;
        u.Country = country;
        u.CommunityNickname = uniqueCommunityNickName;
		u.ProfileId = profileId;
		
        String userId;
        
        try {
             system.debug('Start now');
             //this method will return the userId
             
             userId = Site.createExternalUser(u, accountId, password, true);
             
             system.debug('krishna'+userId); 
            
         }
       		catch (Exception ex) {
                if(ApexPages.currentPage() != null){
                    ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 
                                                               'Some very important message for the user'));
                }
             //  ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, ex.getMessage()));
            return  ex.getMessage();
      		  }
       if (userId != null) {
            if (password != null && password.length() > 1) {
              AccountDetailsForTheGuestUse(userId);
                ApexPages.PageReference pageRef = Site.login(username, password, null);
                if(pageRef != null) return pageRef.getUrl();
                system.debug(pageRef.getUrl());
            }
            else {
                ApexPages.PageReference page = System.Page.SiteRegisterConfirm;
                page.setRedirect(true);
                return page.getUrl();
            }
        }
       return 'user not registered';
	}
    
    //Assigning permission to guest user (Buyer and B2B_LWR_Cart)
    @future
    @AuraEnabled
	public static void AccountDetailsForTheGuestUse(String userId) {
    try {
        if (userId != null) {
            // Custom Label for the B2BBuyer should be created in org for assigning the guest user and used here
            String B2BBuyer = system.label.B2BBuyer;
            string B2BBuyerPermissionSetId = [SELECT Id FROM PermissionSet where Name= :B2BBuyer].Id;
            
            PermissionSetAssignment psaBuyer = new PermissionSetAssignment();
			psaBuyer.PermissionSetId = B2BBuyerPermissionSetId;
            psaBuyer.AssigneeId = userId;
			insert psaBuyer;
            
            // Custom Label for the B2BBuyer should be created in org for assigning the guest user and used here
            String B2BLWRCar = system.label.B2B_LWR_Cart_Permission_Set;
            string B2BLWRCartPermissionSet = [SELECT Id FROM PermissionSet where Label= :B2BLWRCar].Id;
            
            PermissionSetAssignment psaB2BCart = new PermissionSetAssignment();
			psaB2BCart.PermissionSetId = B2BLWRCartPermissionSet;
            psaB2BCart.AssigneeId = userId;
			insert psaB2BCart;
                   
            }
         }  catch (Exception ex) {
            System.debug('Error message: ' + ex.getMessage());
        }
    }

}