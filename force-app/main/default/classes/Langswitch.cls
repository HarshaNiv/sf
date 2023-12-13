public  without sharing class  Langswitch {
    
    @Auraenabled
    public static void userlang(string locale, string userId){
        list<webcart> cart2 = new list<webcart>();
        list<webcart> cartcurr = new list<webcart>();
        Map<Id, CartItem> productIdToCartItemMap = new Map<Id, CartItem>();
        set<id> accid = new set<id>();
        set<id> grpid = new set<id>();
        set<id> storeid = new set<id>();
        set<id> bookid = new set<id>();
        list<PricebookEntry> pricesBookProduct = new list<PricebookEntry> ();
        Map<Id, PricebookEntry> lowestPricebookEntriesMap = new Map<Id, PricebookEntry>();
        string procurr = '';
        set<id> productIds = new set<id>();
        system.debug('locale - ' + locale);
        user userdetails =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =: userId];
        system.debug('accId'+userdetails.AccountId);
        Account acc = new Account();
        acc.id =userdetails.AccountId;
        
        // list<WebCart> cartdetails =[select id,name,AccountId,CurrencyIsoCode,status,WebStoreId,OwnerId from WebCart where OwnerId =: userId and status ='Active'];
        //delete cartdetails;
        
        if(locale == 'zh-CN'){
            acc.CurrencyIsoCode = 'CNY';
            userdetails.DefaultCurrencyISOCode ='CNY';
            procurr ='CNY';
            // userdetails.CurrencyISOCode ='CNY';
        }
        else if(locale == 'fr'){
            acc.CurrencyIsoCode = 'EUR';
            userdetails.DefaultCurrencyISOCode ='EUR';
            // userdetails.CurrencyISOCode ='EUR';
            procurr ='EUR';
        }
        else{
            acc.CurrencyIsoCode = 'USD';
            userdetails.DefaultCurrencyISOCode ='USD';
            // userdetails.CurrencyISOCode ='USD';
            procurr ='USD';
        }
        Update userdetails;
        Update acc;
        //list<WebCart> cartcheck =[select id,status from webcart where status = 'Active'];
        //if(!cartcheck.isEmpty()){
        set<id> cartid= new set<id>();
        list<WebCart> cartdetails =[select id,name,AccountId,CurrencyIsoCode,status,WebStoreId,OwnerId,(SELECT Id,Product2Id, 
                                                                                                        Name,Quantity, CurrencyISOCode,Sku, AdjustmentAmount, SalesPrice,TotalAmount, 
                                                                                                        TotalLineNetAmount, TotalLineGrossAmount, TotalPriceAfterAllAdjustments, 
                                                                                                        TotalLineAmount, TotalListPrice,TotalPrice, UnitAdjustedPrice FROM CartItems),    
                                    (SELECT CartId, CurrencyIsoCode, Name, Id FROM CartDeliveryGroups)  from WebCart where OwnerId =: userId and  (Status = 'Active' or Status = 'Checkout' or Status ='Processing' or Status != 'Closed' or  Status != 'PendingDelete') ];
        system.debug('cartdetails'+cartdetails);
        if(!cartdetails.isEmpty()){
            system.debug('cartdetails'+cartdetails);
            // list<WebCart> cartcurr= new list<WebCart>();
            
            // cartdetails.CurrencyISOCode= 'CNY';
            
            
            //update cartdetails;
            for(WebCart cart1:cartdetails){
                //WebCart newcart = new WebCart();
                // newcart.id=cart1.id;
                if(locale == 'zh-CN'){
                    cart1.CurrencyIsoCode ='CNY';
                }else{
                    cart1.CurrencyIsoCode ='USD';
                }
                accid.add(cart1.AccountId);
                cartid.add(cart1.id);
                //cartcurr.add(newcart);
                for(CartItem proid : cart1.CartItems){
                    productIds.add(proid.Product2Id);
                    productIdToCartItemMap.put(proid.Product2Id, proid);
                }
            }
            update cartdetails;
            system.debug(cartid);
            system.debug(cartdetails);
            system.debug(productIdToCartItemMap.values());
            system.debug(productIdToCartItemMap.keySet());
            list<BuyerGroupMember> mem  = [SELECT Id, BuyerGroupId, BuyerId FROM BuyerGroupMember where BuyerId IN:accid];
            system.debug(mem);
            for(BuyerGroupMember mem1 : mem){
                grpid.add(mem1.BuyerGroupId);
            }
            list<BuyerGroup> grp = [select id,name,(select id,BuyerGroupId,WebStoreId from WebStoreBuyerGroups where WebStoreId='0ZE5h000000c1ZaGAI'),(Select  id,name,Pricebook2Id from BuyerGroupPricebooks) from BuyerGroup where id IN : grpid];
            system.debug(grp);
            for(BuyerGroup storegrp:grp){
                for(WebStoreBuyerGroup storegrp1 : storegrp.WebStoreBuyerGroups){
                    storeid.add(storegrp1.WebStoreId);
                }
                for(BuyerGroupPricebook buyergrp: storegrp.BuyerGroupPricebooks){
                    bookid.add(buyergrp.Pricebook2Id);
                }
            }
            system.debug (bookid);
            string pricestrategy=[select id,name,PricingStrategy from WebStore where id IN: storeid And name ='Flipkart'].PricingStrategy;
            system.debug(pricestrategy);
            if(pricestrategy == 'LowestPrice'){
                list<Pricebook2> priceentries =[select id,name,IsActive,(SELECT Id, Name, Product2Id, UnitPrice, IsActive, CurrencyIsoCode FROM PricebookEntries where CurrencyIsoCode =: procurr And Product2Id IN:productIds and IsActive=true ORDER BY UnitPrice ASC ) from Pricebook2 where IsActive=true And Id IN : bookid];          
                for(Pricebook2 storebook : priceentries){
                    for(PricebookEntry bookentries:storebook.PricebookEntries){
                        // PricebookEntry prices = bookentries;
                        pricesBookProduct.add(bookentries);
                    }
                }
                
                for (PricebookEntry entry : pricesBookProduct) {
                    if (!lowestPricebookEntriesMap.containsKey(entry.Product2Id)) {
                        lowestPricebookEntriesMap.put(entry.Product2Id, entry);
                    } else if (entry.UnitPrice < lowestPricebookEntriesMap.get(entry.Product2Id).UnitPrice) {
                        lowestPricebookEntriesMap.put(entry.Product2Id, entry);
                    }
                    
                    
                    //list<PricebookEntry> pricsBookProduct= [SELECT Id, Name, Product2Id, UnitPrice, IsActive, CurrencyIsoCode FROM PricebookEntry where CurrencyIsoCode =: procurr And Product2Id IN:productIds];
                    map<id,CartItem> itemlist = new map<id,CartItem>();
                    set<CartItem> itemlist2 = new set<CartItem>();
                    list<CartItem> itemlist1 = new list<CartItem>();
                    //for(WebCart cart21:cartdetails){
                    
                    
                    //}
                    //update cart21;
                    /**for(CartItem item1:cartdetails.CartItems){
for(PricebookEntry prices : pricsBookProduct ){
if(item1.Product2Id == prices.Product2Id){
cartItem cartItempro = new cartItem();
cartItempro.id=item1.id;
cartItempro.CurrencyIsoCode = prices.CurrencyIsoCode;
cartItemPro.SalesPrice=prices.UnitPrice;
cartItemPro.Sku =item1.Sku;
cartItemPro.AdjustmentAmount = item1.AdjustmentAmount;**/
                    //         cartItemPro.TotalAmount=pro.UnitPrice;
                    //       cartItemPro.TotalLineNetAmount=pro.UnitPrice;
                    //     cartItemPro.TotalLineGrossAmount = pro.UnitPrice;
                    //   if(item1.Quantity ==1){
                    // cartItemPro.TotalPriceAfterAllAdjustments = prices.UnitPrice;
                    // cartItemPro.TotalLineAmount=prices.UnitPrice;
                    // cartItemPro.TotalListPrice=prices.UnitPrice;
                    // cartItemPro.TotalPrice=prices.UnitPrice;
                    // }
                    // Map<Id, CartItem> productIdToCartItemMap = new Map<Id, CartItem>();
                    /**for(WebCart cart11:cartdetails){
for (CartItem item1 : cart11.CartItems) {
productIdToCartItemMap.put(item1.Product2Id, item1);
}
}**/
                    //for(PricebookEntry prices : pricsBookProduct){
                    //  system.debug(bookentries);
                    system.debug(lowestPricebookEntriesMap);
                    for (Id product2Id : lowestPricebookEntriesMap.keySet()) {
                        PricebookEntry lowestPriceEntry = lowestPricebookEntriesMap.get(product2Id);
                        if (productIdToCartItemMap.containsKey(lowestPriceEntry.Product2Id)){
                            CartItem originalCartItem = productIdToCartItemMap.get(lowestPriceEntry.Product2Id);
                            cartItem cartItempro = new cartItem();
                            cartItempro.id=originalCartItem.id;
                            cartItempro.CurrencyIsoCode = lowestPriceEntry.CurrencyIsoCode;
                            cartItemPro.SalesPrice=lowestPriceEntry.UnitPrice;
                            cartItemPro.Sku =originalCartItem.Sku;
                            cartItemPro.AdjustmentAmount = originalCartItem.AdjustmentAmount;
                            cartItemPro.TotalPriceAfterAllAdjustments = lowestPriceEntry.UnitPrice * originalCartItem.Quantity;
                            cartItemPro.TotalLineAmount = lowestPriceEntry.UnitPrice * originalCartItem.Quantity;
                            cartItemPro.TotalListPrice = lowestPriceEntry.UnitPrice * originalCartItem.Quantity;
                            cartItemPro.TotalPrice = lowestPriceEntry.UnitPrice * originalCartItem.Quantity;
                            /**if(item1.Quantity >=1){
for(integer i=1;i<=item1.Quantity;i++){
if(i == 1){
cartItemPro.TotalPriceAfterAllAdjustments=prices.UnitPrice;
cartItemPro.TotalLineAmount=prices.UnitPrice;
cartItemPro.TotalListPrice=prices.UnitPrice;
cartItemPro.TotalPrice=prices.UnitPrice;
}
else if(i != 1){
//decimal prices1=cartItemPro.TotalPriceAfterAllAdjustments;
cartItemPro.TotalPriceAfterAllAdjustments += prices.UnitPrice;
cartItemPro.TotalLineAmount +=prices.UnitPrice;
cartItemPro.TotalListPrice +=prices.UnitPrice;
cartItemPro.TotalPrice +=prices.UnitPrice;
}
}
}**/
                            cartItemPro.UnitAdjustedPrice = lowestPriceEntry.UnitPrice;
                            //itemlist2.add(cartItemPro);
                            itemlist.put(originalCartItem.id,cartItemPro);
                            
                        }    
                        // }
                        
                        update itemlist.values();
                    }
                }
                
            }
            
        }else{
            system.debug('Cart is empty');
        }
        
         list<CartCheckoutSession> checkoutcurrency =[SELECT Id, IsDeleted, Name, CurrencyIsoCode, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, WebCartId, State, NextState, IsProcessing, BackgroundOperationId, IsArchived, OrderId, IsError, OrderReferenceNumber,WebCart.CurrencyIsoCode FROM CartCheckoutSession where  CreatedById =: userId];
    
    system.debug(checkoutcurrency);
        list<CartCheckoutSession> updatecurrency = new list<CartCheckoutSession>();            
        for(CartCheckoutSession checkoutcurrency1 : checkoutcurrency){
            if(checkoutcurrency1.CurrencyIsoCode != checkoutcurrency1.WebCart.CurrencyIsoCode)
              checkoutcurrency1.CurrencyIsoCode = checkoutcurrency1.WebCart.CurrencyIsoCode;
                updatecurrency.add(checkoutcurrency1);
            }
       system.debug(updatecurrency);
        update updatecurrency;
        //}
        
        
        
        //itemlist1.addAll(itemlist);        
        
        /**  WebCart newcart = new Webcart();
newcart.Name = 'cart';
//newcart.IsSecondary = true;
newcart.OwnerId = userId;
newcart.AccountId =userdetails.AccountId;
newcart.Status ='Active';
newcart.WebStoreId='0ZE5h000000c1ZaGAI';
newcart.Type='Cart';
//for(WebCart cart1 : cartdetails){
if(locale == 'zh-CN'){
newcart.CurrencyIsoCode= 'CNY';
}
else if(locale == 'fr'){
newcart.CurrencyIsoCode= 'EUR';
}
else{
newcart.CurrencyIsoCode= 'USD';
}**/
        // Insert newcart;
        // system.debug('newcart------>'+newcart);
        
        //@Auraenabled
        //  public static void cart(string locale, string userId){ 
        /** user userdetails =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode,(select id,name,AccountId,CurrencyIsoCode,status,WebStoreId,OwnerId from Carts) from USER where Id =: userId];
WebCart newcart = new Webcart();
//newcart.IsSecondary = true;
newcart.OwnerId = userId;
newcart.AccountId =userdetails.AccountId;
newcart.Status ='Active';
//for(WebCart cart1 : cartdetails){
if(locale == 'zh-CN'){
newcart.CurrencyIsoCode= 'zh-CN';
}
if(locale == 'fr'){
newcart.CurrencyIsoCode= 'EUR';
}
else{
newcart.CurrencyIsoCode= 'USD';
}
//cart2.add(newcart);
// }
//system.debug('acc'+acc);
//system.debug('userdetails'+userdetails);
// system.debug('cart2'+cart2);**/
        //Update userdetails;
        //Update acc;
        //Insert newcart;
        //update cart2;
        /** if(!cartdetails.isEmpty()){
delete cartdetails;
}**/
        // system.debug('cartdetails'+cartdetails);
    }
    @Auraenabled
    public static string changeCurrency(){
        system.debug('User Id:'+ userInfo.getSessionId());
        if(userInfo.getSessionId()!= null){
            //userInfo().getLocale();
            return userInfo.getSessionId();
        }
        return 'not found';
    }
    /**public static void checkoutlang(string locale, string userId){
         list<CartCheckoutSession> checkoutcurrency =[SELECT Id, IsDeleted, Name, CurrencyIsoCode, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, SystemModstamp, WebCartId, State, NextState, IsProcessing, BackgroundOperationId, IsArchived, OrderId, IsError, OrderReferenceNumber,WebCart.CurrencyIsoCode FROM CartCheckoutSession where  CreatedById =: userId];
    
    system.debug(checkoutcurrency);
        list<WebCart> updatecurrency = new list<WebCart>();            
        for(CartCheckoutSession checkoutcurrency1 : checkoutcurrency){
            WebCart cartid = new WebCart();
                cartid.id=checkoutcurrency1.WebCartId;
                updatecurrency.add(cartid);
            }
        
        list<WebCart> cartdetails =[select id,name,AccountId,CurrencyIsoCode,status,WebStoreId,OwnerId,(SELECT Id,Product2Id, 
                                                                                                        Name,Quantity, CurrencyISOCode,Sku, AdjustmentAmount, SalesPrice,TotalAmount, 
                                                                                                        TotalLineNetAmount, TotalLineGrossAmount, TotalPriceAfterAllAdjustments, 
                                                                                                        TotalLineAmount, TotalListPrice,TotalPrice, UnitAdjustedPrice FROM CartItems),    
                                    (SELECT CartId, CurrencyIsoCode, Name, Id FROM CartDeliveryGroups)  from WebCart where id= and status ='Active'];
        system.debug('cartdetails'+cartdetails);
    }**/
    
    
}