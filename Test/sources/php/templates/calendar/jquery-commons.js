/*
 * jQuery COMMONS, should be included after jQuery lib
 */
 
jQuery.changeClass = function(obj, className) {		
			$(obj).toggleClass(className);
      $(obj).toggleClass(className + 'Hover');
};

// set array for rotating images on index   
arrPhones = new Array();
arrPhones[0] = "-1px 0px";
arrPhones[1] = "-1px -280px";
arrPhones[2] = "-1px -560px";

// and then set random image for start
var randPhoneImageIndex = Math.floor(Math.random()*3);

$(document).ready(function() {
		
	//$(".topTabsVertBox").css("background-position", function(){ return arrPhones[randPhoneImageIndex]; });
	  
  IndexBottomTabsHandler();
  IndexTopTabsHandler();
  IndexTopVerticalTabsHandler();
  //LoadLiveChatScript();
	
	//BindMouseDown();
	applyTextChangeToggle();
	closeMessageReport();
	  
});

function IndexBottomTabsHandler()
{
	if ($('#tabMenu > li') == null) return;
	
	var currIndex = 1;
  //Get all the LI from the #tabMenu UL  
  $('#tabMenu > li').click(function(){  
  	
  	
  	if ($('#tabMenu > li').index(this) == 0) return;
  	
  	var indexOfContentToShow = 0;
  	var thisTabIndex = $('#tabMenu > li').index(this);
  	if (thisTabIndex == 1 || thisTabIndex == 2) indexOfContentToShow = 0;
  	if (thisTabIndex == 3 || thisTabIndex == 4) indexOfContentToShow = 1;
  	if (thisTabIndex == 5 || thisTabIndex == 6) indexOfContentToShow = 2;
          
    //perform the actions when it's not selected  
    if (!$(this).hasClass('selected')) {
  
    //remove the selected class from all LI      
    $('#tabMenu > li').removeClass('selected');  
      
    //After cleared all the LI, reassign the class to the selected tab  
    $(this).addClass('selected');
    
    // show the arrow for this tab
    if ($(this).hasClass('icon'))  $('#arrow' + thisTabIndex).addClass('selected');
     
    //Hide all the DIV in .boxBody  
    $('.boxBody div.shower').hide();
    //Look for the right DIV index based on the Navigation UL index     
    $('.boxBody div.shower:eq(' + indexOfContentToShow + ')').fadeIn();
      
   }
   
   currIndex = $('#tabMenu > li').index(this);
  
  }).mouseover(function() {  
        
  	var thisTabIndex = $('#tabMenu > li').index(this);
  	if (thisTabIndex == 0) return;
    
    $(this).addClass('mouseover');  
    $(this).removeClass('mouseout');     
    
    if ($(this).hasClass('icon'))  {    	
    	$('#arrow' + thisTabIndex).addClass('mouseover');
    	$('#arrow' + thisTabIndex).removeClass('mouseout');
    }
      
  }).mouseout(function() {
    
    var thisTabIndex = $('#tabMenu > li').index(this);  
    //Add and remove class  
    $(this).addClass('mouseout');  
    $(this).removeClass('mouseover');
    
    if ($(this).hasClass('icon'))  {
    	$('#arrow' + thisTabIndex).addClass('mouseout');
    	$('#arrow' + thisTabIndex).removeClass('mouseover');      
    }
      
  });
  
  var showLoop = false;
  
  if (showLoop && $.doTimeout != null) {
		  $.doTimeout( 'loop', 9000, function(){
		  	  var indexOfContentToShow = 0;
					if (currIndex == 1) indexOfContentToShow = 0;
			  	if (currIndex == 3) indexOfContentToShow = 1;
			  	if (currIndex == 5) indexOfContentToShow = 2;
			  	
			  	var theElem = $('#tabMenu li:eq(' + currIndex + ')');
			         
			    $('#tabMenu > li').removeClass('selected');  
			      
			    //After cleared all the LI, reassign the class to the selected tab  
			    $(theElem).addClass('selected');
			    
			    // show the arrow for this tab
			    if ($(theElem).hasClass('icon'))  $('#arrow' + currIndex).addClass('selected');
			     
			    //Hide all the DIV in .boxBody  
			    $('.boxBody div.shower').hide();
			    //Look for the right DIV index based on the Navigation UL index     
			    $('.boxBody div.shower:eq(' + indexOfContentToShow + ')').show();
			        		
					currIndex += 2;
					if (currIndex > 5)
					{
						currIndex = 1;
					}
					return true;
			});
	}		
}


function loopy(currIndex)
	{
		//$('#debug').html(currIndex);
		
		
	}

function getNextPhotoIndex()
{
	if (randPhoneImageIndex == (arrPhones.length - 1)) {
		randPhoneImageIndex = 0;
	}	
	return ++randPhoneImageIndex;
}

function IndexTopTabsHandler()
{
	if ($('#topTabsMenu > div') == null) return;
	
	$('#topTabsMenu > div').click(function(){
  	
    var contentIndex = 0; 
    if ($('#topTabsMenu > div').index(this) == 1) return;
    if ($('#topTabsMenu > div').index(this) == 0) contentIndex = 0;
    if ($('#topTabsMenu > div').index(this) == 2) contentIndex = 1;
    
    //perform the actions when it's not selected  
    if (!$(this).hasClass('selected')) {
  
    //remove the selected class from all divs      
    $('#topTabsMenu > div').removeClass('selected');  
      
    //After cleared all the LI, reassign the class to the selected tab  
    $(this).addClass('selected');
     
    //Hide all the DIV in .topTabsBox  
    $('.topTabsBox div.showerT').hide();
    //Look for the right DIV index based on the Navigation DIV index     
    $('.topTabsBox div.showerT:eq(' + contentIndex + ')').fadeIn();
      
   }  
  
  }).mouseover(function() {  
      
    $(this).addClass('mouseover');  
    $(this).removeClass('mouseout');     
      
  }).mouseout(function() {   
        
    $(this).addClass('mouseout');  
    $(this).removeClass('mouseover');      
      
  });  
}


function IndexTopVerticalTabsHandler()
{ 
	if ($('#verticalTabsMenu > div') == null) return;
  $('#verticalTabsMenu > div').click(function(){
  	  	  	  	
    //perform the actions when it's not selected  
    if (!$(this).hasClass('selected')) {
  
    //remove the selected class from all divs      
    $('#verticalTabsMenu > div').removeClass('selected');  
      
    $(this).addClass('selected');
         
    //Hide all the DIV in .topTabsBox  
    $('.topTabsVertBox div.showerVt').hide();
    
    $('.topTabsVertBox div.showerVt:eq(' + $('#verticalTabsMenu > div').index(this) + ')').fadeIn();
    
    //$(".topTabsVertBox").css("background-position", function(){ return arrPhones[getNextPhotoIndex()]; });
   } 
		  
  }).mouseover(function() {  
  
    $(this).addClass('mouseover');  
    $(this).removeClass('mouseout');
      
  }).mouseout(function() {   
      
    $(this).addClass('mouseout');  
    $(this).removeClass('mouseover');
      
  });
}

function applyTextChangeToggle()
{
	 if ($('.text_toggle') == null) return;
	 $('.text_toggle').click(function(){
	 				 				 			
	 			var inputTitle = $(this).attr('title');
	 			if ($(this).attr('value') == inputTitle)
	 			{
	 				$(this).attr('value','');
	 			}	 			
	 }).blur(function(){
	 		
	 		var inputTitle = $(this).attr('title');
 			if ($(this).attr('value') == '')
 			{
 				$(this).attr('value',inputTitle);
 			}
	 		
	 });
	 
}


function LoadLiveChatScript()
{
	var _script = document.createElement('script');
	_script.type = 'text/javascript';
	_script.src = 'http://php5.bg.viecorp.com/~velin/protxt_fake2/js/libover.js';
	//$('#headerRChat').html('<div id="livechat"><script language="JavaScript" src="http://support.viecorp.com/js/status_image.php?base_url=http://support.viecorp.com&l=viecorp&x=1&deptid=14&"><a href="http://www.phplivesupport.com"></a></script></div>');
	
	$('<div id="livechat"></div>').appendTo('#headerRChat');
	$('#livechat').append(_script);
	
	//$('#headerRChat').append('<div id="<div id="livechat">">' + _script + '</div>');
}
 
function BindMouseDown()
{
	$(document).bind('mousedown', function(element){ 
		      
	        var element = $(element.target)[0];
	        var observe = $('#login_menu'); 
	        while(true) 
	        { 
	                if(element == observe) 
	                { 
	                     return;
	                } 
	                else if(element == document) 
	                { 
	                    $('#login_menu').hide();
	                    $('#loginclick').removeClass('loginclick_act');
	                    $('#loginclick').addClass('loginclick');
      								return true;
	                } 
	                else 
	                { 
	                    element = $(element).parent()[0]; 
	                } 
	        } 
	        return true; 
			}); 
}

function closeMessageReport()
{
	$('#message-holder .close').click(function(){
		  $(this).parent().hide("2000");
			//$('.message-holder').hide("2000");
  });
}

 /*
  * jQuery COMMONS
  */