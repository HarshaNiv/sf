import { LightningElement } from 'lwc';
import activeLanguages from '@salesforce/site/activeLanguages';
import currentLanguage from '@salesforce/i18n/lang';
export default class Activelan extends LightningElement {
    get options() {
        return activeLanguages.map((x) => ({ value: x.code, ...x }));
    }
    get currentValue() {
        return currentLanguage;
    }
    handleLanguageSelect(evt) {
        const selectedLanguageCode = evt.detail.value;
        var basepath = "https://cgi-2f9-dev-ed.develop.my.site.com";
        debugger;
        // locale is in base path and needs to be replaced with new locale
        const newBasePath = this.updateLocaleInBasePath(
            basepath,
            currentLanguage,
            selectedLanguageCode
        );  

        var currentUrl = window.location.pathname;
        if (currentUrl) {
            var restOfUrl = currentUrl.substring(0,10);
            // var url=window.location.href
             var lan= window.location.href.substring(window.location.href.lastIndexOf('/')+1);
             if(lan == "" || lan == "?redirect=false"){
                //var url1;
                //url1= lan + '/'+ selectedLanguageCode;
                 window.location.href=window.location.origin+ restOfUrl +selectedLanguageCode;
                 window.location.href;
                 console.log('window.location.href'+window.location.href);
             }
             else if(lan !=""){
                var new_url = currentUrl.split('/');
                if(new_url[2] == currentLanguage){
                  var str1=  new_url.slice(3);
                  console.log('str1'+ str1);
                  var str2 = str1.join('/');
                  var url = window.location.origin+ restOfUrl +selectedLanguageCode + '/'+ str2;
                 window.location.href= url;
                }
                if(new_url[2] != currentLanguage){
                    var str1=  new_url.slice(2);
                    console.log('str1'+ str1);
                    var str2 = str1.join('/');
                    var url = window.location.origin+ restOfUrl +selectedLanguageCode + '/'+ str2;
                   window.location.href= url;
                  }
                //  var url = window.location.origin+ restOfUrl +selectedLanguageCode + '/'+ new_url;
                //  window.location.href= url;
                //  window.location.href;
             }
            // else if(lan !=null){
            //     var new_url = url.replace(currentLanguage, selectedLanguageCode);
            //     window.location.href=new_url;
            // }
           
           // window.location.href = window.location.origin + restOfUrl+ selectedLanguageCode;
           //window.location.href;
        } else {
            // WARNING: this is a current limitation of Lightning Locker in LWR sites
            // Locker must be disabled to reference the global window object
            console.warn('Lightning Locker must be disabled for this language picker component to redirect');
        }
    }

    updateLocaleInBasePath(path, oldLocale, newLocale){
        debugger;
        if (path.endsWith('/' + oldLocale)) {
            // replace with new locale
            return path.replace(new RegExp('/' + oldLocale + '$'), '/' + newLocale);
        } else {
            // since the default locale is not present in the base path,
            // append the new locale
            return path + '/' + newLocale;
        }
    }
}