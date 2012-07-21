/* Author: Jonathan de Montalembert
** Date: 2012.07.20
*/

box = 	"<div id='profilePictures'>"+
			"<div class='left'><img src='img/TEST_0001s_0000s_0002_arrow-left.png'></div>"+
			"<div id='picWrapper'><div class='pictures' style='width:"+85*8+"px;position:relative;'></div></div>"+
			"<div class='right'><img src='img/TEST_0001s_0000s_0001_arrow-right.png'></div>"+
		"</div>";
		


/*
**	On page loaded
*/
$(document).ready(function(){
	
		// Add the box for svante
		$("#timeline .picture.active")
		.parent()
		.append(box);
		
		$("#profilePictures").css({"height":115, "opacity":1});
			that = $("#timeline .picture.active");
			user = $(that).attr("data-name");
			fetchGoogleImages(that, user);

		// Turn to black if any content
		if(!$("#dialogBox #whitePart textarea").val() <= 0)
			$("#dialogBox #whitePart textarea").css({"color":"black"});
			
			var db = null;

			try {
			    if (!window.openDatabase) {
			        alert(' openDatabase not supported please use webkit');
			    } else {
				
				window.db = db = openDatabase("Wall", "0.1", "P1 Wall", 50000);
				createTables(db);
				getData(db);	
				}
			} catch(e){
				if (e == 2) {
					alert("Invalid database version.");
				} else {
				  	alert("Unknown error "+e+".");
				}
				return;
			}
			
			
});


/*
** Event Handlers
*/
// color for textarea
$("#dialogBox #whitePart textarea").focus(function(){
	$(this).css({"color":"black"});
}).blur(function(){
	if($(this).val() <= 0)
		$(this).css({"color":"#999999"});
});


// picture Box handler
$("#timeline .picture").live("click", function(){
	if(!$(this).is(".active")){
		user = $(this).attr("data-name");
		that = $(this);
		fetchGoogleImages(that,user)
		$(this).addClass("active")
		.parent()
		.append(box);
		getComputedStyle($("#profilePictures")[0]).display;
		$("#profilePictures").css({"height":115, "opacity":1});
	}else{
		$(this).removeClass("active");
		$("#profilePictures").css({"height":0, "opacity":0}).remove();
	}
});

//arrows nav
$("#profilePictures .left").live("click", function(){
	var pos = parseInt($(this).parent().find(".pictures").css("left"));
	if(Math.abs(pos) < 80*7-390)
		$(this).parent().find(".pictures").css({"left":pos-80});
});
$("#profilePictures .right").live("click", function(){
	var pos = parseInt($(this).parent().find(".pictures").css("left"));
	if(Math.abs(pos) > 0)
		$(this).parent().find(".pictures").css({"left":pos+80});
});

// submit feed
$("#form").submit(function(e){
	e.preventDefault();
	var message = $(this).find("textarea").val(),
	el = $(this).find("textarea"),
	userId = $("body").attr("data-userId");
	if(message.length > 0){
		if(window.openDatabase) {
			saveMessageToDB(userId, message);
			clearTextarea(el);
			displayMessage(userId, message);
			tHeight = $("#timeline:last-child").height()
			$("#timeline:eq(0)").animate({height:tHeight}, "slow")
		}
		else
		console.log("nope")
	}
})



/*
** functions
*/
fetchGoogleImages = function(that, user){
	$.ajax({
		url:"https://ajax.googleapis.com/ajax/services/search/images",
		data:{"v":"1.0", "q":user},
		dataType: 'jsonp',
		success:function(data){
			var pics = "";
			for(i in data.responseData.results)
				pics += "<img src='"+data.responseData.results[i].url+"'>";
				pics += pics;
			$(that).parent().find("#profilePictures .pictures").html(pics);		
		}
	});
};

// var feedJson = [
// 			{"id":"1", "username":"Yu Wang", "user_id":"4", "message":"made that whole thing happen.", created_at:1195629045},
// 			{"id":"2032", "username":"Mikael Gustavsson", "user_id":"3", "message":"is writing a bunch of PHP, I guess.", created_at:1292915445}
// ];
var userJson = [
			{"id":1, "username":"Svante Jerling", "picture":"img/TEST_0001s_0000s_0006_Layer-65.png"}, 
			{"id":2, "username":"Naim Boughazi", "picture":"img/TEST_0001s_0000s_0007_Layer-64-copy.png"},
			{"id":3, "username":"Mikael Gustavsson", "picture":"img/TEST_0001s_0001s_0003_Layer-66.png"},
			{"id":4, "username":"Yu Wang", "picture":"img/TEST_0001s_0001s_0002_Layer-71.png"}
];
createTables = function(db){
	db.transaction(function (transaction) { 
		transaction.executeSql('CREATE TABLE IF NOT EXISTS feeds(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, user_id INTEGER NOT NULL, message TEXT NOT_NULL, created_at TIMESTAMP);', 
									[], 
									nullDataHandler, errorHandler);  
		transaction.executeSql('CREATE TABLE IF NOT EXISTS users(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, picture INTEGER NOT NULL);', 
									[], 
									nullDataHandler, errorHandler);
									
		//populate user
		for(i in userJson){
			transaction.executeSql("INSERT INTO users(id, username, picture) VALUES (?, ?, ?);", 
									[userJson[i].id, userJson[i].username, userJson[i].picture],
									nullDataHandler, errorHandler);
		}

		// // Populate feed
		// 		for(i in feedJson){
		// 			transaction.executeSql("INSERT INTO feeds(id, username, user_id, message, created_at) VALUES (?, ?, ?, ?, ?);", 
		// 									[feedJson[i].id, feedJson[i].username, feedJson[i].user_id, feedJson[i].message, feedJson[i].created_at],
		// 				                    nullDataHandler, errorHandler);
		// 		}
		
			});
};


feedDataHandler = function(transaction, results) {
	var string = "";
	    for (var i=0; i<results.rows.length; i++) {
	        var row = results.rows.item(i);
			displayMessage(row["user_id"], row["message"], row["created_at"]);
	    }
};

nullDataHandler = dataHandler = function(transaction, results) {
}

errorHandler = function(transaction, error){
    console.log('Error: '+error.message+' (Code '+error.code+')');
    return false;
};

getData = function(db){
	db.transaction(function (transaction) {
	        transaction.executeSql("SELECT * from feeds;",
	            [],
	            feedDataHandler, errorHandler);
	    });
};

window.dropTable = dropTable = function(db, table){
	db.transaction(function (transaction) {
		transaction.executeSql("DROP TABLE "+table+";", 
		[],
        nullDataHandler, errorHandler);
	});
}

saveMessageToDB = function(userId, message){
	db.transaction(function (transaction) {
		transaction.executeSql("INSERT INTO feeds(username, user_id, message, created_at) VALUES (?, ?, ?, ?);", 
							[userJson[userId-1].username, userId, message, new Date().getTime()],
		                    nullDataHandler, errorHandler);
	});
};

displayMessage = function(userId, message, date){
	// if there is a date defined then the datas come from the local DB
	var fromDB = date || false;
	var date = new Date(date) || new Date().getTime();
	
 	var humanDate = $.cuteTime(date);

	// console.log(humanDate)
	timeline = 	"<div id='timeline' class='fresh'>"+
	            "<div class='picture left' data-name='naim boughazi'><img src='img/TEST_0001s_0000s_0007_Layer-64-copy.png'></div>"+
	            "<div class='content right'>"+
					"<div class='username'><a href='#'>Naim Boughazi</a></div>&nbsp;"+
					"<div class='activity'>"+message+"</div>"+
					"<div class='date message'><img src='img/TEST_0001s_0003s_0003_Speech-Bubbles-2.png'>&nbsp;<label id='custom'>"+date+"<label></div>"+
				"</div>"+
				"<div class='clear'></div>"+
	        "</div>";
	$("#timelineWrapper").prepend(timeline);
	$("#timeline .message label#custom").cuteTime();
	if(fromDB)
		$("#timeline").removeClass("fresh")
}


clearTextarea = function(el){
	$(el).val("")
}