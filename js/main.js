/* Author: Jonathan de Montalembert
Date: 2012.07.20
*/

$("#dialogBox #whitePart textarea").focus(function(){
	$(this).css({"color":"black"});
}).blur(function(){
	if($(this).val() <= 0)
		$(this).css({"color":"#999999"});
});