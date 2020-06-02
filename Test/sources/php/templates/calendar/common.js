function Document_Click(e)
{
	if (!e) var obj = window.event.srcElement;
	else var obj = e.target;
	while (obj.nodeType != 1)
	{
		obj = obj.parentNode;
	}
	if (obj.tagName == 'DIV') return;
	
	if(typeof g_oMenu != 'undefined' && g_oMenu)
	{
		g_oMenu.style.display = "none"
		g_oMenu = null;
		document.onclick = null;
	}
	else return;
}

function HideMenu(div)
{
	if(typeof g_oMenu != 'undefined' && g_oMenu && (div.id != g_oMenu.id))
	{
		g_oMenu.style.display = "none"
		g_oMenu = null;
		document.onclick = null;
	}
	else return;
}

function switchdiv(div_1, div_2)
{
	if (document.getElementById)	{
	    if(!document.getElementById(div_1)) return ;
	    if(!(document.getElementById(div_1).style)) return ;
	    if(!(document.getElementById(div_1).style.display)) return ;

		var state_1 = document.getElementById(div_1).style.display;
		if(state_1=="none") {
        		document.getElementById(div_1).style.display="block";
        		document.getElementById(div_2).style.display="none";
	     }
	    if(state_1=="block") {
        		document.getElementById(div_2).style.display="block";
        		document.getElementById(div_1).style.display="none";
	     }
	}
	else if (document.all)	{
	    if(!document.all[div_1]) return ;
	    if(!(document.all[div_1].style)) return ;
	    if(!(document.all[div_1].style.display)) return ;

		var state_1 = document.all[div_1].style.display;
		if(state_1=="none") {
		        document.all[div_1].style.display = "block";
		        document.all[div_2].style.display = "none";
		}
		if(state_1=="block") {
        		document.getElementById(div_1).style.display="none";
        		document.getElementById(div_2).style.display="block";
	     }
    }
}

function showhide()
{
	var nArguments = arguments.length;
	
	function __showhide_one_argument(div)
	{
		HideMenu(document.getElementById(div));
		state = document.getElementById(div).style.display;
		g_oMenu = document.getElementById(div);
		
		if(state == "none")
		{
			g_oMenu.style.display="block";
			g_oMenu.style.visibility = 'visible';
			g_oMenu = document.getElementById(div);
			setTimeout("document.onclick = Document_Click",100);
		}
		else
		{
			g_oMenu.style.display="none";
			g_oMenu.style.visibility = 'visible';
			g_oMenu = null;
		}
		g_oMenu = document.getElementById(div);
		
	}
	
	function __showhide_two_arguments(div,ensurevis)
	{
		HideMenu(document.getElementById(div));
		state = document.getElementById(div).style.display;
		g_oMenu = document.getElementById(div);
		
		if(state == "none") { g_oMenu.style.display="block";}
		else { g_oMenu.style.display = "none";}
		g_oMenu.style.visibility = 'visible';
	}
		
		if(nArguments == 1) return __showhide_one_argument(arguments[0]);
		else if(nArguments == 2) return __showhide_two_arguments(arguments[0],arguments[1]);
		else return false;
}

// Multiple combo functions =============================

function moveUpList(listField)
{
	if ( listField.length == -1) {  // If the list is empty
	  alert("There are no values which can be moved!");
	} else {
	  var selected = listField.selectedIndex;
	  if (selected == -1) {
	     alert("You must select an entry to be moved!");
	  } else {  // Something is selected
	     if ( listField.length == 0 ) {  // If there's only one in the list
	        alert("There is only one entry!\nThe one entry will remain in place.");
	     } else {  // There's more than one in the list, rearrange the list order
	        if ( selected == 0 ) {
	           alert("The first entry in the list cannot be moved up.");
	        } else {
	           // Get the text/value of the one directly above the hightlighted entry as
	           // well as the highlighted entry; then flip them
	           var moveText1 = listField[selected-1].text;
	           var moveText2 = listField[selected].text;
	           var moveValue1 = listField[selected-1].value;
	           var moveValue2 = listField[selected].value;
	           listField[selected].text = moveText1;
	           listField[selected].value = moveValue1;
	           listField[selected-1].text = moveText2;
	           listField[selected-1].value = moveValue2;
	           listField.selectedIndex = selected-1; // Select the one that was selected before
	        }  // Ends the check for selecting one which can be moved
	     }  // Ends the check for there only being one in the list to begin with
	  }  // Ends the check for there being something selected
	}  // Ends the check for there being none in the list
}

//Hopefully the code makes sense. It is commented pretty well, so that should help. For moving down in the list, the code is quite similar:

function moveDownList(listField)
{
	if ( listField.length == -1) {  // If the list is empty
	  alert("There are no values which can be moved!");
	} else {
	  var selected = listField.selectedIndex;
	  if (selected == -1) {
	     alert("You must select an entry to be moved!");
	  } else {  // Something is selected
	     if ( listField.length == 0 ) {  // If there's only one in the list
	        alert("There is only one entry!\nThe one entry will remain in place.");
	     } else {  // There's more than one in the list, rearrange the list order
	        if ( selected == listField.length-1 ) {
	           alert("The last entry in the list cannot be moved down.");
	        } else {
	           // Get the text/value of the one directly below the hightlighted entry as
	           // well as the highlighted entry; then flip them
	           var moveText1 = listField[selected+1].text;
	           var moveText2 = listField[selected].text;
	           var moveValue1 = listField[selected+1].value;
	           var moveValue2 = listField[selected].value;
	           listField[selected].text = moveText1;
	           listField[selected].value = moveValue1;
	           listField[selected+1].text = moveText2;
	           listField[selected+1].value = moveValue2;
	           listField.selectedIndex = selected+1; // Select the one that was selected before
	        }  // Ends the check for selecting one which can be moved
	     }  // Ends the check for there only being one in the list to begin with
	  }  // Ends the check for there being something selected
	}  // Ends the check for there being none in the list
}

function allSelect(el)
{
	for (i=0;i<el.length;i++) el.options[i].selected = true;
}

// End Multiple combo fncs

function SwichImgs(img,src)
{
	document.getElementById(img).src = src;
}

function encodeMyHtml(txt)
{
	txt = escape(txt);
	txt = txt.replace(/\//g,"%2F");
	txt = txt.replace(/\?/g,"%3F");
	txt = txt.replace(/=/g,"%3D");
	txt = txt.replace(/&/g,"%26");
	txt = txt.replace(/@/g,"%40");
	return txt;
}

function bookmarksite(title, url)
{
	if (document.all) window.external.AddFavorite(url, title);
	else if (window.sidebar) window.sidebar.addPanel(title, url, "");
}

function clipboard(text) 
{
	clip.innerText = text;
	fld = clip.createTextRange();
	fld.execCommand("Copy");
}

if (!document.getElementsByClassName)
{
	document.getElementsByClassName = function(className)
	{
		var children = document.getElementsByTagName('*') || document.all;
		var elements = new Array();
		
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			var classNames = child.className.split(' ');
			for (var j = 0; j < classNames.length; j++)
			{
				if (classNames[j] == className) { elements.push(child); break; }
			}
		}
		return elements;
	}
}

function RefreshBannersOld(SHOW_BANNERS)
{
	if(!SHOW_BANNERS) return false;
	//headBanner = document.getElementById("mediaFrame728x90);
	//alert(headBanner);
	//return false;
	//headBanner.contentWindow.location.reload(true);
	
	//
	//headBanner.innerHTML = headBanner.innerHTML;
	
	banners = document.getElementsByTagName("iframe");
	
	for(i=0;i<banners.length;i++)
	{
	//alert(banners[i].id)
		//if((banners[i].id == "mediaFrame728x90") && (gIsIndex == 1))
			try
			{
				banners[i].contentWindow.location.reload();
			}
			catch (err) {}
	}
	
}

function RefreshBanners(SHOW_BANNERS)
{
	if(!SHOW_BANNERS) return false;
	banners = document.getElementsByTagName("iframe");
	for(i=0;i<banners.length;i++)
	{
    banners[i].src = banners[i].src.replace(/cb=[a-zA-Z0-9-_]+(&.*)?/, 'cb='+Math.floor(Math.random()*99999999999)+'$1');
	}
	
	if(document.getElementById("counterCQ"))
		document.getElementById("counterCQ").contentWindow.location.reload();
}

function stripslashes(str) 
{
str=str.replace(/\\'/g,'\'');
str=str.replace(/\\"/g,'"');
str=str.replace(/\\\\/g,'\\');
str=str.replace(/\\0/g,'\0');
return str;
}

function convertCyrillic(str)
{
	var encoded = "";
	plain = "������������������������������������������������������������";
	code = Array("^1040;","^1041;","^1042;","^1043;","^1044;","^1045;","^1046;","^1047;","^1048;","^1049;","^1050;","^1051;","^1052;","^1053;","^1054;","^1055;","^1056;","^1057;","^1058;","^1059;","^1060;","^1061;","^1062;","^1063;","^1064;","^1065;","^1066;","^1068;","^1070;","^1071;","^1072;","^1073;","^1074;","^1075;","^1076;","^1077;","^1078;","^1079;","^1080;","^1081;","^1082;","^1083;","^1084;","^1085;","^1086;","^1087;","^1088;","^1089;","^1090;","^1091;","^1092;","^1093;","^1094;","^1095;","^1096;","^1097;","^1098;","^1100;","^1102;","^1103;");
	for (var i = 0; i < str.length; i++ ) 
	{
		var ch = str.charAt(i);
		pos = plain.indexOf(ch);
		if (pos != -1)
			encoded += code[pos];
		else
			encoded += ch;
	}
	return encoded;
}

function placeCursorAtStart(el) 
{
  if (el.setSelectionRange)
  {
    el.setSelectionRange(0, 0);
  } 
  else if (el.createTextRange) 
  {
    var range = el.createTextRange();
    range.collapse(true);
    range.moveEnd('character', 0);
    range.moveStart('character', 0);
    range.select();
  }
}

function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1; 
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
return "";
}

function popupterms(uri_path)
{
	left = (document.body.clientWidth - 750)/2;
	window.open(uri_path+"terms.html", 'terms', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=no,width=700,height=550,left='+left+',top=50');
}

function doBlink() 
{
  // Blink, Blink, Blink...
  var blink = document.all.tags("BLINK")
  for (var i=0; i < blink.length; i++)
    blink[i].style.visibility = blink[i].style.visibility == "" ? "hidden" : "" 
}
function startBlink() {
  // Make sure it is IE4
  if (document.all)
    setInterval("doBlink()",500)
}

//window.onload = startBlink;

function addEvent(obj, evType, fn){ 
 if (obj.addEventListener){ 
   obj.addEventListener(evType, fn, false); 
   return true; 
 } else if (obj.attachEvent){ 
   var r = obj.attachEvent("on"+evType, fn); 
   return r; 
 } else { 
   return false; 
 } 
}

//addEvent(window, 'load', startBlink);

function $(_id) { return document.getElementById(_id); }

function setProcess()
{
  
	_o = arguments.length > 0 ? document.getElementById(arguments[0]) : document.getElementById("sbmBtn");
	_o.className = _o.onmouseout = "SubmitBtnNormalGreen";
	_o.onmouseover = "SubmitBtnNormalGreen";
	//_o.className = _o.onmouseout = "BlueSubmitBtnSmall";
	//_o.onmouseover = "BlueSubmitBtnSmall";
	_o.value = "Processing..."; 
}

function setProcessBlue()
{
  
	_o = arguments.length > 0 ? document.getElementById(arguments[0]) : document.getElementById("sbmBtn");
	//_o.className = _o.onmouseout = "SubmitBtn-upProcess";
	//_o.onmouseover = "SubmitBtn-downProcess";
	_o.className = _o.onmouseout = "BlueSubmitBtnSmall";
	_o.onmouseover = "BlueSubmitBtnSmall";
	_o.value = "Processing..."; 
}

function setProcessPlain()
{
  
	_o = arguments.length > 0 ? document.getElementById(arguments[0]) : document.getElementById("sbmBtn");
	_o.className = _o.onmouseout = "SubmitBtn-up";
	_o.onmouseover = "SubmitBtn-down";
	//_o.className = _o.onmouseout = "BlueSubmitBtnSmall";
	//_o.onmouseover = "BlueSubmitBtnSmall";
	_o.value = "Processing..."; 
}

function capLock(e)
{
  kc = e.keyCode?e.keyCode:e.which;
  sk = e.shiftKey?e.shiftKey:((kc == 16)?true:false);
  return (((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk));
}
