public class cartdetails {
 
    public static ConnectApi.BatchResult[] cartitems(){
        ConnectApi.BatchResult[] a;
       // ConnectApi.CartItemType protype='Product';
        List<ConnectApi.BatchInput> cartItems = new List<ConnectApi.BatchInput>();
        list<ConnectApi.CartItemInput> item = new list<ConnectApi.CartItemInput>();
        ConnectApi.CartItemInput items = new ConnectApi.CartItemInput();
        items.productId='01t5h000008dbLYAAY';
        items.quantity='2';
        items.type= ConnectApi.CartItemType.Product;
      item.add(items);  
        ConnectApi.CartItemInput items1 = new ConnectApi.CartItemInput();
items1.productId='01t5h000008dbLbAAI';
        items1.quantity='2';
        items1.type= ConnectApi.CartItemType.Product;
item.add(items1);
        ConnectApi.BatchInput batchInput = new ConnectApi.BatchInput(items);
       cartItems.add(batchInput);
        a=ConnectApi.commerceCart.addItemsToCart('0ZE5h000000c1ZaGAI', '0015h00001MfXTHAA3', '0a65h000000IWyUAAW',
                                                cartItems, 'USD');
            return a;
    }  
    public static void sample(){
        Account acc = new Account();
        acc.id='0015h00001MfXTHAA3';
        acc.CurrencyIsoCode='CNY';
        update acc; 
        testmethod1();
    }
    @future
    public static void testmethod1(){   
ConnectApi.CartSummary a;
ConnectApi.CartInput cart1 = new ConnectApi.CartInput();
cart1.CurrencyIsoCode='CNY';
system.debug(cart1.currencyIsoCode);
cart1.effectiveAccountId='0015h00001MfXTHAA3';
cart1.name='cart';

        cart1.isSecondary=true;
a=ConnectApi.commerceCart.createCart('0ZE5h000000c1ZaGAI',cart1);
    }
   /* public static ConnectApi.BatchResult[] cartitems(string storeid,string locale,string accountid,List<CartItem> itemslist){
        ConnectApi.BatchResult[] a;
        id cartid=[SELECT Id, Name, Status, Type, CurrencyIsoCode, AccountId,WebStoreId FROM WebCart where Status='Active' and CurrencyIsoCode=:locale and  AccountId=:accountid and WebStoreId =:storeid].Id;
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
       
            return a;
    }*/
}