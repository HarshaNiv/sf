public class username {
    @Auraenabled
    Public static string  loginuser(string userid){
        system.debug(userid);
        string getname =[select id,Name from User where id =: userid].Name;
        system.debug(getname);
        return getname;
    }

}