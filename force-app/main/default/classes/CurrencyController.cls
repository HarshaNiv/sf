public without sharing class CurrencyController {
    //get the currency list to show in website 
    @AuraEnabled(cacheable=true)
    public static string CountryCurrencyName(){
        return system.label.Country_Currency;
    }
    
     //get the currency of user 
    @AuraEnabled
    public static string currentUserCurrency(string userId){
        user userdetails =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =:userId];
        account acc =[select id ,CurrencyIsoCode from account where id=:userdetails.AccountId];
        return acc.CurrencyIsoCode;
    }
    
    //changing the site currency 
    @Auraenabled
    public static void logInuserlang(string locale, string userId,string communityid){
        String item2Json;
        list<user> updateuserlist=new list<user>();
        //id netid = [SELECT Id, NetworkId, IsActive FROM Community where Id =:communityid].NetworkId;
        id storeid =[SELECT Id, Name, WebStoreId, NetworkId FROM WebStoreNetwork WHERE NetworkId =: communityid].WebStoreId;
        //list<webcart> cart2 = new list<webcart>();
        system.debug('locale - ' + locale);
        user userdetails =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =: userId];
        system.debug('accId'+userdetails.AccountId);
        Account acc = new Account();
        acc.id =userdetails.AccountId;
        list<user> userlist=[select id ,AccountId,DefaultCurrencyISOCode from user where AccountId=: acc.id];
        //list<Account> acclist =[select id,name,	Account_Type__c,RecordTypeId,(select id,name from contacts) from Account where id=:acc.id];
        if(locale == 'USD'){
            acc.CurrencyIsoCode = 'USD';
        }
        else if(locale == 'EUR'){
            acc.CurrencyIsoCode = 'EUR';
        }
        else{ 
             acc.CurrencyIsoCode = 'GBP ';
        }
        
        for(user userlist1:userlist){
        if(locale == 'USD'){
            //acc.CurrencyIsoCode = 'USD';
            userlist1.DefaultCurrencyISOCode='USD';
        }
        else if(locale == 'EUR'){
           // acc.CurrencyIsoCode = 'EUR';
            userlist1.DefaultCurrencyISOCode ='EUR';
        }
        else{
           
             //acc.CurrencyIsoCode = 'GBP ';
            userlist1.DefaultCurrencyISOCode ='GBP ';
        }
            updateuserlist.add(userlist1);
        }
        system.debug('acc'+acc);
        system.debug('userdetails'+userdetails);
       // system.debug('cart2'+cart2);
        Update updateuserlist;
        Update acc;
        
         //Custom label for tax used in store
        String TaxUsed = system.label.TaxName;
        
        list<WebCart> carts1 = new list<WebCart>();
        list<CartItem> item2 = new list<CartItem>();
       list<WebCart> cartdetails1=[SELECT Id, CurrencyIsoCode, Name, AccountId, Status, IsSecondary, TotalAdjustmentAmount, GrandTotalAmount, CreatedDate,(SELECT Id,Product2Id, 
                                  Name,Quantity FROM CartItems where Name !=:TaxUsed ) FROM WebCart where (Status ='Active' or Status='Checkout') and AccountId =:userdetails.AccountId and OwnerId=:userId];
       system.debug(cartdetails1);
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
        if(!cartdetails1.isEmpty()){
        for(WebCart secondarycart:cartdetails1){
            for(CartItem items:secondarycart.CartItems){
                CartItem item1 = new CartItem();
                if( productid.contains(items.Product2Id)){
                item1.Product2Id=items.Product2Id;
                item1.Quantity=items.Quantity;
                item2.add(item1);
                }
            }
            Delete cartdetails1;
        }
           item2Json = JSON.serialize(item2);
           string  proidJson=JSON.serialize(productid);
            createcart(storeid,locale,userdetails.AccountId,item2Json,userId,proidJson);
             updatecart(userId,userdetails.AccountId,locale,storeid,communityid);
         // updatecartitem(userId,communityid,locale);
        }
        
            
           /* if(secondarycart.CurrencyIsoCode != locale){
                secondarycart.IsSecondary=true;
                carts1.add(secondarycart);
            }*/
            
        
       /* if(!carts1.isEmpty()){
            update carts1;
        }*/
        
       // AccountDetailsForTheGuestUse(userId,locale);
        
   }  
     @future
    @Auraenabled
    public static void createcart(string storeid,string locale,string accountid, String itemsJson,string userId,string proidsJson){   
         List<CartItem> items = (List<CartItem>)JSON.deserialize(itemsJson, List<CartItem>.class);
        system.debug(items);
       // set<id> productid=(set<id>)JSON.deserialize(proidsJson, set<id>.class);
      //  system.debug(productid);
        ConnectApi.CartSummary a;
ConnectApi.CartInput cart1 = new ConnectApi.CartInput();
cart1.CurrencyIsoCode=locale;
system.debug(cart1.currencyIsoCode);
cart1.effectiveAccountId=accountid;
cart1.name='cart'+ locale;

        //cart1.isSecondary=true;
a=ConnectApi.commerceCart.createCart(storeid,cart1);
        cartitems(storeid,locale,accountid,items,userId);
    }
    
    public static ConnectApi.BatchResult[] cartitems(string storeid,string locale,string accountid,List<CartItem> itemslist,string userId){
        ConnectApi.BatchResult[] a;
        id cartid=[SELECT Id, Name, Status, Type, CurrencyIsoCode,OwnerId, AccountId,WebStoreId FROM WebCart where Status='Active' and CurrencyIsoCode=:locale and  AccountId=:accountid and WebStoreId =:storeid and OwnerId =:userId].Id;
       // ConnectApi.CartItemType protype='Product';
        List<ConnectApi.BatchInput> cartItems = new List<ConnectApi.BatchInput>();
        //list<ConnectApi.CartItemInput> item = new list<ConnectApi.CartItemInput>();
        ConnectApi.CartItemInput items = new ConnectApi.CartItemInput();
        system.debug(itemslist.size());
        for(integer i=0;i<itemslist.size();i++){
            CartItem proitems = itemslist[i];
       // for(CartItem proitems:itemslist){
           items.productId=proitems.Product2Id;
           items.quantity=String.valueOf(proitems.Quantity);
        items.type= ConnectApi.CartItemType.Product; 
         ConnectApi.BatchInput batchInput = new ConnectApi.BatchInput(items);
       cartItems.add(batchInput);
             system.debug(cartItems);
        a=ConnectApi.commerceCart.addItemsToCart(storeid, accountid, cartid,
                                                cartItems, locale);
       // }
       system.debug(cartItems);
       cartItems.clear();
  
        }
      // updatecart(userId,accountid,productid,locale,storeid);
            return a;
    }
    
    //method for checking for new cart
    @Auraenabled
    public static Webcart getNewCartDetails(id userid){
         user userdetails =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =:userId];
        try{
            Webcart cartid=[SELECT Id, Name, Status, Type, CurrencyIsoCode, AccountId,WebStoreId FROM WebCart where Status='Active' and AccountId=:userdetails.accountid];
        If(cartid.id != null){
            return cartid;
        }
        }
            catch(exception e){
              return null;
            }
       
        return null;        
    }

 @auraenabled
    @future
    public static void  updatecart(string userId,string accountid,string locale,string storeid,string communityid){
          String TaxUsed = system.label.TaxName;
        Map<id,list<CartItem>> cartprod=new  Map<id,list<CartItem>>();
        list<WebCart> cartcurrency = new list<WebCart>();
        list<CartItem> item2 = new list<CartItem>();
       list<WebCart> cartdetails=[SELECT Id, CurrencyIsoCode, Name, AccountId, Status, IsSecondary, TotalAdjustmentAmount, GrandTotalAmount, CreatedDate,(SELECT Id,Product2Id, 
                                  Name,Quantity FROM CartItems where Name !=:TaxUsed ) FROM WebCart where (Status ='Active' or Status='Checkout') and AccountId =:accountId and OwnerId !=:userId];
       system.debug(cartdetails);
        for(WebCart cartdetails1:cartdetails){
            //WebCart cartitem = new WebCart();
            cartdetails1.CurrencyIsoCode=locale;
            cartcurrency.add(cartdetails1); 
            
        }
        update cartcurrency; 
        //string serializeitems=Json.serialize(cartprod);
      //  updatecartitem(storeid, accountid,locale,serializeitems);
      updatecartitem(userId,communityid,locale);
    }
     
    
    //Call After All method
    @Auraenabled
    public static void updatecartitem(string userId,string communityid,string locale){
       String TaxUsed = system.label.TaxName;
        Map<id,CartItem> cartprod=new  Map<id,CartItem>();
        list<WebCart> cartcurrency = new list<WebCart>();
        list<CartItem> item2 = new list<CartItem>();
         List<ConnectApi.BatchInput> cartItems = new List<ConnectApi.BatchInput>();
        id storeid =[SELECT Id, Name, WebStoreId, NetworkId FROM WebStoreNetwork WHERE NetworkId =: communityid].WebStoreId;
         id acciId =[select AccountId,DefaultCurrencyISOCode,CurrencyISOCode from USER where Id =: userId].AccountId;
       list<WebCart> cartdetails=[SELECT Id, CurrencyIsoCode, Name, AccountId, Status, IsSecondary, TotalAdjustmentAmount, GrandTotalAmount, CreatedDate,(SELECT Id,Product2Id, 
                                                                                                        Name,Quantity, CurrencyISOCode,Sku, AdjustmentAmount, SalesPrice,TotalAmount, 
                                                                                                        TotalLineNetAmount, TotalLineGrossAmount, TotalPriceAfterAllAdjustments, 
                                                                                                        TotalLineAmount, TotalListPrice,TotalPrice, UnitAdjustedPrice FROM CartItems where Name !=:TaxUsed ) FROM WebCart where (Status ='Active' or Status='Checkout') and AccountId =:acciId and OwnerId !=:userId];
       system.debug(cartdetails);
          set<id> grpid=new set<id>();
        set<id> bookid=new set<id>();
        set<id> productid=new set<id>();
        list<PricebookEntry> pricesBookProduct = new list<PricebookEntry> ();
         Map<Id, PricebookEntry> lowestPricebookEntriesMap = new Map<Id, PricebookEntry>();
        list<WebStoreBuyerGroup> WebStoreBuyerGrouplist=[SELECT Id, WebStoreId, BuyerGroupId FROM WebStoreBuyerGroup where WebStoreId =: storeid];
        for(WebStoreBuyerGroup grp :WebStoreBuyerGrouplist){
            grpid.add(grp.BuyerGroupId);
        }
        list<BuyerGroupPricebook> Buyerpricebook= [SELECT Id, Name, BuyerGroupId, Pricebook2Id, IsActive, Priority FROM BuyerGroupPricebook where IsActive=true and BuyerGroupId IN:grpid];
        for(BuyerGroupPricebook book:Buyerpricebook){
            bookid.add(book.Pricebook2Id);
        }
         string pricestrategy=[select id,name,PricingStrategy from WebStore where id =: storeid].PricingStrategy;
    for(WebCart cartdetails1:cartdetails){
            system.debug('HI');
            item2 = new list<CartItem>();
            for(CartItem item:cartdetails1.CartItems){ 
                productid.add(item.Product2Id);
                //if(productid.contains(item.Product2Id)){
                //item2.add(item);
                //system.debug(item2);
                //}
                 cartprod.put(item.Id,item);
            }
           
            system.debug(cartprod);
        }    
        if(pricestrategy == 'LowestPrice'){
        list<PricebookEntry>PricebookEntrylist=  [SELECT Id, Pricebook2Id, Product2Id, CurrencyIsoCode, UnitPrice, Name, IsActive FROM PricebookEntry where Pricebook2Id in:bookid and IsActive=true and CurrencyIsoCode=:locale and Product2Id IN:productid  ORDER BY UnitPrice ASC];
        if(PricebookEntrylist.isEmpty()){
                    delete cartprod.values();
         }
            
            
            if(!PricebookEntrylist.isEmpty()){
            map<id,CartItem> itemlist = new map<id,CartItem>();
                set<id> productids= new set<id>();
                
        for(PricebookEntry prod:PricebookEntrylist){
             pricesBookProduct.add(prod);
            productids.add(prod.Product2Id);
        }
                list<CartItem> cartitemlists=new list<CartItem>();
      list<WebCart> cartlist=[SELECT Id, CurrencyIsoCode, Name, AccountId, Status, IsSecondary, TotalAdjustmentAmount, GrandTotalAmount, CreatedDate,(SELECT Id,Product2Id, Name,Quantity FROM CartItems where Name !=:TaxUsed  and Product2Id NOT IN:(productids) )FROM WebCart where (Status ='Active' or Status='Checkout') and AccountId =:acciId and OwnerId !=:userId];
                For(WebCart cartlist1:cartlist){
                    for(CartItem listdetails:cartlist1.CartItems){
                         cartitemlists.add(listdetails);
                    }
                }
                
                if(!cartitemlists.isEmpty()){
                    delete cartitemlists;
                }         
                
                
                list<PriceAdjustmentSchedule> Priceadj= [SELECT Id, Name, CurrencyIsoCode, IsActive, ScheduleType, AdjustmentMethod,(select id,name,PricebookEntryId from PricebookEntryAdjustments) FROM PriceAdjustmentSchedule where CurrencyIsoCode=:locale and IsActive= true];
map<id,PriceAdjustmentSchedule> adjid= new map<id,PriceAdjustmentSchedule>();
        map<id,PriceAdjustmentSchedule> Priceadjmap= new map<id,PriceAdjustmentSchedule>();
        Map<id,id> prodlistId= new map<id,id>();
                
                
        if(!Priceadj.isEmpty()){
            for(PriceAdjustmentSchedule Priceadj1:Priceadj){
                Priceadjmap.put(Priceadj1.id,Priceadj1);
                for(PricebookEntryAdjustment adj:Priceadj1.PricebookEntryAdjustments){
                    adjid.put(adj.PricebookEntryId,Priceadj1);
                }
            }
        }
       list<PricebookEntry> prodlist=[SELECT Product2Id, Id, Name, Pricebook2Id, CurrencyIsoCode, UnitPrice, IsActive FROM PricebookEntry where id IN:adjid.keyset() and IsActive= true and CurrencyIsoCode=:locale];
        for(PricebookEntry prodlist1:prodlist){
            prodlistId.put(prodlist1.Product2Id,prodlist1.id);
        }
         list<PriceAdjustmentSchedule> Priceadj1= [SELECT Id, Name, CurrencyIsoCode, IsActive, ScheduleType, AdjustmentMethod FROM PriceAdjustmentSchedule where CurrencyIsoCode=:locale and IsActive= true and AdjustmentMethod='Slab'];
       list<PriceAdjustmentTier> adjTier= [SELECT Id, Name, CurrencyIsoCode, TierType, LowerBound, UpperBound, TierValue, PriceAdjustmentScheduleId FROM PriceAdjustmentTier where PriceAdjustmentScheduleId IN:Priceadj1 ORDER BY LowerBound asc];
        for (PricebookEntry entry : pricesBookProduct) {
                    if (!lowestPricebookEntriesMap.containsKey(entry.Product2Id)) {
                        lowestPricebookEntriesMap.put(entry.Product2Id, entry);
                    } else if (entry.UnitPrice < lowestPricebookEntriesMap.get(entry.Product2Id).UnitPrice) {
                        lowestPricebookEntriesMap.put(entry.Product2Id, entry);
                    }
                                         
                                  system.debug(lowestPricebookEntriesMap);
            for(CartItem cartitemlist:cartprod.values()){
                    for (Id product2Id : lowestPricebookEntriesMap.keySet()) {
                        if(cartitemlist.product2Id == product2Id ){
                        PricebookEntry lowestPriceEntry = lowestPricebookEntriesMap.get(product2Id);
                       // if (cartprod.containsKey(lowestPriceEntry.Product2Id)){
                           // CartItem originalCartItem =  cartprod.get(lowestPriceEntry.Product2Id);
                            cartItem cartItempro = new cartItem();
                            cartItempro.id=cartitemlist.id;
                            cartItempro.CurrencyIsoCode = locale;
                            cartItemPro.SalesPrice=lowestPriceEntry.UnitPrice;
                             cartItemPro.ListPrice=lowestPriceEntry.UnitPrice;
                            cartItemPro.Sku =cartitemlist.Sku;
                            cartItemPro.AdjustmentAmount = 0.0;
                            cartItemPro.TotalLineAmount = lowestPriceEntry.UnitPrice * cartitemlist.Quantity;
                            cartItemPro.TotalListPrice = lowestPriceEntry.UnitPrice * cartitemlist.Quantity;   
                            
                            //itemlist2.add(cartItemPro);
                            if(prodlistId.containskey(lowestPriceEntry.Product2Id)){
                               id bookids= prodlistId.get(lowestPriceEntry.Product2Id);
                                if(adjid.containskey(bookids)){
                                    PriceAdjustmentSchedule proPrice=adjid.get(bookids);
                                    if(proPrice.AdjustmentMethod=='Range'){
                                        Decimal pricePercent=[SELECT TierValue,lowerbound,upperbound FROM PriceAdjustmentTier WHERE PriceAdjustmentScheduleId = :proPrice.id AND  lowerbound<= :cartitemlist.Quantity AND UpperBound >=:cartitemlist.Quantity].TierValue;
                                    cartItemPro.UnitAdjustmentAmount=((lowestPriceEntry.UnitPrice)*(pricePercent/100.0));
                                    cartItemPro.UnitAdjustedPrice=lowestPriceEntry.UnitPrice-cartItemPro.UnitAdjustmentAmount;
                                       cartItemPro.AdjustmentAmount = cartItemPro.UnitAdjustmentAmount*cartitemlist.Quantity;
                                   cartItemPro.TotalPrice=(lowestPriceEntry.UnitPrice * cartitemlist.Quantity)-(cartItemPro.AdjustmentAmount);
                                    cartItemPro.TotalAdjustmentAmount= cartItemPro.AdjustmentAmount;
                                     cartItemPro.TotalPriceAfterAllAdjustments=cartItemPro.TotalPrice;   
                                    }else if(proPrice.AdjustmentMethod=='Slab'){
                                        decimal productprice=0;
                                        decimal upbound=0;
                                        decimal quantity=cartitemlist.Quantity;
                                        system.debug(quantity);
                                        for(PriceAdjustmentTier adjTier1:adjTier){           
                                         Decimal tierQuantity = Math.min(quantity, adjTier1.UpperBound - adjTier1.LowerBound + 1);
                                            if(quantity > tierQuantity){
                                              quantity=quantity - (tierQuantity);
                                                system.debug(quantity);
                                                productprice=(lowestPriceEntry.UnitPrice-((lowestPriceEntry.UnitPrice)*(adjTier1.TierValue/100.0)));
                                                upbound=upbound+(productprice*tierQuantity);
                                                system.debug(upbound);
                                            }  else if(quantity <= tierQuantity){
                                                productprice=(lowestPriceEntry.UnitPrice-((lowestPriceEntry.UnitPrice)*(adjTier1.TierValue/100.0)));
                                                upbound=upbound+(productprice*tierQuantity);
                                                 system.debug(upbound);
                                                break;
                                            }
                                       
                                        } 
                                        system.debug(upbound);
                                        cartItemPro.UnitAdjustedPrice=upbound/cartitemlist.Quantity;
                                       cartItemPro.UnitAdjustmentAmount=(lowestPriceEntry.UnitPrice-(cartItemPro.UnitAdjustedPrice));
                                       cartItemPro.AdjustmentAmount = cartItemPro.UnitAdjustmentAmount*cartitemlist.Quantity;
                                       cartItemPro.TotalPrice=(lowestPriceEntry.UnitPrice * cartitemlist.Quantity)-(cartItemPro.AdjustmentAmount);
                                       cartItemPro.TotalAdjustmentAmount= cartItemPro.AdjustmentAmount;
                                       cartItemPro.TotalPriceAfterAllAdjustments=cartItemPro.TotalPrice;
                                        }else{
                                cartItemPro.UnitAdjustmentAmount=0.0;
                                    cartItemPro.UnitAdjustedPrice = lowestPriceEntry.UnitPrice;
                                    cartItemPro.AdjustmentAmount = cartitemlist.AdjustmentAmount;
                                    cartItemPro.TotalPrice = lowestPriceEntry.UnitPrice * cartitemlist.Quantity;
                                    cartItemPro.TotalAdjustmentAmount=0.0;
                                    cartItemPro.TotalPriceAfterAllAdjustments = lowestPriceEntry.UnitPrice * cartitemlist.Quantity;
                            }
                                }
                            }else{
                                cartItemPro.UnitAdjustmentAmount=0.0;
                                    cartItemPro.UnitAdjustedPrice = lowestPriceEntry.UnitPrice;
                                    cartItemPro.AdjustmentAmount = cartitemlist.AdjustmentAmount;
                                    cartItemPro.TotalPrice = lowestPriceEntry.UnitPrice * cartitemlist.Quantity;
                                    cartItemPro.TotalAdjustmentAmount=0.0;
                                    cartItemPro.TotalPriceAfterAllAdjustments = lowestPriceEntry.UnitPrice * cartitemlist.Quantity;
                            }
                            itemlist.put(cartitemlist.id,cartItemPro);
                        
                             
                       // }
                    }
                    }
        }
                        
                        update itemlist.values();
     /**  try {
            delete item2;
        } catch (Exception e) {
            // Handle any exceptions during deletion
            System.debug('Error deleting CartItems: ' + e.getMessage());
        }
    }
      /**  if(!cartprod.keySet().isEmpty()){
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
  //ConnectApi.commerceCart.addItemsToCart('0ZEMU0000004CFL4A2', '001JW000008vOc7YAE', '0a6JW0000001wd3YAA', cartItems, 'USD');
            system.debug(ab);
             system.debug(cartItems);
       cartItems.clear();
} catch (Exception e) {
    System.debug('Error in addItemsToCart: ' + e.getMessage());
    // Handle the exception or log additional details as needed
}
            }
}**/
    
            
    }
        }
    }
}
}