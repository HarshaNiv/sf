public class Lan_Trans {
    @Auraenabled(cacheable=true)
    public static string trans(){
    Http http = new Http();
    String endpoint1 = 'https://translate.google.com/translate_a/element.js?cb=this.googleTranslateElementInit()';
    HttpRequest req1 = new HttpRequest();
    req1.setEndpoint(endpoint1);
    system.debug(req1);
    req1.setMethod('GET');
    HTTPResponse res = http.send(req1);
        system.debug('res.getbody()'+ res.getbody());
        return res.getBody();
       
    }
}