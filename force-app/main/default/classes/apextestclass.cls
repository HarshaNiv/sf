public class apextestclass {
    @AuraEnabled(cacheable=true)
    public static  ConnectApi.ManagedContentVersionCollection getContent(
        String contentId,
        Integer page,
        Integer pageSize,
        String language,
        String filterby
    ) 
    {
        
            String networkId = Network.getNetworkId();
        try{
            ConnectApi.ManagedContentVersionCollection contentCollection = ConnectApi.ManagedContent.getManagedContentByContentKeys(
                networkId,
                new List<String>{ contentId },
                0,
                1,
                language,
                filterby,
                false
            );
        
            system.debug('TResult'+contentCollection);
            return contentCollection;
        }
         catch (ConnectApi.ConnectApiException e) {
           /* System.debug('Error Message : ' + e);
            Map<String, ConnectApi.ManagedContentNodeValue> mcnvMap = new Map<String, ConnectApi.ManagedContentNodeValue>();
            return mcnvMap;*/
             ConnectApi.ManagedContentVersionCollection contentCollection1 = new ConnectApi.ManagedContentVersionCollection();
        return contentCollection1;
         }
    }

    @AuraEnabled(cacheable=true)
    public static List<ConnectApi.ManagedContentVersion> getContentList(
        Integer page,
        Integer pageSize,
        String language,
        String filterby
    ) {
        try {
            String networkId = Network.getNetworkId();
            ConnectApi.ManagedContentVersionCollection contentCollection = ConnectApi.ManagedContent.getAllManagedContent(
                networkId,
                page,
                pageSize,
                language,
                filterby
            );
            return contentCollection.items;
        } catch (ConnectApi.ConnectApiException e) {
            System.debug('Error Message : ' + e);
            List<ConnectApi.ManagedContentVersion> mcnvMap = new List<ConnectApi.ManagedContentVersion>();
            return mcnvMap;
        }
    }
}