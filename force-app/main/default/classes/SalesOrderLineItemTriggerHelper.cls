public class SalesOrderLineItemTriggerHelper {
  private static Boolean disableTrigger = false;
  private static Boolean disableBeforeTrigger = false;
  public static integer counter = 0;
  public static Boolean isDisabled() {
    return disableTrigger;
  }

  public static void disable() {
    disableTrigger = true;
  }

  public static void enable() {
    disableTrigger = false;
  }

  public static Boolean isBeforeDisabled() {
    return disableBeforeTrigger;
  }

  // public static void disableBefore() {
  //   disableBeforeTrigger = true;
  // }

  // public static void enableBefore() {
  //   disableBeforeTrigger = false;
  // }
}