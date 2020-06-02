function in_array(needle, haystack, argStrict) {
    var key = '', strict = !!argStrict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {                return true;
            }
        }
    }
     return false;
}

function getCountSpecialChar(sMsg)
{
  var aDoubleChars = ["€","\f","[","\\","]","^","{","|","}","~"];
  var iSpecialChar = 0;

  for(i = 0; i < sMsg.length; i++ )
  {
    if (in_array(sMsg[i],aDoubleChars)) iSpecialChar++;
  }
  return iSpecialChar;
}

function SetCharCounter(sId,sIdCharLeft,iMax)
{
	var oM = document.getElementById(sId);
	var oCharLeft = document.getElementById(sIdCharLeft);

  // special char
  var sMsg = oM.value;
  var iSpecialChar = 0;
  iSpecialChar = getCountSpecialChar(sMsg);

  var iChar = oM.value.length;
	var iLeft = iMax - iChar - iSpecialChar;
  var iCurMax = iMax - iSpecialChar;
  //alert(iCurMax);
  
	if (iLeft < 0)
	{
		oM.value = oM.value.substring(0,iCurMax);
		iLeft=0;
	}
	oCharLeft.innerHTML = iLeft; // (x-20);
	return true;
}

function SetCharCounterTwoFields(sId,sId2,sIdCharLeft,iMax)
{
	var oM = document.getElementById(sId);
	var oM2 = document.getElementById(sId2);
	var oCharLeft = document.getElementById(sIdCharLeft);

  // special char
  var sMsg1 = oM.value;
  var sMsg2 = oM2.value;
  var sMsg = sMsg1 + sMsg2;
  var iSpecialChar = 0;
  iSpecialChar1 = getCountSpecialChar(sMsg1);
  iSpecialChar2 = getCountSpecialChar(sMsg2);
  iSpecialChar = iSpecialChar1 + iSpecialChar2;
  
  var iChar1 = sMsg1.length;
  var iChar2 = sMsg2.length;
  var iChar = iChar1+iChar2;
  
	var iLeft = iMax - iChar - iSpecialChar;
  
  // remove second field's value
  var iCurMax = iMax - iSpecialChar1 - iChar2;
//  alert(iCurMax);
  
	if (iLeft < 0)
	{
		oM.value = sMsg1.substring(0,iCurMax);
		iLeft=0;
	}
	oCharLeft.innerHTML = iLeft; // (x-20);
	return true;
}

function nl2br (str, is_xhtml) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Philip Peterson
    // +   improved by: Onno Marsman
    // +   improved by: Atli Þór
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Maximusya
    // *     example 1: nl2br('Kevin\nvan\nZonneveld');
    // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
    // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
    // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
    // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
    // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';

    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}