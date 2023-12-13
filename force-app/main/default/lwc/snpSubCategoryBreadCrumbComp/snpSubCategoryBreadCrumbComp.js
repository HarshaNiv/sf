import { LightningElement, wire} from 'lwc';
import getcategory from '@salesforce/apex/ManagedContentController.getcategory';
import basePathName from '@salesforce/community/basePath';
import DomainName from '@salesforce/label/c.DomainName'


export default class SnpSubCategoryBreadCrumbComp extends LightningElement {

    str=basePathName;
    WebStoreName=this.str.substr(1,10);
    navitem
    url
    spliturl
    productname
    product
    productid


    renderedCallback(){
    this.url=window.location.href;
    this.spliturl=this.url.split('/');
    this.productname=this.spliturl[this.spliturl.length-2]
    this.product=this.spliturl[this.spliturl.length-1];
    this.productid=this.product.substring(0,18);

    }
  
              
    @wire(getcategory, {WebStoreName:'$WebStoreName',productid:'$productid'})
        category({data, error}){
            console.log(this.WebStoreName);
            console.log(this.productid);
            if(data){
                this.navitem=data.path;
                console.log('****'+JSON.stringify(data));
            }
            else if (error) {
              console.log(error);
            }
        }

    handlelinkclick(event){
        const clickedLinkId = event.target.getAttribute('data-id');;
        console.log('Clicked link ID:', clickedLinkId);
        const index = this.navitem.findIndex(item => item.id === clickedLinkId);
        console.log('Index:', index);
        var navstr = this.navitem[index].name;
        var replacednavstr = navstr.replace("%20", " ");
        window.location.href=DomainName+this.str+'/category/'+replacednavstr+'/'+this.navitem[index].id;

    }
        
     
     
}