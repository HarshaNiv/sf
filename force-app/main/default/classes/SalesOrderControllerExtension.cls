public with sharing class SalesOrderControllerExtension 
{
    private Id soId;
    public List<Sales_Order_Line_Item__c> solis {get;set;}
    private Set<id> currentTypesId;
    public Boolean editMode{get;set;}
    
     /*Variables to sort the related list */
    private String sortDirection ='ASC';
    private String sortExp  = 'Sort_Order__c';
    public String selectedLineDel {get;set;}
    
    
    public string sortExpression
    {
        get
        {
            return sortExp;
        }
        set
        {
            //if the column is clicked on then switch between Ascending and Descending modes
            if(value==sortExp)
                sortDirection=(sortDirection=='ASC')?'DESC':'ASC';
            else 
                sortDirection='ASC';
            sortExp=value;
        }
    }
    
    
    public string getSortDirection()
    {
        //if not column is selected 
        if(sortExpression==null||sortExpression=='')
            return 'ASC';
        else 
            return sortDirection;
    }
    

    public SalesOrderControllerExtension(ApexPages.StandardController stdController) 
    {
        editMode = false;
        soId = stdController.getId();
        ViewData();
    }
    
    
    public List<Sales_Order_Line_Item__c> getSalesOrderLineItems()
    {
        String sortFullExp = sortExpression+' '+sortDirection;
        List<Sales_Order_Line_Item__c> soliQueryResult = Database.query('SELECT id, RemovedFromSage__c, Name, Sort_Order__c, Product__c, Product_Code__c, Description__c, Sales_Price__c, Line_Margin__c, Quantity__c, FOC_Quantity__c, Committed__c, Picked__c, Dispatched_Quantity__c, Requested_Date__c, Promise_Date2__c, Ship_Date__c, Closed__c, Purchasing_Confirmed_Date__c, Split_Shipment__c, Discount__c, Completed__c FROM Sales_Order_Line_Item__c WHERE Sales_Order__c = :soId '+' order by '+sortFullExp);
        return soliQueryResult;
    }

    
    /*Refreshes the data whenever the column gets sorted */
    public PageReference ViewData()
    {
        solis = getSalesOrderLineItems();
        return null;
    }
    
    
    /*Insert New Line*/
    public Pagereference newLine()
    {
        editMode = true;
        Sales_Order_Line_Item__c newLine = new Sales_Order_Line_Item__c(Sales_Order__c = soId);        
        solis.add(newLine);
        return null;
    }
    
    
    public Pagereference editLines()
    {
        editMode = true;
        solis = getSalesOrderLineItems();  // reload data...
        return null;
    }
       
    
    public Pagereference cancelEdit()
    {
        editMode = false;
        solis = getSalesOrderLineItems();  // reload data...
        return null;
    }
    
    
    /*Save the lines */
    public PageReference saveLines()
    {
        editMode = false;
        upsert solis;
        solis = getSalesOrderLineItems();  // reload data...
        return null;
    }
            
    
    /*Delete single line */
    public PageReference deleteLine()
    {
        try
        {
            Sales_Order_Line_Item__c line = [SELECT id FROM Sales_Order_Line_Item__c where id = :selectedLineDel];
            delete line;
        }
        catch(Exception e)
        {
            
        }
        return viewData();
    }
    

}