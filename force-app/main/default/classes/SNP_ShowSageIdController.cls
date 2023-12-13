/*
 * Name : Aditya Lenka
 * Description: get Sage ID DATA
 * Date:  19/09/23
 * Test: Class N/A
*/

public with sharing class SNP_ShowSageIdController {
    @AuraEnabled(Cacheable=true)
    public static String getSageId(String userId){
        
        //Todo 
        //1: Get Account Id From User Id
        //2: Get Sage Id From Account Id
        //3: Return Sage Id
        try{
              
            String currentSageId = [SELECT Account.Sage_ID__c FROM Account WHERE Id IN (SELECT AccountId FROM User WHERE Id = :userId) LIMIT 1].Sage_ID__c;
		
        	return currentSageId;
        }
        catch(Exception e){
            throw new SNP_CustomException('An error occured while trying to fetch sage id'+e.getMessage());
        }
  
        
        
    }
}