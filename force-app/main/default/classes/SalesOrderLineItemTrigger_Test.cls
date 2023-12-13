@isTest(seeAllData=false)
private class SalesOrderLineItemTrigger_Test {
  static Account acc;
  static Sales_Order__c so;
  static Product2 prod;

  static void setupTestData() {
    // Perform our data preparation.
    acc = new Account(Name = 'test');
    insert acc;

    Opportunity op = new Opportunity(
      Name = 'test',
      StageName = 'Qualification',
      CloseDate = Date.today(),
      AccountId = acc.id
    );
    op.Pricebook2Id = Test.getStandardPricebookId();
    insert op;

    prod = new Product2();
    prod.IsActive = true;
    prod.Name = 'test';
    prod.Buy_Price__c = 0.5;
    prod.Volume_1__c = 20;
    prod.Volume_2__c = 30;
    prod.Volume_3__c = 40;
    prod.Volume_4__c = 50;
    prod.Volume_5__c = 60;
    prod.Volume_6__c = 70;
    prod.Volume_7__c = 80;
    prod.Volume_8__c = 90;
    prod.Volume_9__c = 100;
    prod.Buy_Price_1__c = 0.49;
    prod.Buy_Price_2__c = 0.48;
    prod.Buy_Price_3__c = 0.47;
    prod.Buy_Price_4__c = 0.46;
    prod.Buy_Price_5__c = 0.45;
    prod.Buy_Price_6__c = 0.44;
    prod.Buy_Price_7__c = 0.43;
    prod.Buy_Price_8__c = 0.42;
    prod.Buy_Price_9__c = 0.41;
    insert prod;

    PricebookEntry pe = new PricebookEntry();
    pe.IsActive = true;
    pe.Product2Id = prod.id;
    pe.UnitPrice = 3;
    pe.Volume_1__c = 20;
    pe.Volume_2__c = 30;
    pe.Volume_3__c = 40;
    pe.Volume_4__c = 50;
    pe.Volume_5__c = 60;
    pe.Volume_6__c = 70;
    pe.Volume_7__c = 80;
    pe.Volume_8__c = 90;
    pe.Volume_9__c = 100;
    pe.Sell_Price_1__c = 0.49;
    pe.Sell_Price_2__c = 0.48;
    pe.Sell_Price_3__c = 0.47;
    pe.Sell_Price_4__c = 0.46;
    pe.Sell_Price_5__c = 0.45;
    pe.Sell_Price_6__c = 0.44;
    pe.Sell_Price_7__c = 0.43;
    pe.Sell_Price_8__c = 0.42;
    pe.Sell_Price_9__c = 0.41;
    pe.Pricebook2Id = Test.getStandardPricebookId();
    insert pe;

    OpportunityLineItem oli = new OpportunityLineItem();
    oli.Cost_Price__c = 1;
    oli.Description = 'desc';
    oli.Discount = 0;
    oli.FOC_Quantity__c = 0;
    oli.OpportunityId = op.id;
    oli.Product2Id = prod.id;
    oli.Quantity = 2;
    oli.UnitPrice = 1;
    oli.PricebookEntryId = pe.Id;
    insert oli;

    Quote qt = new Quote();
    qt.Name = 'test';
    qt.Type__c = 'Proforma';
    qt.OpportunityId = op.id;
    qt.Pricebook2Id = Test.getStandardPricebookId();
    insert qt;

    // for QTO case, opportunity must have synced quote...
    op.QTO_Quote__c = qt.id;
    update op;

    // create sales order
    so = new Sales_Order__c();
    so.Account__c = acc.id;
    so.CurrencyIsoCode = 'USD';
    so.Opportunity__c = op.id;
    so.End_Date__c = date.newInstance(2018, 5, 1);
    insert so;
  }

  static testMethod void TestSingleSalesOrderLineItem_Insert() {
    setupTestData();

    Sales_Order_Line_Item__c soli = new Sales_Order_Line_Item__c();
    soli.CurrencyIsoCode = 'USD';
    soli.Discount__c = 10; // 10%
    soli.FOC_Quantity__c = 1;
    soli.Quantity__c = 1;
    soli.Sales_Price__c = 100;
    soli.Sales_Order__c = so.id;

    // do test... (insert)
    Test.startTest();
    insert soli;
    Test.stopTest();

    // Verification
    Sales_Order_Line_Item__c soliCheck = [
      SELECT CurrencyIsoCode, Total_Price__c, Total_Quantity__c
      FROM Sales_Order_Line_Item__c
      WHERE Id = :soli.id
    ];
    System.assertEquals(soliCheck.Total_Quantity__c, 2);
    System.assertEquals(soliCheck.Total_Price__c, 90);
    System.assertEquals(soliCheck.CurrencyIsoCode, 'USD');
  }

  static testMethod void TestSingleSalesOrderLineItem_update() {
    Test.startTest(); //done because needed additional governor limits
    setupTestData();
    Test.stopTest();

    Sales_Order_Line_Item__c soli = new Sales_Order_Line_Item__c();
    soli.CurrencyIsoCode = 'USD';
    soli.Discount__c = 10; // 10%
    soli.FOC_Quantity__c = 1;
    soli.Quantity__c = 1;
    soli.Sales_Price__c = 100;
    soli.Sales_Order__c = so.id;
    insert soli;

    // change for update test...
    soli.Quantity__c = 2;

    // do test... (update)
    update soli;

    // Verification
    Sales_Order_Line_Item__c soliCheck = [
      SELECT CurrencyIsoCode, Total_Price__c, Total_Quantity__c
      FROM Sales_Order_Line_Item__c
      WHERE Id = :soli.id
    ];
    System.assertEquals(soliCheck.Total_Price__c, 180);
    System.assertEquals(soliCheck.Total_Quantity__c, 3);
    System.assertEquals(soliCheck.CurrencyIsoCode, 'USD');
  }

  static /*testMethod*/ void Test100SalesOrderLineItem_insert() {
    setupTestData();

    // 100 line items
    List<Sales_Order_Line_Item__c> soliList = new List<Sales_Order_Line_Item__c>();
    for (integer idx = 0; idx < 100; idx++) {
      Sales_Order_Line_Item__c soli = new Sales_Order_Line_Item__c();
      soli.CurrencyIsoCode = 'USD';
      soli.Discount__c = 0.1; // 10%
      soli.FOC_Quantity__c = 1;
      soli.Quantity__c = 1;
      soli.Sales_Price__c = 100;
      soli.Sales_Order__c = so.id;
      soliList.add(soli);
    }

    // do test... (update)
    Test.startTest();
    insert soliList;
    Test.stopTest();

    // Verification
    // if we get here without an exception - passed!
  }

  static testMethod void TestSingleSalesOrderLineItem_EndDateUpdate_Insert() {
    setupTestData();

    List<Sales_Order_Line_Item__c> soli = new List<Sales_Order_Line_Item__c>();
    soli.add(new Sales_Order_Line_Item__c());
    soli[0].CurrencyIsoCode = 'USD';
    soli[0].Discount__c = 10; // 10%
    soli[0].FOC_Quantity__c = 1;
    soli[0].Quantity__c = 1;
    soli[0].Sales_Price__c = 100;
    soli[0].Ship_Date__c = date.newInstance(2018, 5, 23);
    soli[0].Sales_Order__c = so.id;

    soli.add(new Sales_Order_Line_Item__c());
    soli[1].CurrencyIsoCode = 'USD';
    soli[1].Discount__c = 10; // 10%
    soli[1].FOC_Quantity__c = 1;
    soli[1].Quantity__c = 1;
    soli[1].Sales_Price__c = 100;
    soli[1].Ship_Date__c = date.newInstance(2018, 5, 13);
    soli[1].Sales_Order__c = so.id;

    // do test... (insert)
    Test.startTest();
    insert soli;
    Test.stopTest();

    // Verification
    Sales_Order__c soCheck = [
      SELECT End_Date__c
      FROM Sales_Order__c
      WHERE Id = :soli[0].Sales_Order__c
    ];
    System.assertEquals(soCheck.End_Date__c, soli[0].Ship_Date__c);
  }

  static testMethod void TestSingleSalesOrderLineItem_EndDateUpdate_Update() {
    Test.startTest(); //done because needed additional governor limits
    setupTestData();
    Test.stopTest();

    List<Sales_Order_Line_Item__c> soli = new List<Sales_Order_Line_Item__c>();
    soli.add(new Sales_Order_Line_Item__c());
    soli[0].CurrencyIsoCode = 'USD';
    soli[0].Discount__c = 10; // 10%
    soli[0].FOC_Quantity__c = 1;
    soli[0].Quantity__c = 1;
    soli[0].Sales_Price__c = 100;
    soli[0].Ship_Date__c = date.newInstance(2018, 5, 23);
    soli[0].Sales_Order__c = so.id;

    soli.add(new Sales_Order_Line_Item__c());
    soli[1].CurrencyIsoCode = 'USD';
    soli[1].Discount__c = 10; // 10%
    soli[1].FOC_Quantity__c = 1;
    soli[1].Quantity__c = 1;
    soli[1].Sales_Price__c = 100;
    soli[1].Ship_Date__c = date.newInstance(2018, 5, 13);
    soli[1].Sales_Order__c = so.id;
    insert soli;

    // update date
    soli[1].Ship_Date__c = date.newInstance(2018, 5, 25);

    // do test... (insert)

    update soli[1];

    // Verification
    Sales_Order__c soCheck = [
      SELECT End_Date__c
      FROM Sales_Order__c
      WHERE Id = :soli[0].Sales_Order__c
    ];
    System.assertEquals(soCheck.End_Date__c, soli[1].Ship_Date__c);
  }

  static testMethod void TestSingleSalesOrderLineItem_OneNullDate_Insert() {
    setupTestData();

    List<Sales_Order_Line_Item__c> soli = new List<Sales_Order_Line_Item__c>();
    soli.add(new Sales_Order_Line_Item__c());
    soli[0].CurrencyIsoCode = 'USD';
    soli[0].Discount__c = 10; // 10%
    soli[0].FOC_Quantity__c = 1;
    soli[0].Quantity__c = 1;
    soli[0].Sales_Price__c = 100;
    soli[0].Sales_Order__c = so.id;

    soli.add(new Sales_Order_Line_Item__c());
    soli[1].CurrencyIsoCode = 'USD';
    soli[1].Discount__c = 10; // 10%
    soli[1].FOC_Quantity__c = 1;
    soli[1].Quantity__c = 1;
    soli[1].Sales_Price__c = 100;
    soli[1].Ship_Date__c = date.newInstance(2018, 5, 13);
    soli[1].Sales_Order__c = so.id;

    // do test... (insert)
    Test.startTest();
    insert soli;
    Test.stopTest();

    // Verification
    Sales_Order__c soCheck = [
      SELECT End_Date__c
      FROM Sales_Order__c
      WHERE Id = :soli[0].Sales_Order__c
    ];
    System.assertEquals(soCheck.End_Date__c, soli[1].Ship_Date__c);
  }

  static testMethod void TestSingleSalesOrderLineItem_AllNullDate_Insert() {
    setupTestData();

    List<Sales_Order_Line_Item__c> soli = new List<Sales_Order_Line_Item__c>();
    soli.add(new Sales_Order_Line_Item__c());
    soli[0].CurrencyIsoCode = 'USD';
    soli[0].Discount__c = 10; // 10%
    soli[0].FOC_Quantity__c = 1;
    soli[0].Quantity__c = 1;
    soli[0].Sales_Price__c = 100;
    soli[0].Sales_Order__c = so.id;

    soli.add(new Sales_Order_Line_Item__c());
    soli[1].CurrencyIsoCode = 'USD';
    soli[1].Discount__c = 10; // 10%
    soli[1].FOC_Quantity__c = 1;
    soli[1].Quantity__c = 1;
    soli[1].Sales_Price__c = 100;
    soli[1].Sales_Order__c = so.id;

    // do test... (insert)
    Test.startTest();
    insert soli;
    Test.stopTest();

    // Verification
    Sales_Order__c soCheck = [
      SELECT End_Date__c
      FROM Sales_Order__c
      WHERE Id = :soli[0].Sales_Order__c
    ];
    System.assertEquals(soCheck.End_Date__c, null);
  }

  static testMethod void TestSingleSalesOrderLineItem_InsertWithProduct() {
    decimal oldCostPrice;
    decimal oldSalesPrice;
    Test.startTest(); //done because needed additional governor limits
    setupTestData();
    Test.stopTest();

    List<Sales_Order_Line_Item__c> soli = new List<Sales_Order_Line_Item__c>();
    soli.add(new Sales_Order_Line_Item__c());
    soli[0].CurrencyIsoCode = 'GBP';
    soli[0].Discount__c = 10; // 10%
    soli[0].FOC_Quantity__c = 1;
    soli[0].Quantity__c = 1;
    soli[0].Sales_Price__c = 100; //no cost price entered so should be calc in the background
    soli[0].Ship_Date__c = date.newInstance(2018, 5, 23);
    soli[0].Sales_Order__c = so.id;
    soli[0].Product__c = prod.id;
    soli.add(new Sales_Order_Line_Item__c());
    soli[1].CurrencyIsoCode = 'GBP';
    soli[1].Discount__c = 10; // 10%
    soli[1].FOC_Quantity__c = 1;
    soli[1].Quantity__c = 20;
    // soli[1].Sales_Price__c = 100; //no sales price entered so should be calc in the background
    soli[1].Ship_Date__c = date.newInstance(2018, 5, 13);
    soli[1].Sales_Order__c = so.id;
    soli[1].Product__c = prod.id;
    insert soli;

    List<Sales_Order_Line_Item__c> soliCheckList = [
      SELECT id, Sales_Price__c, Cost_Price__c, Last_Dates_Updated__c
      FROM Sales_Order_Line_Item__c
    ];
    for (Sales_Order_Line_Item__c aSOLI : soliCheckList) {
      System.assert(
        aSOLI.Last_Dates_Updated__c != null,
        'Last Dates Updated should have been calculated by background calculation'
      );
      if (aSOLI.id == soli[0].id) {
        System.assertEquals(
          100,
          aSOLI.Sales_Price__c,
          'Manually Entered sales price should not be overriden by background calculation'
        );
        System.assertNotEquals(
          null,
          aSOLI.Cost_Price__c,
          'Cost Price should have been calculated by background calculation'
        );
      } else {
        oldCostPrice = aSOLI.Cost_Price__c;
        oldSalesPrice = aSOLI.Sales_Price__c;
        System.assert(
          aSOLI.Sales_Price__c != null,
          'Sales price should have been calculated by background calculation'
        );
        System.assert(
          aSOLI.Cost_Price__c != null,
          'Cost price should have been calculated by background calculation'
        );
      }
    }
    // update date and price
    soli[1].Ship_Date__c = date.newInstance(2018, 5, 25);
    soli[1].Sales_Price__c = 101;
    // do test... (insert)
    soli[1].Quantity__c = 30;
    update soli[1];

    // Verification
    Sales_Order_Line_Item__c soliCheckSingle = [
      SELECT id, Sales_Price__c, Cost_Price__c
      FROM Sales_Order_Line_Item__c
      WHERE id = :soli[1].id
    ];
    System.assertNotEquals(
      oldCostPrice,
      soliCheckSingle.Cost_Price__c,
      'Cost price should have been updated to reflect higher quantity by background calculation'
    );
    System.assertEquals(
      101,
      soliCheckSingle.Sales_Price__c,
      'Sales price should not have been calculated by background calculation'
    );
  }

  static testMethod void TestSingleSalesOrderLineItem_InsertWithMoreProduct() {
    decimal oldCostPrice;
    decimal oldSalesPrice;

    Test.startTest(); //done because needed additional governor limits
    setupTestData();
    Test.stopTest();

    List<Sales_Order_Line_Item__c> soli = new List<Sales_Order_Line_Item__c>();
    soli.add(new Sales_Order_Line_Item__c());
    soli[0].CurrencyIsoCode = 'GBP';
    soli[0].Discount__c = 10; // 10%
    soli[0].FOC_Quantity__c = 1;
    soli[0].Quantity__c = 40;
    soli[0].Sales_Price__c = 100;
    soli[0].Ship_Date__c = date.newInstance(2018, 5, 23);
    soli[0].Sales_Order__c = so.id;
    soli[0].Product__c = prod.id;
    soli.add(new Sales_Order_Line_Item__c());
    soli[1].CurrencyIsoCode = 'GBP';
    soli[1].Discount__c = 10; // 10%
    soli[1].FOC_Quantity__c = 1;
    soli[1].Quantity__c = 50;
    soli[1].Sales_Price__c = 100;
    soli[1].Ship_Date__c = date.newInstance(2018, 5, 13);
    soli[1].Sales_Order__c = so.id;
    soli[1].Product__c = prod.id;
    insert soli;

    List<Sales_Order_Line_Item__c> soliCheckList = [
      SELECT id, Sales_Price__c, Cost_Price__c
      FROM Sales_Order_Line_Item__c
    ];
    for (Sales_Order_Line_Item__c aSOLI : soliCheckList) {
      if (aSOLI.id == soli[0].id) {
        System.assertEquals(
          100,
          aSOLI.Sales_Price__c,
          'Manually Entered sales price should not be overriden by background calculation'
        );
      } else {
        oldCostPrice = aSOLI.Cost_Price__c;
        oldSalesPrice = aSOLI.Sales_Price__c;
        System.assert(
          aSOLI.Sales_Price__c != null,
          'Sales price should have been calculated by background calculation'
        );
      }
    }

    // update date and price
    soli[1].Ship_Date__c = date.newInstance(2018, 5, 25);
    soli[1].Sales_Price__c = 101;
    // do test... (insert)
    soli[1].Quantity__c = 60;
    update soli[1];

    Sales_Order_Line_Item__c soliCheckSingle = [
      SELECT id, Sales_Price__c, Cost_Price__c
      FROM Sales_Order_Line_Item__c
      WHERE id = :soli[1].id
    ];
    System.assertNotEquals(
      oldCostPrice,
      soliCheckSingle.Cost_Price__c,
      'Cost price should have been updated to reflect higher quantity by background calculation'
    );
  }
}