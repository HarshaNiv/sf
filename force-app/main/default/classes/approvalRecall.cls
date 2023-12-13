global without sharing class approvalRecall
{
    @InvocableMethod
    global static void recallApproval(List<Id> recIds)   
    {
        system.debug('RG>>> recIds: '+recIds);
        Boolean hasRecallApprovalsPermission = FeatureManagement.checkPermission('Recall_Approvals');
        Id currentUserId = UserInfo.getUserId();
        system.debug('RG>>> currentUserId: '+currentUserId);

        // get the active approval processes (for Opportunities)...
        List<ProcessInstanceWorkItem> piwis = [
            SELECT Id, ProcessInstanceId, ProcessInstance.TargetObjectId, processInstance.SubmittedById
            FROM ProcessInstanceWorkitem 
            WHERE ProcessInstance.TargetObjectId IN :recIds
              AND ProcessInstance.TargetObject.Type = 'Opportunity'];

        if(piwis.isEmpty())
            throw new approvalRecallException('No approval steps to recall!');
        
        // get the opportunity owner Ids
        Map<Id,Id> oppOwnerIds = new Map<Id,Id>();
        if(!hasRecallApprovalsPermission)
        {
            Set<Id> oppIds = new Set<Id>();
            for(ProcessInstanceWorkItem piwi:piwis)
                oppIds.add(piwi.ProcessInstance.TargetObjectId);
            
            List<Opportunity> opps = [SELECT Id, OwnerId FROM Opportunity WHERE Id IN :oppIds];
            for(Opportunity opp:opps)
                oppOwnerIds.put(opp.Id, opp.OwnerId);
        }

        // for each approval process...
        Boolean skipped = false;
        for(ProcessInstanceWorkItem piwi:piwis)
        {
            // if current user has Recall permission or was the original submitter or is Opportunity owner...
            system.debug('RG>>> SubmittedById: '+piwi.ProcessInstance.SubmittedById);
            system.debug('RG>>> oppOwnerId: '+oppOwnerIds.get(piwi.ProcessInstance.TargetObjectId));
            if(oppOwnerIds.get(piwi.ProcessInstance.TargetObjectId) == null)
                continue;
            if(hasRecallApprovalsPermission || piwi.ProcessInstance.SubmittedById == currentUserId || oppOwnerIds.get(piwi.ProcessInstance.TargetObjectId) == currentUserId)
            {
            	Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
            	req.setAction('Removed');       
            	req.setWorkitemId(piwi.Id);   
            	Approval.process(req,false);
            }
            else
            {
                skipped = true;
            }
        }
        
        if(skipped)
            throw new approvalRecallException('You do not have permission to recall this approval!');
    }
    
    public class approvalRecallException extends Exception {}
}