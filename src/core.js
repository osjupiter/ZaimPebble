
var core = module.exports ;
var ajax = require('ajax');
var param = require('param');
var OAuth = require('OAuth');

core.accessor ={ 
        consumerSecret:param.consumer.Secret,
        tokenSecret: localStorage.getItem("accessTokenSecre")
      };
core.keys={
        consumerKey:param.consumer.Key,
        accessToken:localStorage.getItem("accessToken")
      };
    
      
      core.setAccessToken=function setAccessToken(accessToken){
        localStorage.setItem("accessToken", accessToken);
        core.loadAccessToken();
         console.log(JSON.stringify(core.keys));
      };
      core.setAccessTokenSecret=function setAccessTokenSecret(accessTokenSecret){
        localStorage.setItem("accessTokenSecret", accessTokenSecret);
        core.loadAccessTokenSecret();
        console.log(JSON.stringify(core.accessor));
      };
      core.loadAccessToken=function loadAccessToken(){core.keys.accessToken = localStorage.getItem("accessToken");};
      core.loadAccessTokenSecret= function loadAccessTokenSecret(){core.accessor.tokenSecret = localStorage.getItem("accessTokenSecret");};
      
      
      core.getCategory=function(suc){
        //https://api.zaim.net/v2/category
        var message={
          method: "GET",
          action: "https://api.zaim.net/v2/category"
        };
          ajax( {
            url: message.action,
            method:message.method
          }, suc,function(){
            console.log("eerrrrrrr");
          });
      };
 core.getGenre=function(suc){
        var message={
          method: "GET",
          action: "https://api.zaim.net/v2/genre"
        };
          ajax( {
            url: message.action,
            method:message.method
          }, suc,function(){
            console.log("eerrrrrrr");
          });
      };
  var getMoney=function(start_date,end_date,suc){
        var message={
          method: "GET",
          action: "https://api.zaim.net/v2/home/money",
          parameters: [
            ["oauth_version","1.0"],
            ["oauth_consumer_key", core.keys.consumerKey],
            ["oauth_token",core.keys.accessToken],
            ["oauth_timestamp", OAuth.timestamp()],
            ["oauth_nonce",OAuth.nonce(11)],
            ["oauth_signature_method","HMAC-SHA1"],
            ["start_date",start_date],
            ["end_date",end_date],
            ["limit",100],
            ["mode","payment"]
          ]
        };
      console.log(JSON.stringify(message));
        OAuth.SignatureMethod.sign(message, core.accessor);
        var header=OAuth.getAuthorizationHeader("", message.parameters);
          ajax( {
            url: message.action+"?start_date="+start_date+"&end_date="+end_date+"&limit=100&mode=payment",
            method:message.method,
            headers:{
                Authorization: header
            }
          },function(data,status){
            console.log(data);
            var amount=0;
            var obj=JSON.parse(data);
            var arr=obj.money;
            for(var i=0;i<arr.length;i++){
              amount+=arr[i].amount;
            }
            
            suc(amount);
          },function(e){console.log(e);});
  };
Date.prototype.getYmd=function(){
  return this.getFullYear()+"-"+(this.getMonth()+1)+"-"+this.getDate();
};
core.getAmounts=function(suc1,suc2,suc3){
  var today = new Date();
   var weekstart = new Date();
  weekstart.setDate(weekstart.getDate()-weekstart.getDay());
   var weekend = new Date();
   weekend.setDate(weekend.getDate()-weekend.getDay()+6);
   var monthstart = new Date();
  monthstart.setDate(1);
   var monthend = new Date();
  monthend.setMonth(monthend.getMonth()+1);
  monthend.setDate(0);
  getMoney(today.getYmd(),today.getYmd(),function(amount){
    console.log("today");
    console.log(amount);
    suc1(amount);
  });
    getMoney(weekstart.getYmd(),weekend.getYmd(),function(amount){
          console.log("weekly");
    console.log(amount);
    suc2(amount);
  });
    getMoney(monthstart.getYmd(),monthend.getYmd(),function(amount){
          console.log("month");
    console.log(amount);
    suc3(amount);
  });
  
};
      core.putEntry=function(id,num,suc){
        //https://api.zaim.net/v2/category
        var d = new Date();
        var year  = d.getFullYear();
        var month = d.getMonth() + 1;
        var day   = d.getDate();
        var message={
          method: "POST",
          action: "https://api.zaim.net/v2/home/money/payment",
          parameters: [
            ["oauth_version","1.0"],
            ["oauth_consumer_key", core.keys.consumerKey],
            ["oauth_token",core.keys.accessToken],
            ["oauth_timestamp", OAuth.timestamp()],
            ["oauth_nonce",OAuth.nonce(11)],
            ["oauth_signature_method","HMAC-SHA1"],
            ["mapping",1],
            ["category_id",id],
            ["genre_id",1],
            ["amount",num],
            ["date",year+"-"+month+"-"+day]
          ]
        };
        OAuth.SignatureMethod.sign(message, this.accessor);
        var header=OAuth.getAuthorizationHeader("", message.parameters);
        console.log(header);
        console.log( message.parameters);
          ajax( {
            url: message.action,
            method:message.method,
            headers:{
                Authorization: header,
                //"Content-Type":"application/x-www-form-urlencoded"
            },
            data:{
              "mapping":1,
              "category_id":id,
             "genre_id":1,
             "amount":num,
              "date":year+"-"+month+"-"+day
            }
          }, suc,function(error, status, request){console.log("err!"+error+status+request);});
      };
    

 //http://siyo.hatenablog.com/entry/2014/01/20/000602

 



