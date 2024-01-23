import { LightningElement, api, wire, track } from "lwc";
import getContent from "@salesforce/apex/ManagedContentController.getContent";
import { NavigationMixin} from "lightning/navigation";
import basePath from "@salesforce/community/basePath";
export default class Snp_Recommendation_comp extends NavigationMixin(
  LightningElement
) {
  //  @api strTitle ='Product Name'
  @api contentId;
  @api urllink;
  _cmsData;
  @track url;

  @wire(getContent, {
    contentId: "$contentId",
    page: 0,
    pageSize: 1,
    language: "en_US",
    filterby: ""
  })
  wiredContent({ data, error }) {
    if (data) {
      // alert(JSON.stringify(data));
      this._cmsData = data;

      this.url =
        basePath + "/sfsites/c" + this._cmsData.source.unauthenticatedUrl;
      //alert(this._cmsData.source.unauthenticatedUrl);
    }
    if (error) {
      console.log("Error: " + JSON.stringify(error));
    }
  }

  navigateToWebPage() {
    window.location.href = this.urllink;
  }
}