public without sharing class samplecurrency {
 @Auraenabled
    public static void updatecartitem(string userId,string communityid,string locale){
       String TaxUsed = system.label.TaxName;
        Map<id,list<CartItem>> cartprod=new  Map<id,list<CartItem>>();
        list<WebCart> cartcurrency = new list<WebCart>();
        list<CartItem> item2 = new list<CartItem>();
         List<ConnectApi.BatchInput> cartItems = new List<ConnectApi.BatchInput>();
        id storeid =[SELECT Id, Name, WebStoreId, NetworkId FROM WebStoreNetwork WHERE NetworkId =: communityid].WebStoreId;
         id acciId =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =: userId].AccountId;
       list<WebCart> cartdetails=[SELECT Id, CurrencyIsoCode, Name, AccountId, Status, IsSecondary, TotalAdjustmentAmount, GrandTotalAmount, CreatedDate,(SELECT Id,Product2Id, 
                                  Name,Quantity FROM CartItems where Name !=:TaxUsed ) FROM WebCart where (Status ='Active' or Status='Checkout') and AccountId =:acciId and OwnerId !=:userId];
       system.debug(cartdetails);
          set<id> grpid=new set<id>();
        set<id> bookid=new set<id>();
        set<id> productid=new set<id>();
        list<WebStoreBuyerGroup> WebStoreBuyerGrouplist=[SELECT Id, WebStoreId, BuyerGroupId FROM WebStoreBuyerGroup where WebStoreId =: storeid];
        for(WebStoreBuyerGroup grp :WebStoreBuyerGrouplist){
            grpid.add(grp.BuyerGroupId);
        }
        list<BuyerGroupPricebook> Buyerpricebook= [SELECT Id, Name, BuyerGroupId, Pricebook2Id, IsActive, Priority FROM BuyerGroupPricebook where IsActive=true and BuyerGroupId IN:grpid];
        for(BuyerGroupPricebook book:Buyerpricebook){
            bookid.add(book.Pricebook2Id);
        }
      list<PricebookEntry>PricebookEntrylist=  [SELECT Id, Pricebook2Id, Product2Id, CurrencyIsoCode, UnitPrice, Name, IsActive FROM PricebookEntry where Pricebook2Id in:bookid and IsActive=true and CurrencyIsoCode=:locale];
       for(PricebookEntry prod:PricebookEntrylist){
            productid.add(prod.Product2Id);
        }
        for(WebCart cartdetails1:cartdetails){
            system.debug('HI');
            item2 = new list<CartItem>();
            for(CartItem item:cartdetails1.CartItems){
                if(productid.contains(item.Product2Id)){
                item2.add(item);
                system.debug(item2);
                }
            }
            cartprod.put(cartdetails1.id,item2);
            system.debug(cartprod);
            if (!item2.isEmpty()) {
     /**  try {
          //  delete item2;
        } catch (Exception e) {
            // Handle any exceptions during deletion
            System.debug('Error deleting CartItems: ' + e.getMessage());
        }**/
    }
        }
        if(!cartprod.keySet().isEmpty()){
for(id cartid:cartprod.keyset()){
    ConnectApi.BatchResult[] ab;
           // string cartids=cartid;
     ConnectApi.CartItemInput items = new ConnectApi.CartItemInput();
            List<CartItem> itemslist = cartprod.get(cartId);
            //List<ConnectApi.BatchInput> cartItems = new List<ConnectApi.BatchInput>();
            system.debug(itemslist);
            for(integer i=0;i<itemslist.size();i++){
            CartItem proitems = itemslist[i];
      // for(CartItem proitems:itemslist){
           items.productId=proitems.Product2Id;
           items.quantity=String.valueOf(proitems.Quantity);
        items.type= ConnectApi.CartItemType.Product; 
        ConnectApi.BatchInput batchInput = new ConnectApi.BatchInput(items);
       cartItems.add(batchInput);
            system.debug(cartItems);
        try {
            system.debug('storeid'+storeid+'acciId'+acciId+'cartid'+cartid+'items'+items+'locale'+locale);
    ab = ConnectApi.commerceCart.addItemsToCart(storeid, acciId, cartid,cartItems, locale);
            system.debug(ab);
             system.debug(cartItems);
       cartItems.clear();
} catch (Exception e) {
    System.debug('Error in addItemsToCart: ' + e.getMessage());
    // Handle the exception or log additional details as needed
}
            }
}
    }
        
    }
}