/**
 * Auto Generated and Deployed by the Declarative Lookup Rollup Summaries Tool package (dlrs)
 **/
trigger dlrs_OpportunityLineItemTrigger on OpportunityLineItem
    (before delete, before insert, before update, after delete, after insert, after undelete, after update)
{
    String userProfile = [SELECT Profile.Name FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1].Profile.Name;//Changes for Guest Users
    if(userProfile != 'powerledfull Profile'){//Changes for Guest Users
    dlrs.RollupService.triggerHandler(OpportunityLineItem.SObjectType);
    }////Changes for Guest Users
}