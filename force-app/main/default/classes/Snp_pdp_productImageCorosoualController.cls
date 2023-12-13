public without sharing class Snp_pdp_productImageCorosoualController {
    @AuraEnabled
    public static List<string> getProductImages(String ProductId, String communityId){
        System.debug('productId- ' + ProductId);
        Map<String, string> mappingOfMediaIdAndUrl = new Map<String, string>();
        List<string> mediaUrlList = new List<string>();
        try {
            // Give me all product medias based on the product ids given        
            List<ProductMedia> productMedia = new List<ProductMedia>([SELECT ElectronicMediaId, ProductId
                                                                        FROM ProductMedia
                                                                        WHERE ProductId =: ProductId
                                                                    ]);
            System.debug('productMedia- ' + productMedia);
            System.debug('productMedia Size- ' + productMedia.Size());
            

            // Content Id to be Processed
            List<String> contentIds = new List<String>();
            for (ProductMedia media : productMedia){
                // Key takeaway here is you will use the ElectronicMediaId and match it against the result of the media source node when you use the ConnectAPI ManagedContentVersionCollection
                contentIds.add(media.ElectronicMediaId);
            }
            System.debug('contentIds- ' + contentIds);
            System.debug('contentIds Size- ' + contentIds.Size());

            // Get Community images from Salesforce CMS based on the targeted products
            ConnectApi.ManagedContentVersionCollection contentList = ConnectApi.ManagedContent.getManagedContentByIds(communityId, contentIds, 0, 20, 'en_US', 'cms_image');
            System.debug('contentList- ' + contentList);
            System.debug('contentList .items- ' + contentList.items);

            // using the Connect API ManagedContentVersionCollection
            for (ConnectApi.ManagedContentVersion versionItems : contentList.items) 
            {
                // Add to ConnectApi ManagedContentMediaSourceNodeValue List
                List<ConnectApi.ManagedContentMediaSourceNodeValue> mediaSourceNodes = new List<ConnectApi.ManagedContentMediaSourceNodeValue>();
                mediaSourceNodes.add((ConnectApi.ManagedContentMediaSourceNodeValue) versionItems.contentNodes.get('source'));

                // Loop through this node to be able to get the content id and media url
                for (ConnectApi.ManagedContentMediaSourceNodeValue nodeValue : mediaSourceNodes) {
                    // Assign values to a map for getting
                    mappingOfMediaIdAndUrl.put(versionItems.managedcontentid, nodeValue.url);
                    System.debug('versionItems.managedcontentid- ' + versionItems.managedcontentid + ' nodeValue.url- ' +  nodeValue.url);
                    mediaUrlList.add(nodeValue.url);
                }
            }

            // At this point you have the respective product image URLs and electronic media ids available for processing. Even if the product is inactive this can be used in the order pages
        } catch (Exception e) {
            System.debug('Error in Snp_pdp_productImageCorosoualController.getProductImages- ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
        // return mappingOfMediaIdAndUrl;
        return mediaUrlList;
    }
}