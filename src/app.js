/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var core = require('core');

  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Input to Zaim',
        subtitle: 'make a new entry'
      }, {
        title: 'Today\'s amount',
        subtitle: '\u00A50,000'
      }, {
        title: 'Weekly amount',
        subtitle: '\u00A50,000'
      }, {
        title: 'Monthly amount',
        subtitle: '\u00A50,000'
      }
      ]
    }]
  });
  var category_menu = new UI.Menu({
    sections: [{
      title: 'Payment',
      items: []
    },{
      title: 'Income',
      items: []
    }]
  });
  var amount_menu = new UI.Menu({
    sections: [{
      title: 'Amount',
      items: [
        {title:100},
        {title:200},
        {title:300},
        {title:400},
        {title:500},
        {title:600},
        {title:700},
        {title:800},
        {title:900},
        {title:1000},
        {title:1500},
        {title:2000},
        {title:3000},
        {title:4000},
        {title:5000},
        {title:8000},
      ]
    }]
  });
  amount_menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');

    core.putEntry(category_id,e.item.title,function(){
      console.log("add!!");
      amount_menu.hide()
      category_menu.hide();
      fetchAmounts();
    });
    
   
 });
  var category_id=0; 
 category_menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
      category_id=e.item.subtitle;
      amount_menu.show();

   
 });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    if(e.itemIndex==0){
      core.getCategory(function(data,status,req){
        console.log(data);
        data=JSON.parse(data);
        var pay=[],income=[];
        for(var i=0;i<data.categories.length;i++){
          var tmp={title:data.categories[i].name,subtitle:data.categories[i].id};
          if(data.categories[i].mode=="payment"){
                pay.push(tmp);
          }else{income.push(tmp);}
        }
        category_menu.items(0, pay);
        //category_menu.items(1,income);
        category_menu.show();
      });
      
    }else{
      fetchAmounts();
    }
  });
menu.show();

function fetchAmounts(){
    core.getAmounts(function(amount){
    menu.item(0,1,{ title: 'Today\'s amount',subtitle: '\u00A5'+amount});
  },function(amount){
    menu.item(0,2,{ title: 'Weekly amount',subtitle: '\u00A5'+amount});
  },function(amount){
    menu.item(0,3,{ title: 'Monthly amount',subtitle: '\u00A5'+amount});
  });
  
}

Pebble.addEventListener("ready", function (e) {
	core.loadAccessToken();
  core.loadAccessTokenSecret();
  fetchAmounts();
   console.log("ready!!!!!!");

});
Pebble.addEventListener("showConfiguration", function (e) {
   Pebble.openURL("http://www.teikoku-vol.com:3000/conf");

});

Pebble.addEventListener("webviewclosed", function(e) {
	var settings=JSON.parse(decodeURIComponent(e.response));

	if(settings.accessToken){
		core.setAccessToken( settings.accessToken);
		
	}
	
	if(settings.accessTokenSecret){
    core.setAccessTokenSecret(settings.accessTokenSecret);
	}
	
  console.log("response!!::::"+decodeURIComponent(e.response));
});

