public with sharing class PricingMatrixHandler {

	List<OpportunityLineItem> olilist = new List<OpportunityLineItem>();
	
	public PricingMatrixHandler(List<OpportunityLineItem> lst) {
		this.olilist = lst;
	}

	public void process(){

		Set<id> prodId = new Set<id>();
		for(OpportunityLineItem oli : olilist){
			prodId.add(oli.product2id);
		}

		List<Pricing_Matrix__c> pmList = [Select id, Minimum_Volume__c, Product__c, Maximum_Volume__c from Pricing_Matrix__c where Product__c in : prodId ];
		Map<ID, List<Pricing_Matrix__c>> prodToMatrix = new Map<ID, List<Pricing_Matrix__c>>();

		for(Id i : prodId){
			List<Pricing_Matrix__c> tempList = new List<Pricing_Matrix__c>();
			for(Pricing_Matrix__c pm : pmList){
				if(pm.Product__c == i){
					tempList.add(pm);
				}
			}
			prodToMatrix.put(i,tempList);
		}


		for(OpportunityLineItem oli : olilist){
			List<Pricing_Matrix__c> matrices = prodToMatrix.get(oli.product2id);
			for(Pricing_Matrix__c p : matrices){
				if(oli.Quantity >= p.Minimum_Volume__c && oli.Quantity <= p.Maximum_Volume__c){
					oli.Pricing_Matrix__c = p.id;
					break;
				}
			}
		}
	}

}