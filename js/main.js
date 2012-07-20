/* Author: Jonathan de Montalembert
Date: 2012.07.20
*/

box = 	"<div id='profilePictures'>"+
			"<div class='left'><img src='img/TEST_0001s_0000s_0002_arrow-left.png'></div>"+
			"<div id='picWrapper'><div class='pictures' style='width:"+85*8+"px;position:relative;'></div></div>"+
			"<div class='right'><img src='img/TEST_0001s_0000s_0001_arrow-right.png'></div>"+
		"</div>";

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
});


// Event Handlers
$("#dialogBox #whitePart textarea").focus(function(){
	$(this).css({"color":"black"});
}).blur(function(){
	if($(this).val() <= 0)
		$(this).css({"color":"#999999"});
});


// picture Box handler
$("#timeline .picture").click(function(){
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


// functions
fetchGoogleImages = function(that, use){
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
	})
}