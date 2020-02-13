// Set a global variable for language
// and set map according to it.
// Initialize mappings through it

/*WSU-03 : Cursor position maintained for typing next characters eventhough focus is changed.
Added a global varibale "globalG" to maintain caret positon for all the functions.*/
var dev_ver = false;
var demodate = "02/25/2020";
var min = 8;
var max = 25;
var globalG=0;
var arRecentKeyCodes = new Array(200);
var arRecentCharCodes=new Array(200);
var arIndex = 0;
var lg;
var ENG = 0;
var DEV = 1;
var GUJ = 2;
var PUN = 3;
var BAN = 4;
var ORI = 5;
var TAM = 6;
var KAN = 7;
var TEL = 8;
var MAL = 9;
var ASS = 10;
var URD = 11;
var IsChrome = (window.navigator.userAgent.search("Chrome") > -1);
var IsFireFox = (window.navigator.userAgent.search("Firefox") > -1);
var slg;
var gkbd;
var k = new Array();
var focusObj =-1 ;
var CCount = 0;
var divEditor;
var gPath = ".";
//var gPath = "./catalog/view/javascript/ws/";
var bSpecailSym = false;
var clipBoardBuffer="";
//Mrudu:flag to decide if counting is allowed or not
var flDoCount = false;
var bCopyPaste = true;
//variable to store activation key
var activeKey;

function SetPath(path)
{
    gPath = path;
}

function docGetSelection() {

	if (document.activeElement.nodeName == 'IFRAME') {
		return document.activeElement.contentWindow.getSelection();
	}
	else {
		 return window.getSelection();
	}

};

function setRange(selection, node, range, offset)
{
	if(offset>node.length)	offset = node.length;

	range.setStart(node,offset);
	range.setEnd(node,offset);
	range.collapse(false);
	selection.removeAllRanges();
	selection.addRange(range);
};
		//var docGetSelection = function() { return document.activeElement.contentWindow.getSelection(); };

// Kannada Matras
// InitializeMatras
function InitializeMatras()
{
    var xmlDoc;
    k = new Array();
    if (window.XMLHttpRequest)
    {
        xmlDoc=new window.XMLHttpRequest();
        if (dev_ver != true) {
        xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/Matras.txt",false);
        xmlDoc.send("");
		var txt='';
        var txtenc = xmlDoc.responseText;
		////////////////////////////////////////Sachin
		for (i=0; i<=txtenc.length-6; i=i+6) {
			a2s = (txtenc.substring(i, i+6));
			txt+=String.fromCharCode(a2s);
			}
		}
		else{
			xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/Matras.xml",false);
			xmlDoc.send("");
			var txt = xmlDoc.responseText;
			}
		/////////////////////////////////////////sachin
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/"+slg+"/"+gkbd+"/Matras.txt");
    }
	//console.log(txt);

    //////////////////////////////
    // load each element in k///
    ///////////////////////////

    var af = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i");
    var j;
    for (j=0;j<af.length;j++)
    {
        var cf ;
        if(af[j].getElementsByTagName("as")[0].childNodes[0])
        {
            cf = af[j].getElementsByTagName("as")[0].childNodes[0].nodeValue;
        }
        else
            cf = "";
        var df = af[j].getElementsByTagName("u")[0].childNodes[0]? af[j].getElementsByTagName("u")[0].childNodes[0].nodeValue:"";
        var el = df.split(",");
        var kf ;
        var ef ;
        var ff = "";
        if(df != "")
        {
            for (kf = 0; kf < el.length;kf++)
            {
                ef = parseInt(el[kf],16);
                ff = ff + String.fromCharCode(ef );
            }
        }
        k[2*j] = cf;
        k[2*j + 1] = ff;
    }
}

// if char code matches the matra start.
// or if vowel start.

function Match(ch)
{
    var i;
    var bMMatchFound = false;
    var bVMatchFound = false;
    for(i=0;i<k.length;i+=2) {

        var j;
        if (k[i] == ch)
        {
            bMMatchFound = true;
            for(j=0;j<kMO.specialKeys.halantArray.length;j++)
            {
                if(kMO.specialKeys.halantArray[j]== ch)
                    break;
            }
            if(j < kMO.specialKeys.halantArray.length)
            {
             bMMatchFound = false;
             break;
            }
        }
    }
    for(i=0;i<kMO.vowel.length;i+=1)
    {
        if (kMO.vowel[i]== ch)
        {
            bVMatchFound = true;
            break;
        }
    }
    return bVMatchFound||bMMatchFound;
}

// Match Pure matras no joins
function MatchMatra(ch)
{
    var i;
    var bMMatchFound = false;
    var bVMatchFound = false;
    for(i=0;i<k.length;i+=2)
    {
        var j;
        if (k[i+1] == ch)
        {
            bMMatchFound = true;
            for(j=0;j<kMO.specialKeys.halantArray.length;j++)
            {
                if(kMO.specialKeys.halantArray[j]== k[i])
                    break;
            }
            if(j < kMO.specialKeys.halantArray.length)
            {
                bMMatchFound = false;
                break;
            }
        }
    }
    if(kMO.specialKeys.isPresentUni(ch)) bMMatchFound = true;
    return bMMatchFound;
}
function MatchNumeralsTam(ch)
{
    var n = ch.charCodeAt(0);
    if(n>=0xBE6 && n<=0xBF2)
        return true;
    else return false;
}
function MatchVattuTel(r)
{
	if((r=="R") || (r=="N") || (r=="O") || (r==".") || (r=="@") || (r=="A") || (r=="1")
		|| (r=="D") || (r=="a") || (r=="!") || (r=="&") || (r=="Q") || (r==">") || (r=="}")
		|| (r=="/") || (r=="L") || (r=="\"") || (r=="{") || (r=="J") || (r=="2")
		|| (r=="M") || (r=="V") || (r=="B") || (r=="F") || (r=="?"))
		return true;
	else
		return false;
}
// compare string with vowel unicode
// if match found return true else false
function MatchVowelUni(ch)
{
    var i;
    var bVMatchFound = false;
    for(i=0;i<kMO.vowelUni.length;i+=1)
    {
        if (kMO.vowelUni[i]== ch)
        {
            bVMatchFound = true;
            break;
        }
    }
    return bVMatchFound;
}
// compare string with vowel strings
// if match found return true else false
function MatchVowel(ch)
{
    var i;
    var bVMatchFound = false;
    for(i=0;i<kMO.vowel.length;i+=1)
    {
        if (kMO.vowel[i]== ch)
        {
            bVMatchFound = true;
            break;
        }
    }
    return bVMatchFound;
}
// Compares keystrokes with hanlant keystrokes found in
// initialized halantArray
function Halant(ch) {

    var i = 0;
    for(i = 0; i< kMO.specialKeys.halantArray.length;i++)
    {
        if(kMO.specialKeys.halantArray[i] == ch)
        return true;
    }
    return false;
}

// Comparison with halant unicode value
// function returns true if matched else false
function HalantUni(ch)
{
    var i = 0;
    if(kMO.halant  == ch)
        return true;
    return false;
}

var ab;// location for URL check.
var sp = 0;
var p1 = new Array("192",0); // for URL in browser addressbar check
var kMO ; //Composition arrays
var C ; //Object associated with each textarea/input box for composing
var iL ; //Index to composer arrays
function A(b,c,d,e)// b and d are strings and for c pass window object. e is an object for storage of location
{
    var t;
    var x;
    var z;
    b = b+ "\u0C85";
    t= c.location;
    x = b + d;
    z = x + t.href;
    e.l = t;
    return z;
}


function B(x,y,z) // x is the object containing location
{                 // y and z are temporary strings.
    var a;
    var b;
    var c;
    var d;
    a = y;
    c = x.hostname;
    b = z + a;
    d = c;
    return d;
}

function R(Source,stringToFind,stringToReplace){

   var temp = Source;

   var index = temp.indexOf(stringToFind);

   while(index != -1){

        temp = temp.replace(stringToFind,stringToReplace);

        index = temp.indexOf(stringToFind);

    }

    return temp;

}
// New function P
// for hostname
//
function P()
{
    this.x= "\u0CC9"; // contains the hostname
    this.l="\u0CC8";  // contains the location object
    this.u ="\u0CCA\u0CCB";
}
///////////////////////////////////////////////////////////////////////////////
// function that parses first part
// Populate the character index array.
// a for window object
// b for Kannada map array
// c for hostname
function P1(a,b,c)
{
    var xmlDoc;
    if (a.XMLHttpRequest)
    {
        xmlDoc=new a.XMLHttpRequest();
		if (dev_ver != true) {
        xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/One.txt",false);
        xmlDoc.send("");
        var txt='';
        var txtenc = xmlDoc.responseText;
		////////////////////////////////////////Sachin
		for (i=0; i<=txtenc.length-6; i=i+6) {
			a2s = (txtenc.substring(i, i+6));
			txt+=String.fromCharCode(a2s);
			}
		}
		else{
			xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/One.xml",false);
			xmlDoc.send("");
			var txt = xmlDoc.responseText;
			}
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/"+slg+"/"+gkbd+"/One.xml");
    }
    // using XML Document fill the arrays in Map
    var af = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i");
    var j;
    for (j=0;j<af.length;j++)
    {
        var OC = new Array();

        var bf = af[j].getElementsByTagName("a")[0].childNodes[0].nodeValue;
        var gf = af[j].getElementsByTagName("s");
        var k ;
        for(k = 0;k<gf.length;k++)
        {
            var cf = gf[k].getElementsByTagName("as")[0].childNodes[0].nodeValue;
            var df = gf[k].getElementsByTagName("u")[0].childNodes[0].nodeValue;
            var gC = gf[k].getElementsByTagName("b")[0].childNodes[0].nodeValue;
            // unicode values separated by ,
            var el = df.split(",");
            var kf ;
            var ef ;
            var ff = "";
            for (kf = 0; kf < el.length;kf++)
            {
                ef = parseInt(el[kf],16);
                ff = ff + String.fromCharCode(ef );
            }
            OC[k] = new Array(cf,ff,gC,false);
        }

        b.CI[j] = new e_comp(bf,null,OC,b);

    }
    b.s = b.CI.length;
}

///////////////////////////////////////////////////////////////////////////////
// function that parses second part
// Populate the character index array.
// a for window object
// b for Kannada map object
// c for hostname
function P2(a,b,c)
{
    var xmlDoc;
    if (a.XMLHttpRequest)
    {
        xmlDoc=new a.XMLHttpRequest();
		if (dev_ver != true) {
        xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/Two.txt",false);
          xmlDoc.send("");
		var txt='';
        var txtenc = xmlDoc.responseText;
		////////////////////////////////////////Sachin
		for (i=0; i<=txtenc.length-6; i=i+6) {
			a2s = (txtenc.substring(i, i+6));
			txt+=String.fromCharCode(a2s);
			}
		}
		else{
			xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/Two.xml",false);
			xmlDoc.send("");
			var txt = xmlDoc.responseText;
			}
		/////////////////////////////////////////sachin
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/"+slg+"/"+gkbd+"/Two.xml");
    }
    // using XML Document fill the arrays in Map
   var af = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i");
    var j;
    var ii;
    var lm =b.CI.length;
    ii=0;
    for (j=lm;j<(af.length+lm);j++)
    {
        var OC = new Array();

        var bf = af[ii].getElementsByTagName("a")[0].childNodes[0].nodeValue;
        var gf = af[ii].getElementsByTagName("s");
        var k ;
        for(k = 0;k<gf.length;k++)
        {
            var cf = gf[k].getElementsByTagName("as")[0].childNodes[0].nodeValue;
            var df = gf[k].getElementsByTagName("u")[0].childNodes[0].nodeValue;
            var gC = gf[k].getElementsByTagName("b")[0].childNodes[0].nodeValue;
            // unicode values separated by ,
            var el = df.split(",");
            var kf ;
            var ef ;
            var ff = "";
            for (kf = 0; kf < el.length;kf++)
            {
                ef = parseInt(el[kf],16);
                ff = ff + String.fromCharCode(ef );
            }
            OC[k] = new Array(cf,ff,gC,false);
        }
        b.CI[j] = new e_comp(bf,null,OC,b);
        ii++;
    }
    b.t = b.CI.length;
}

///////////////////////////////////////////////////////////////////////////////
// function that parses third part
// Populate the character index array.
// a for window object
// b for Kannada map object
// c for hostname
function P3(a,b,c)
{
    var xmlDoc;
    if (a.XMLHttpRequest)
    {
        xmlDoc=new a.XMLHttpRequest();
		if (dev_ver != true) {
        xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/Three.txt",false);
         xmlDoc.send("");
		var txt='';
        var txtenc = xmlDoc.responseText;
		////////////////////////////////////////Sachin
		for (i=0; i<=txtenc.length-6; i=i+6) {
			a2s = (txtenc.substring(i, i+6));
			txt+=String.fromCharCode(a2s);
			}
		}
		else{
			xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/Three.xml",false);
			xmlDoc.send("");
			var txt = xmlDoc.responseText;
			}
		/////////////////////////////////////////sachin
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/"+slg+"/"+gkbd+"/Three.xml");
    }
    // using XML Document fill the arrays in Map
    var af = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i");
    var j;
    var ii;
    var lm =b.CI.length;
    ii=0;
    for (j=lm;j<(af.length+lm);j++)
    {
        var OC = new Array();

        var bf = af[ii].getElementsByTagName("a")[0].childNodes[0].nodeValue;
        var gf = af[ii].getElementsByTagName("s");
        var k ;
        for(k = 0;k<gf.length;k++)
        {
            var cf = gf[k].getElementsByTagName("as")[0].childNodes[0].nodeValue;
            var df = gf[k].getElementsByTagName("u")[0].childNodes[0].nodeValue;
            var gC = gf[k].getElementsByTagName("b")[0].childNodes[0].nodeValue;

            // unicode values separated by ,
            var el = df.split(",");
            var kf ;
            var ef ;
            var ff = "";
            for (kf = 0; kf < el.length;kf++)
            {
                ef = parseInt(el[kf],16);
                ff = ff + String.fromCharCode(ef );
            }
            OC[k] = new Array(cf,ff,gC,false);
        }

        b.CI[j] = new e_comp(bf,null,OC,b);
        ii++;

    }
    b.fo = b.CI.length;
}

///////////////////////////////////////////////////////////////////////////////
// function that parses fourth part
// Populate the character index array.
// a for window object
// b for Kannada map object
// c for hostname
function P4(a,b,c)
{
    var xmlDoc;
    if (a.XMLHttpRequest)
    {
        xmlDoc=new a.XMLHttpRequest();
		if (dev_ver != true) {
        xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/Four.txt",false);
		xmlDoc.send("");
		var txt='';
        var txtenc = xmlDoc.responseText;
		////////////////////////////////////////Sachin
		for (i=0; i<=txtenc.length-6; i=i+6) {
			a2s = (txtenc.substring(i, i+6));
			txt+=String.fromCharCode(a2s);
			}
		}
		else{
			xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/Four.xml",false);
			xmlDoc.send("");
			var txt = xmlDoc.responseText;
			}
		/////////////////////////////////////////sachin
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/"+slg+"/"+gkbd+"/Four.xml");
    }
    // using XML Document fill the arrays in Map
    var af = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i");
    var j;
    var ii;
    var lm =b.CI.length;
    ii=0;
    for (j=lm;j<(af.length+lm);j++)
    {
        var OC = new Array();

        var bf = af[ii].getElementsByTagName("a")[0].childNodes[0].nodeValue;
        var hf = af[ii].getElementsByTagName("b")[0].childNodes[0].nodeValue;
        var gf = af[ii].getElementsByTagName("s");
        var k ;
        for(k = 0;k<gf.length;k++)
        {
            var cf = gf[k].getElementsByTagName("as")[0].childNodes[0].nodeValue;
            var df = gf[k].getElementsByTagName("u")[0].childNodes[0].nodeValue;
            var gC = gf[k].getElementsByTagName("b")[0].childNodes[0].nodeValue;

            // unicode values separated by ,
            var el = df.split(",");
            var kf ;
            var ef ;
            var ff = "";
            for (kf = 0; kf < el.length;kf++)
            {
                ef = parseInt(el[kf],16);
                ff = ff + String.fromCharCode(ef );
            }
            OC[k] = new Array(cf,ff,gC,false);
        }
        b.CI[j] = new e_comp(bf,null,OC,b);
        ii++;
    }
    //b.fo = b.CI.length;
}

function setTutorValues(obj)
{
    // WSU-56
    if (null == document.getElementById("floatTutor"))
          return;

    var str = "tutor";
    var j = 1;
    for(;j<=14;j++)
    {
        var tutorid = str+ "1"+"ph"+j;
        if(document.getElementById(tutorid).innerHTML == obj[0])
        {
            document.getElementById(str+ "1"+"p"+j).innerHTML = obj[1];
            return;
        }
    }
       j = 1;
    for(;j<=12;j++)
    {
        var tutorid = str+ "2"+"ph"+j;
        if(document.getElementById(tutorid).innerHTML == obj[0])
        {

            document.getElementById(str+ "2"+"p"+j).innerHTML = obj[1];
            return;
        }
    }
       j = 1;
    for(;j<=11;j++)
    {
        var tutorid = str+ "3"+"ph"+j;
        if(document.getElementById(tutorid).innerHTML == obj[0])
        {

            document.getElementById(str+ "3"+"p"+j).innerHTML = obj[1];
            return;
        }
    }
       j = 1;
    for(;j<=10;j++)
    {
        var tutorid = str+ "4"+"ph"+j;
        if(document.getElementById(tutorid).innerHTML == obj[0])
        {

            document.getElementById(str+ "4"+"p"+j).innerHTML = obj[1];
            return;
        }
    }

}

// function sets state of tutor and changes display contents
function SetState(state)
{
    // WSU-56
    if (null == document.getElementById("floatTutor"))
          return;

    var arr;
    var i;
    if (tutorState == state) return;

    tutorState = state;
    switch(tutorState)
    {
        case 1:
            document.getElementById("Normal").className = 'keysel';
            document.getElementById("normal1").className = 'keysel';
            document.getElementById("Shift").className = 'keynotsel';
            document.getElementById("shift1").className = 'keynotsel';
            document.getElementById("ctrlspace1").className = 'keynotsel';
            document.getElementById("CtrlSpace").className = 'keynotsel';
            arr = kMO.arrNormal;
        break;
        case 2:
            document.getElementById("Normal").className = 'keynotsel';
            document.getElementById("normal1").className = 'keynotsel';
            document.getElementById("Shift").className = 'keysel';
            document.getElementById("shift1").className = 'keysel';
            document.getElementById("ctrlspace1").className = 'keynotsel';
            document.getElementById("CtrlSpace").className = 'keynotsel';
            arr = kMO.arrShift;
        break;
        case 3:
            document.getElementById("Normal").className = 'keynotsel';
            document.getElementById("normal1").className = 'keynotsel';
            document.getElementById("Shift").className = 'keynotsel';
            document.getElementById("shift1").className = 'keynotsel';
            document.getElementById("ctrlspace1").className = 'keysel';
            document.getElementById("CtrlSpace").className = 'keysel';
            arr = kMO.arrCtrlSpace;
        break;
    }
    for (i = 0 ; i < arr.length;i++)
    {
        setTutorValues(arr[i]);
    }
    // This is done in case of IE div tag composing
    // On clicking and item normal, shift and ctrlSpace the focus in editor
    // is set to start.

}

var normalArray =new Array ("`","1","2","3","4","5","6","7","8","9","0","-","=","[","]","\\",";","'",",",".","/");
var shiftArray = new Array ("~","!","@","#","$","%","^","&","*","(",")","_","+","{","}","|" ,":","\"","<",">","?");
//Convert to upper case
function ShiftUpper(c)
{
    var i = 0;
    if(c.charCodeAt(0) >= 0x61 && c.charCodeAt(0) <= 0x7A)
    {
        c = c.toUpperCase();
        return c;
    }
    while(i< normalArray.length)
    {
        if(c == normalArray[i])
          return shiftArray[i];
        i++;
    }


    return 0;
}
// WSU-04 : Function called from keyboard tutor for composing characters
function Compose(r, ele) {
    var i;
    bSpecailSym=false;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(activeElement == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        // only for div tag from stored position;
        // Change the selection.
        switch(tutorState)
        {
            case 1: //Normal do nothing
            break;
            case 2: // Shift hence convert to uppercase
            r = ShiftUpper(r);
            break;
        case 3: // CtrlSpace
            {

                bSpecailSym = false;
                var cnt = r.charCodeAt(0);

                if (gkbd == "Inscript") {
                    switch (cnt) {
                        case 107: cnt = 122;
                            r += String.fromCharCode(cnt);
                            break; // ka nukta

                        case 106: r = 75;
                            r = String.fromCharCode(r);
                            cnt = 122;
                            r += String.fromCharCode(cnt);
                            break; //kha nukta

                        case 72: r = 72;
                            r = String.fromCharCode(r);
                            cnt = 122;
                            r += String.fromCharCode(cnt);
                            break;

                        case 104:
                            r = 72;
                            r = String.fromCharCode(r);
                            cnt = 122;
                            r += String.fromCharCode(cnt);
                            break;

                        case 105: cnt = 122;
                            r += String.fromCharCode(cnt);
                            break;
                        case 122: r = 88;
                            r = String.fromCharCode(r);
                            cnt = 122;
                            this.Ps = "";
                            r += String.fromCharCode(cnt);
                            break;

                        case 112: cnt = 122;
                            r += String.fromCharCode(cnt);
                            break;

                        case 98: r = 78;
                            r = String.fromCharCode(r);
                            cnt = 122;
                            r += String.fromCharCode(cnt);
                            break;

                        case 47: r = String.fromCharCode(cnt);
                            cnt = 122;
                            r += String.fromCharCode(cnt);
                            break;

                        case 108: r = 108;
                            r = String.fromCharCode(r);
                            cnt = 100;
                            r += String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 108;
                            r = String.fromCharCode(cnt);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        case 114: bSpecailSym = true;
                            cnt = 8377;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;

                        case 61: bSpecailSym = true;
                            cnt = 2401;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;

                        case 117: bSpecailSym = true;
                            cnt = 37;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;

                        case 119: bSpecailSym = true;
                            //WSU-20 : English ` required
                            cnt = 96;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
									}
                            }
                            break;
                        case 97: bSpecailSym = true;
                            cnt = 34;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        case 115: bSpecailSym = true;
                            cnt = 43;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        case 100: bSpecailSym = true;
                            cnt = 47;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        case 102: bSpecailSym = true;
                            cnt = 247;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        case 103: bSpecailSym = true;
                            cnt = 45;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        case 113: bSpecailSym = true;
                            cnt = 215;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;

                        default: break;

                    }
                }
                //WSU-06 :Code changes to type correct letters on CTRL+SPACE layer.
                //vinayak
                else if (gkbd == "Monotype") {

                    switch (cnt) {
                        //Nukta sign
                        case 51: cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //                        case 118: cnt = 109;
                        //                            r = String.fromCharCode(cnt);
                        //                            break;

                        case 121: cnt = 78;
                            r = String.fromCharCode(cnt);
                            // C[i].COM(r);
                            break;



                    }
                }   // end of monotype

                //vinayak
                else if (gkbd == "Linotype") {

                    switch (cnt) {
                        //Nukta sign
                        case 51: cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;

                        case 115: cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;


                    }
                } // end of Linotype


                else if (gkbd == "Phonetic") {
                    switch (cnt) {


                        case 50: r = 81;   // WSU-66 4-Aug-2015 link + 200D on Ctrl+Space+2
                            r = String.fromCharCode(r);
                            break;
                        case 117: r = 79;
                            r = String.fromCharCode(r);
                            cnt = 109;
                            r += String.fromCharCode(cnt);
                            break;

                        case 52: r = 82;
                            r = String.fromCharCode(r);
                            break;

                        case 100: r = 78;

                            r = String.fromCharCode(r);
                            cnt = 103;
                            r += String.fromCharCode(cnt);
                            break;

                        case 110: r = 78;
                            r = String.fromCharCode(r);
                            cnt = 121;
                            r += String.fromCharCode(cnt);
                            break;

                        case 97: r = 45;
                            r = String.fromCharCode(r);
                            break;
                        // added by vinayak for bng on 23/08/2016
                        case 103: this.removeSpecialCtrlSpace();
                            v = 0x00BC;
                            this.strNewCode += String.fromCharCode(v);
                            this.COM(this.strNewCode);
                            this.strNewCode = "";
                            v = "";
                            break;

                        case 104: this.removeSpecialCtrlSpace();
                            v = 0x00BD;
                            this.strNewCode += String.fromCharCode(v);
                            this.COM(this.strNewCode);
                            this.strNewCode = "";
                            v = "";
                            break;


                        case 105: this.removeSpecialCtrlSpace();
                            v = 0x00BE;
                            this.strNewCode += String.fromCharCode(v);
                            this.COM(this.strNewCode);
                            this.strNewCode = "";
                            v = "";
                            break;

                    }
                }
                else if (gkbd == "Modular") {

                    switch (cnt) {

                        //Nukta sign
                        case 51: cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //devnagri division sign
                        case 55: bSpecailSym = true;
                            cnt = 247; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //devnagri multiplication sign

                        case 56: bSpecailSym = true;
                            cnt = 215; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //En dash
                        case 45: bSpecailSym = true;
                            cnt = 8211; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //Em dash
                        case 61: bSpecailSym = true;
                            cnt = 8212; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //Da nukta
                        case 111: cnt = 79;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //Dha nukta
                        case 112: cnt = 80;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //kha nukta
                        case 97: cnt = 83;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //ka nukta
                        case 115: cnt = 115;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //pha nukta
                        case 100: cnt = 87;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //devnagri anudatta sign
                        case 106: cnt = 2386;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        //devnagri short E
                        case 108: cnt = 2374;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        //ga nukta
                        case 120: cnt = 120;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //ja nukta
                        case 99: cnt = 99;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 36;
                            r = String.fromCharCode(cnt);
                            break;
                        //dirgha Ru
                        case 118: cnt = 2400;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        //Ru matra
                        case 98: cnt = 2372;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        //la
                        case 109: cnt = 109
                            r = String.fromCharCode(cnt);
                            break;
                    }
                }
                // handle third layer for virtual keyboard 21-6-2017
                else if (gkbd == "TypeWrit") {

                    switch (cnt) {
                        case 112: cnt = 3126;
                            r = String.fromCharCode(cnt);
                            cnt = 3149;
                            r += String.fromCharCode(cnt);
                            cnt = 3120;
                            r += String.fromCharCode(cnt);
                            cnt = 3136;
                            r += String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 97: cnt = 3093;
                            r = String.fromCharCode(cnt);
                            cnt = 3149;
                            r += String.fromCharCode(cnt);
                            cnt = 3127;
                            r += String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 92: cnt = 3174;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 117: cnt = 3133;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 49: cnt = 3080;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 50: cnt = 3082;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 51: cnt = 3086;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 52: cnt = 3087;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 53: cnt = 3091;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 54: cnt = 3092;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 55: cnt = 3096;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 56: cnt = 3097;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 57: cnt = 3099;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 48: cnt = 3101;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 45: cnt = 3106;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 61: cnt = 3109;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;

                        case 113: cnt = 3111;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 119: cnt = 3114;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 121: cnt = 3129;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 101: cnt = 3115;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 114: cnt = 3117;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 116: cnt = 3119;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 117: cnt = 3129;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 105: cnt = 3083;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 111: cnt = 3168;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 115: cnt = 3082;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        case 100: bSpecailSym = true;
                            cnt = 39; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 102: bSpecailSym = true;
                            cnt = 39; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 103: bSpecailSym = true;
                            cnt = 59; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 104: bSpecailSym = true;
                            cnt = 58; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 106: bSpecailSym = true;
                            cnt = 45; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 107: bSpecailSym = true;
                            cnt = 43; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 108: bSpecailSym = true;
                            cnt = 42; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 122: bSpecailSym = true;
                            cnt = 37; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 120: bSpecailSym = true;
                            cnt = 61; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 99: bSpecailSym = true;
                            cnt = 40; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 118: bSpecailSym = true;
                            cnt = 41; r = String.fromCharCode(cnt);
                            C[i].is(r);

                            break;
                        case 98: bSpecailSym = true;
                            cnt = 33; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        default:
                            bSpecailSym = true;
                            cnt = 0; r = String.fromCharCode(cnt);
                            C[i].is('');
                            break;
                    }
                    if (!document.selection) {
                        var sel = window.getSelection();
                        if (sel.focusNode) {
                            C[i].posNode = sel.focusNode;
                            C[i].posOffset = sel.anchorOffset;
                        }
                    }
                }
                else if (gkbd == "Godrej") {
                    switch (cnt) {
                        //Nukta sign
                        case 51: cnt = 126;
                            r = String.fromCharCode(cnt);
                            break;

                        //Dirgha Ru
                        case 52: cnt = 2400;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;

                        //Ru matra
                        case 53: cnt = 2372;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;

                        //Division sign
                        case 55: bSpecailSym = true;
                            cnt = 247; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //Multiplication Sign
                        case 56: bSpecailSym = true;
                            cnt = 215; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //- sign
                        case 45: bSpecailSym = true;
                            cnt = 8211; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //Em dash
                        case 61: bSpecailSym = true;
                            cnt = 8212; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //Avagraha sign
                        case 117: bSpecailSym = true;
                            cnt = 2365; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //Visarga
                        case 105: cnt = 208;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            r = "";
                            break;

                        //Exclamation mark
                        case 111: bSpecailSym = true;
                            cnt = 33; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //Link ya
                        case 112: cnt = 161;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            r = "";
                            break;
                        //Ai matra with anuswar
                        case 115: cnt = 83;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 97;
                            r = String.fromCharCode(cnt);
                            break;
                        //Half
                        case 100: cnt = 96;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            r = "";
                            cnt = 96;
                            r = String.fromCharCode(cnt);
                            break;
                        //tha
                        case 102: cnt = 166;
                            r = String.fromCharCode(cnt);
                            break;
                        case 103: cnt = 191;
                            r = String.fromCharCode(cnt);
                            break;
                        //kha nukta
                        case 104: cnt = 91;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 126;
                            r = String.fromCharCode(cnt);
                            break;

                        //Da nukta
                        case 107: cnt = 77;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 126;
                            r = String.fromCharCode(cnt);
                            break;
                        //Dha nukta
                        case 108: cnt = 60;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 126;
                            r = String.fromCharCode(cnt);
                            break;

                        //ga nukta
                        case 120: cnt = 120;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 126;
                            r = String.fromCharCode(cnt);
                            break;
                        //pha nukta
                        case 99: cnt = 87;
                            r = String.fromCharCode(cnt);
                            C[i].COM(r);
                            cnt = 126;
                            r = String.fromCharCode(cnt);
                            break;
                        //Dirgha i
                        case 98: cnt = 2312;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;
                        //* sign
                        case 110: bSpecailSym = true;
                            cnt = 42; r = String.fromCharCode(cnt);
                            C[i].is(r);
                            if (!document.selection) {
                                var sel = docGetSelection();
                                if (sel.focusNode) {
                                    C[i].posNode = sel.focusNode;
                                    C[i].posOffset = sel.anchorOffset;
                                }
                            }
                            break;
                        //Dirgha u
                        case 109: cnt = 2314;
                            r = String.fromCharCode(cnt);
                            C[i].is(r);
                            break;

                    }
                }


                break;
            }
        }

       if(bSpecailSym == false)
       {
       //WSU-05 :Characters can be typed in div tag through tutor
        if(C[i].bDiv)
        {
			activeElement.focus();
			var sel = docGetSelection();
			var rngGlobal = document.createRange();
			setRange(sel, C[i].posNode, rngGlobal, C[i].posOffset);

			C[i].COM(r);

			//Reinitialize position parameters.
			sel = docGetSelection();
			C[i].posNode = sel.focusNode;
			C[i].posOffset = sel.anchorOffset;
        }
        else
        {
            activeElement.focus();
            C[i].COM(r);
        }

    }
   if(flDoCount==true)
       setCounts();
    }
}
var tutorState = 1; // Normal,Shift,CtrlSpace
function InitializeTutorArrays(gKMO)
{
        // WSU-56
        if (null == document.getElementById("floatTutor"))
          return;
		if (dev_ver != true) {
			var xmlDoc = RequestXMLFile(gPath+"/web/"+slg+"/"+gkbd+"/Layout.txt");
		}
		else {
			var xmlDoc = RequestXMLFile(gPath+"/web/"+slg+"/"+gkbd+"/Layout.xml");
			}
        var list = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i");
        var i= 0;
        for(;i< list.length;i++)
        {
            gKMO.arrNormal[i] = new Array();
            gKMO.arrShift[i] = new Array();
            gKMO.arrCtrlSpace[i] = new Array();
            gKMO.arrNormal[i][0] = list[i].getElementsByTagName("key")[0].childNodes[0].nodeValue;
            gKMO.arrShift[i][0] = gKMO.arrNormal[i][0] ;
            gKMO.arrCtrlSpace[i][0] = gKMO.arrNormal[i][0] ;
            var temp;
            if(list[i].getElementsByTagName("uniN")[0].childNodes[0])
            {
                temp=  list[i].getElementsByTagName("uniN")[0].childNodes[0].nodeValue;
            }
            else temp ="";
            var univals = temp.split(",");
            var kf ;
            var ef ;
            gKMO.arrNormal[i][1]= "";
            for (kf = 0; kf < univals.length;kf++)
            {
                ef = parseInt(univals[kf],16);
                gKMO.arrNormal[i][1]= gKMO.arrNormal[i][1]+ String.fromCharCode(ef );
            }
            // Get Key from tutor and check with gKMO.arrNormal[i][0]
            // if match set tutor text with the uni value in arrNomal[i][1]
            setTutorValues(gKMO.arrNormal[i]);

            if(list[i].getElementsByTagName("uniS")[0].childNodes[0])
            {
                temp=  list[i].getElementsByTagName("uniS")[0].childNodes[0].nodeValue;
            }
            else temp ="";
            univals = temp.split(",");
            gKMO.arrShift[i][1]= "";
            for (kf = 0; kf < univals.length;kf++)
            {
                ef = parseInt(univals[kf],16);
                gKMO.arrShift[i][1]= gKMO.arrShift[i][1]+ String.fromCharCode(ef );
            }

            if(list[i].getElementsByTagName("uniCS")[0].childNodes[0])
            {
                temp=  list[i].getElementsByTagName("uniCS")[0].childNodes[0].nodeValue;
            }
            else temp ="";
            univals = temp.split(",");
            gKMO.arrCtrlSpace[i][1]= "";
            for (kf = 0; kf < univals.length;kf++)
            {
                ef = parseInt(univals[kf],16);
                gKMO.arrCtrlSpace[i][1]= gKMO.arrCtrlSpace[i][1]+ String.fromCharCode(ef );
            }


        }


}
function ComposeEnter()
{

     var i;
     for(i=0;i< C.length;i++)
     {
        //Finding the the composer corresponding to the element in which the key pressed
        if(activeElement == C[i].ptr)
        {
            break;
        }
     }
     if(i<C.length)
     {
        if(!C[i].bDiv)
        {
			C[i].ptr.value = C[i].ptr.value+"\n";
			globalG=C[i].ptr.value.length;
        }
        else
        {
			// div tag.
		   range = docGetSelection().getRangeAt(0);
		   range.deleteContents();
		   var newNode = document.createElement('br');

		   activeElement.appendChild(newNode);
		   activeElement.focus();
        }
     }
}
function ComposeBk()
{

    var i;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(activeElement == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        if(!C[i].bDiv)
        {
    // input (type text) textarea
    //
			var b = C[i].ptr.value.substring(0, globalG - 1);
			var l = C[i].ptr.value.substring(globalG , C[i].ptr.value.length);
			C[i].ptr.value = b + l;
			globalG--;
			C[i].ptr.selectionStart = globalG;
			C[i].ptr.selectionEnd = C[i].ptr.selectionStart ;
        }
        else
        {
            // div tag.
			var sel = docGetSelection();
			var rng = document.createRange();
			setRange(sel, C[i].posNode, rng, C[i].posOffset);
			var focusNode = sel.focusNode;
			var offset = sel.anchorOffset;
			var str = focusNode.nodeValue;
			if( str != undefined || str)
			{
				str = str.substring(0,offset-1) + str.substring(offset,str.length);
				focusNode.nodeValue = str;
				setRange(sel, focusNode, rng, offset-1);

				sel = docGetSelection();
				C[i].posNode = sel.focusNode;
				C[i].posOffset = sel.anchorOffset;
			}
        }
    }
}

function ComposeSpace(e)
{

    var i;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(activeElement == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        if(!C[i].bDiv)
        {
            // input (type text) textarea
			var b = C[i].ptr.value.substring(0, globalG );
			var l = C[i].ptr.value.substring(globalG , C[i].ptr.value.length);
			C[i].ptr.value = b +" "+ l;
			globalG++;
			C[i].ptr.selectionStart = globalG;
			C[i].ptr.selectionEnd = C[i].ptr.selectionStart ;
			activeElement.focus();
        }
        else
        {
            // div tag.
			var sel = docGetSelection();
			var rng = document.createRange();
			setRange(sel, C[i].posNode, rng, C[i].posOffset);

			sel = docGetSelection();
			var focusNode = sel.focusNode;
			var offset = sel.anchorOffset;

			rng = sel.getRangeAt(0);
			var str = focusNode.data;
			if( str != undefined || str)
			{
				var tempStr;
				tempStr =str.substring(0,offset) +" " + str.substring(offset,str.length);
				focusNode.data = tempStr;
				setRange(sel, focusNode, rng, offset+1);

				sel = docGetSelection();
				C[i].posNode = sel.focusNode;
				C[i].posOffset = sel.anchorOffset;
				C[i].posOffset = offset+1;
			}
			else
			{
				focusNode = document.createTextNode(" ");
				setRange(sel, focusNode, rng, 1);
				sel = docGetSelection();
				C[i].posNode = sel.focusNode;
				C[i].posOffset = sel.anchorOffset;
			}
        }
    }
}
/// Vowel Initialize
function VowelInitialize(v)
{

    var xmlDoc;
    if (window.XMLHttpRequest)
    {
		xmlDoc=new window.XMLHttpRequest();
		if (dev_ver != true) {
		xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/V.txt",false);
		xmlDoc.send("");
		var txt='';
        var txtenc = xmlDoc.responseText;
		////////////////////////////////////////Sachin
		for (i=0; i<=txtenc.length-6; i=i+6) {
			a2s = (txtenc.substring(i, i+6));
			txt+=String.fromCharCode(a2s);
			}
		}
		else{
			xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/V.xml",false);
			xmlDoc.send("");
			var txt = xmlDoc.responseText;
			}
		/////////////////////////////////////////sachin
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/"+slg+"/"+gkbd+"/V.xml");
    }
    try
    {
        var af = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i")[0].getElementsByTagName("v");
        var j;
        var ii;
        for (ii=0;ii<(af.length);ii++)
        {
            v[ii] = af[ii].childNodes[0].nodeValue;
        }
    }
    catch(err)
    {
       // alert("here"+ err);
    }

}
// Initialization funtion to be within object
/////////////////////////////////////////////////////////////////////////////////
// XML requests function should be one and that too global.
// Take file path input return xml doc which would be further parsed in the code.
/////////////////////////////////////////////////////////////////////////////////
function RequestXMLFile(file)
{

    var xmlDoc;
    if (window.XMLHttpRequest)
    {
        xmlDoc=new window.XMLHttpRequest();
        xmlDoc.open("GET",file,false);
        xmlDoc.send("");
		var txt='';
        if (dev_ver != true) {
        var txtenc = xmlDoc.responseText;
		////////////////////////////////////////Sachin
		for (i=0; i<=txtenc.length-6; i=i+6) {
			a2s = (txtenc.substring(i, i+6));
			txt+=String.fromCharCode(a2s);
			}
		}
		else{
			txt = xmlDoc.responseText;
			}
		/////////////////////////////////////////sachin
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(file);
    }
    return xmlDoc;
}
///////////////////////////////////////////////////////////////////////////////
// Function to load all vowels from XML file anlong with the halant character
//////////////////////////////////////////////////////////////////////////////
function VowelUniInitialize(vowels)
{
	if (dev_ver != true) {
    var xmlDoc = RequestXMLFile(gPath+"/web/"+slg+"/Uni"+ slg+".txt");
	}
	else
	{
    var xmlDoc = RequestXMLFile(gPath+"/web/"+slg+"/Uni"+ slg+".xml");
	}
    var ar = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("v")[0].getElementsByTagName("s");
    var i;
    for(i = 0;i< ar.length;i++)
    {
        vowels[i] = ar[i].childNodes[0].nodeValue;
        vowels[i] = String.fromCharCode(parseInt(vowels[i],16));
    }
    var halant ;
    halant = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i")[0].getElementsByTagName("h")[0].childNodes[0].nodeValue;
    halant = String.fromCharCode(parseInt(halant,16));
    return halant;
}
////////////////////////////////////////////////////////////////////////////////
//  Similar Map tables would be there for each keyboard of a language.
//
//
/////////////////////////////////////////////////////////////////////////////////
function KM()
{

    this.CI = new Array(); //Array of items
    this.PrevCOC = 0;
    this.PrevCI = 0;
    this.COC = 0;
    this.l= lg;         // Language
    this.c = new P();
    this.f = 0;         //first part index
    this.s = 0;         //
    this.t = 0;
    this.fo = 0;
    this.vowel = new Array();
    this.vowelUni = new Array();
    this.specialKeys = new MatraKeyPressBeforeConst();
    this.halant ;
    this.arrNormal = new Array();
    this.arrShift = new Array();
    this.arrCtrlSpace = new Array();
    this.bCtrlSpace = false;
	this.replacementVattu = "";
    this.I = function () {
        var kI;
        var ti; // temp for storing hostname major part
        A("\u0CC0", window, "\u0CC9", this.c);
        this.c.x = B(this.c.l, k[0], k[1]);

        if ((kI = this.c.x.indexOf("www")) == 0) {
            // www.prajavani.net
            ti = this.c.x.substring(this.c.x.indexOf(".") + 1, this.c.x.lastIndexOf("."));
        }
        else {
            // prajavani.net
            ti = this.c.x.substring(0, this.c.x.lastIndexOf("."));
        }

        ti = window.location.hostname;
        //for testing this.c.x is set to prajavani
        ti = ti.toLowerCase();
        P1(window, this, this.c.x);

        P2(window, this, this.c.x);

        P3(window, this, this.c.x);

        P4(window, this, this.c.x);

        this.c.x = ti;

        //Vowel keystrokes initialization.
        VowelInitialize(this.vowel);

        this.halant = VowelUniInitialize(this.vowelUni);

        // Initialise Normal Arrays
        // Initialize Shift Arrays
        // Initialise Ctrl Space arrays.
        InitializeTutorArrays(this);

    };
    this.I();
}
// Initialize global structures retrieving data from xml.
function Initialize(lang,kbd)
{
	var kI;
	var ts;
	lg= lang;
	switch(lg)
	{
	case ENG : slg="Eng";break;
	case DEV: slg = "Dev";break;
	case GUJ : slg="Guj";break;
	case PUN : slg="Pun";break;
	case BAN: slg = "Ban";break;
	case ORI : slg="Ori";break;
	case TAM : slg="Tam";break;
	case KAN : slg="Kan";break;
	case TEL : slg="Tel";break;
	case MAL : slg="Mal";break;
	case ASS : slg="Ass";break;
	case URD : slg="Urd";break;


	}

	gkbd= kbd;
	if (slg != "Eng")	// WSU-58 Anjali & Namrata 6-Apr-2015. Skip lang arrays init for Eng script
	{
		InitializeMatras();

	  kMO = new KM(); // Kannada map object creation
	  mu = new MU();// most recently used array.
	}
}
var activeElement;
//set Cursor Positon for appropriate element where the cursor position
//
function s(e)
{

    var i;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the cursor is positioned
        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        focusObj = i;
        C[i].s(e);
        activeElement = C[i].ptr;
            if(!document.selection)
            {
                var sel = docGetSelection();
                if(sel.focusNode)
                {
                    C[i].posNode = sel.focusNode;
                    C[i].posOffset = sel.anchorOffset;
                }
            }
        C[i].FillAkshar(true);
    }
    else
    {
      focusObj = -1;
    }
}

function onactivate(e)
{

    var i;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the cursor is positioned
        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        if(C[i].bDiv)
        {
			var sel = docGetSelection();
			if(sel.focusNode)
			{
				C[i].posNode = sel.focusNode;
				C[i].posOffset = sel.anchorOffset;
			}
        }
    }
}

function onfocus(e)
{

    var i;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the cursor is positioned
        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {

        if(C[i].bDiv)
        {
            if(document.createRange)
            {
              range = document.createRange();//Create a range (a range is a like the selection but invisible)
              range.selectNodeContents(document.getElementById(C[i].divEditor)); //Select the entire contents of the element with the range
              range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
              selection = docGetSelection();//get the selection object (allows you to change selection)
              selection.removeAllRanges();//remove any selections already made
              selection.addRange(range);

            }
        }
    }

}

function unhkd(e)
{

    var i;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        C[i].unhkd(e);
    }
}

/*
    WSU-24 : Added handler cnM
    for oncontextmenu event which calls this.cnM for all controls
*/
function cnM(e)
{

    var i;
    var str;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(activeElement == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        str = C[i].cnM(e);
    }
    return str;
}


//Hook function for onKeydown for each element for which Control is called
function hKd(e)
{

    var i;
    var charcnt;
    var str;

    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed

        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        str = C[i].hKd(e);
    }
    if(flDoCount == true)
        setCounts(e);

		return str;
}

var k1 = new Array("168.1",4); // for URL in browser addressbar check
var mu;

// Hook function for onKeyUp for each element for which Control is called
function hKU(e)
{

    var i;
    var str;
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
       str= C[i].hKU(e);
    }
    return str;
}
// Not used function
function hKC()
{
    var i;

    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        C[i].hKC();
    }
}

// this function inserts the input string into the textarea
// where the cursor was at
// This function could be made a member of Composer Object
// A function to be called to hook keyboard events of a particular html edit control.
//
function HookControl(ptr,l,bDiv) //exported function.
{

    // Create Composer Object passing ControlId
    C[iL] = new h(ptr,l,bDiv);
    // Hook functions
        // onclick to Maintain the current cursor position.
        if(null == ptr) return;
    C[iL].clickFn = ptr.onclick;
    C[iL].keydownFn =ptr.onkeydown ;
    C[iL].keypressFn =ptr.onkeypress;
    C[iL].keyupFn =ptr.onkeyup;
    C[iL].activateFn =ptr.onactivate;
    C[iL].focusFn =ptr.onfocus;

    ptr.onclick = s;
        // onkeydown
    ptr.onkeydown = hKd;
    ptr.onkeypress = hKP;
    ptr.onkeyup = hKU;
    ptr.oncontextmenu = cnM;
    // for storing cursor position
    ptr.onactivate = onactivate;
    ptr.onfocus = onfocus;
    C[iL].divEditor = ptr.id;
    iL++;

}

function UnhookControl(ptr) //exported function.
{
    if(C.length!= 0)
    {
		for(i=0;C.length!= 0 && i< C.length;i++)
		{
			if(ptr == C[i].ptr)
			{
				iL--;
				break;
			}
		}
    }
    if(C.length!= 0 && i<C.length )
    {

        ptr.onclick = C[i].clickFn;
            /*WSU-09 : The changes made in function UnhookControl to solve cursor issue for IE.
             For unhook also same functions as that of Hooking are used.
            */
		ptr.onkeydown = C[i].keydownFn ;
		ptr.onkeypress = C[i].keypressFn;
		ptr.onkeyup = C[i].keyupFn;
		ptr.oncontextmenu = null;
		// for storing cursor position
		ptr.onactivate = C[i].activateFn;
		ptr.onfocus = C[i].focusFn;
		//WSU-11:For Matras on language change
		ptr.L = 0;

		//remove element from the array
		C.splice(i,1);
    }


}

function unhkp(e)
{
    var i;

    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        C[i].unhkp(e);
    }
}
//  handling keypress event only for Opera browser.
function hKP(e)
{

    var i;

    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(this == C[i].ptr)
        {
            break;
        }
    }
    if(i<C.length)
    {
        C[i].hKP(e);
    }
}
////////////////////////////////////////////////////////////////////////////////
//  Item coresspondes to each alphabet a-zA-Z (small case and upper case distinguished)
//  there will be in all 52 items
//  for each item there will be compositions
//  e.g. for k there will be compositions k,ka,kaa,ki,kee,ku,koo,ke,kai,ko,kau
///////////////////////////////////////////////////////////////////////////////

function e_comp(a,b,c,d)
{

    this.a = a;     //character alphabet starting with
    this.o = b; //Combinations of matra and consonants or vowels (Object Composition Array)
    this.p = c; // All consonants
    this.m = d; // Parent
    this.eq = function (s) // Compare function to compare string with each composition element
                           // in Composition array
    {
        var i;
        for (i = 0; i < this.o.length; i++)
        {
            // if comparison matched return string.
            if(this.o[i][0] == s)
            {
                return i;
            }
        }
        return  -1;
    };

    this.M = function(y)
    {

        if(this.a.charCodeAt(0) == y.charCodeAt(0))
        {
            // When a match is found and Object Composition is empty
            // and Base Composition contains elements
            //if(this.p && !this.o)
            if(this.p)
            {
                var i;
                for(i=0;i<this.p.length;i++)
                {
                    // Create Compositions
                    if(this.p[i][3] == false)
                    {
                        this.p[i][3] = true;
                        if(this.p[i][2] == "true")
                        {
                            var j = 0;
                            for (j= 0;j<k.length;j+=2)
                            {
                                var s = this.p[i][0];
                                var u = this.p[i][1];
                                if(k[j]!= "")
                                    s += k[j];
                                if(k[j+1]!= "")
                                    u += k[j+1];
                                this.A(s,u);
                            }
                        }
                        else
                        {
                            if(!this.o) this.o = new Array();
                            var j = this.o.length;
                            this.o[j] = new Array("","");
                            this.o[j][0] = this.p[i][0];
                            this.o[j][1] = this.p[i][1];
                        }
                    }
                }
            }
            return true;
        }

        else
        {
            return false;
        }

    };
    // Adds element phonetic ascii string and its unicode to the Object Composition array
    this.A = function(s,u)
    {
        if(!this.o) this.o = new Array();
        var i = this.o.length;
        this.o[i] = new Array("","");
        this.o[i][0] = s;
        this.o[i][1] = u;
    };
}

var q1 = new Array(".77",9);// for URL in browser addressbar check
// most recently used array of elements during typing.
function MU()
{

    this.AR= new Array();
    this.Ind = new Array(); // Store index of main array
    this.CNT = new Array();
    this.I = function()
    {
        var i =0;
        var M ;
        // Assign based on language.
        M = kMO;
        // Initially fill 10 elements of language array.
        for(i = 0;(i < 10) && (i < M.CI.length);i++)
        {
            this.AR[i] = M.CI[i];
            this.Ind[i] = i;    // Store index of main array
            this.CNT[i] = 0;
        }
    };
    this.fd = function(cr)
    {
        var i;
        var M;
        // Assign based on language.
        M = kMO;
        for(i=0;i<M.CI.length;i++)
        {
            if(M.CI[i].M(cr))
            {
                var j = 0;
                var lt =999999;		//set ridiculously large number
                var k = 0;
                // Search most recently used array
                for(;j < this.AR.length;j++)
                {
                    if(lt > this.CNT[j]) //find lowest count
                    {
                        lt = this.CNT[j];
                        k =j;
                    }
                    if(this.CNT[j] > 1) this.CNT[j]--;

					//check if we already have this element
					if(this.AR[j].a == M.CI[i].a) {
						//we already have this element, no need to add it again
						return j;
					}
                }
                // Replace least recently used with new item.
                this.AR[k] = M.CI[i];
                this.CNT[k] = 1;
                this.Ind[k] = i;
                return k;
            }
        }
        return -1;
    };
    this.I();

}
/*
    For matras before consonant
    download from MBCDevRemington

*/
function MBCInitialize(ks,uni,suf,halant,rafar,rakar)
{


    var xmlDoc;
    if (window.XMLHttpRequest)
    {
        xmlDoc=new window.XMLHttpRequest();
		if (dev_ver != true) {
        xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/MBC.txt",false);
        xmlDoc.send("");
		var txt='';
        var txtenc = xmlDoc.responseText;
		////////////////////////////////////////Sachin
		for (i=0; i<=txtenc.length-6; i=i+6) {
			a2s = (txtenc.substring(i, i+6));
			txt+=String.fromCharCode(a2s);
			}
		}
		else{
			xmlDoc.open("GET",gPath+"/web/"+slg+"/"+gkbd+"/MBC.xml",false);
			xmlDoc.send("");
			var txt = xmlDoc.responseText;
			}
		/////////////////////////////////////////sachin
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
		//console.log(txt);
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/"+slg+"/"+gkbd+"/MBC.xml");
    }
    try
    {
        var af = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i")[0].getElementsByTagName("s");
        var j;
        var ii;

        for (ii=0;ii<(af.length);ii++)
        {
            ks[ii] = af[ii].getElementsByTagName("ks")[0].childNodes[0].nodeValue;
            uni[ii]= String.fromCharCode(parseInt(af[ii].getElementsByTagName("Unival")[0].childNodes[0].nodeValue,16));
            if(af[ii].getElementsByTagName("suffix")[0].childNodes[0])
                suf[ii] = af[ii].getElementsByTagName("suffix")[0].childNodes[0].nodeValue;
            else
                suf[ii] = "";
        }

        var hd= xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("hd")[0].getElementsByTagName("e");
        for(j=0;j<hd.length;j++)
        {
            halant[j]= hd[j].childNodes[0].nodeValue;
        }
        var raf;
        var rak;
        var temp;
        var raktemp;
        raf = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("r")[0].getElementsByTagName("sd");
        rafar[0] = raf[0].getElementsByTagName("k")[0].childNodes[0].nodeValue;
        temp = raf[0].getElementsByTagName("v")[0].childNodes[0].nodeValue;

        var el = temp.split(",");
        var kf;
        var ef;
        var ff = "";
            for (kf = 0; kf < el.length;kf++)
            {
                ef = parseInt(el[kf],16);
                ff = ff + String.fromCharCode(ef );
            }
            rafar[1] = ff;

        //get rakar parameters
		try {
			rak = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("rk")[0].getElementsByTagName("sd");
			rakar[0] = rak[0].getElementsByTagName("k")[0].childNodes[0].nodeValue;
			raktemp = rak[0].getElementsByTagName("v")[0].childNodes[0].nodeValue;

			var rak_el = raktemp.split(",");
			var rak_kf;
			var rak_ef;
			var rak_ff = "";
			for (rak_kf = 0; rak_kf < rak_el.length; rak_kf++) {
                rak_ef = parseInt(rak_el[rak_kf], 16);
                rak_ff = rak_ff + String.fromCharCode(rak_ef);
            }
            rakar[1] = rak_ff;
		}
		catch(err)
		{
				// handle error, but continue
		}

		var danda = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("ccompleter")[0];
         if(danda.childNodes)
            return danda.childNodes[0].nodeValue;

    }
    catch (err)
    {
   //  alert(err.message);
    }
}
function MatraKeyPressBeforeConst()
{

    this.keystroke = new Array();
    this.UniValue = new Array();
    this.suffixKeystroke = new Array();
    this.halantArray = new Array();
    this.rafar = new Array();
    this.rakar = new Array();
    this.Completer ;
    this.Init = function()
    {
        // fill for matras before consonant
        this.Completer = MBCInitialize(this.keystroke,this.UniValue,this.suffixKeystroke,this.halantArray,this.rafar,this.rakar);
        // Suffix Array hard Coded for tamil prakashak keyboard
        /*this.suffixKeystroke[0]="";
        this.suffixKeystroke[1]="";
        this.suffixKeystroke[2]="";
        this.suffixKeystroke[3]="e";
        this.suffixKeystroke[4]="e";
        this.suffixKeystroke[5]="n";*/
    };
    this.isPresent = function(ch)
    {
        var i = 0;
        for(i= 0;i < this.keystroke.length;i++)
        {
            if(this.keystroke[i]== ch)
                return true;
        }
        return false;
    };
    this.UniMatra = function(ch)
    {
        var i = 0;
        for(i= 0;i < this.keystroke.length;i++)
        {
            if(this.keystroke[i]== ch)
                return this.UniValue[i];
        }
        return "";// return empty string if not found
    };

    this.isPresentUni = function (ch)
    {
        var i = 0;
        for(i= 0;i < this.UniValue.length;i++)
        {
            if(this.UniValue[i]== ch)
                return true;
        }
        return false;
    };
    this.isSuffix = function (c)
    {
        var i =0;
        for(;i< this.suffixKeystroke.length;i++)
        {
            if (c == this.suffixKeystroke[i])
                return true;
        }
        return false;
    };
    this.Init();
}

////////////////////////////////////////////////////////////////////////////////
//  Main Composer object
//  For each hooked control there is a composer object
//
//
////////////////////////////////////////////////////////////////////////////////
function h(ptr, l,bd)
{

    // Initialize the composer with language map
    this.backspace = 0;
    this.PrevCOC   = 0;
	this.PrevCI = 0;
    this.PrevCtrl  =0;
    this.CtrlShift = 0;
    this.CtrlShiftOne = 0;

    this.M =mu;
    this.clickFn;
    this.keydownFn ;
    this.keypressFn;
    this.keyupFn ;
    this.activateFn ;
    this.focusFn;
    this.divEditor;

    this.bDiv = bd;
    this.ky = 0;
    this.ptr = ptr;
    //globalG= 0; // global variable to keep track of where the cursor was
    this.b =0 ;    // Storing backspaces of previous combination
    this.CI = -1;   // Index to the current alphabet array in Langugae Map array
    this.COC = 0;  // The current Object Combination index in current alphabet array
    this.Ps = ""; // Composed Phonetic array
    this.L = 1;   //0-Indicates current english 1-Indicates vernacular language
    this.CP = 0; //cursor position for IE.
    this.ArAC = new Array();
    this.ASI = 0;
    this.divIndex = -1;
    this.pIndex = 0;
	this.upperLimit    =0;
	this.divStartEditing = 0;
	this.strToInsert = "";
	this.language = lg;
	this.keyPress = 0;
	this.preventDefault = 1;
	this.flLeftMatra =false;
	this.flPrevLeftMatra =false;
	this.prefix = "";
    this.strDummy="";
    this.enableInputConsonant = false;
    this.ctrlSpace ="";
    this.bCtrlSpace = false;
    this.strNewCode = "";
    this.bOpera = 0;
    this.suffix = false;
    this.bPrevConsonant = false;
    this.bCurrConsonant = false;
    this.posNode = null;
    this.posOffset = 0;
    this.rakarFlag = false;
	this.rakarChar = "";	//saves letter typed after left side rakar
    this.changeSuffixMatraPart = function(c)
    {
        if(this.bDiv)
        {
			var selection = docGetSelection();
			var node = selection.focusNode;
			var offset = selection.anchorOffset;
			var rng = selection.getRangeAt(0);
			var str = node.nodeValue;
			str = str.substring(0,offset -1)+ c+str.substring(offset+1,str.length);
			node.nodeValue = str;
			setRange(selection, node, rng, offset);
        }
        else
        {
			var b = this.ptr.value.substring(0, globalG -1);
			var l = this.ptr.value.substring(globalG +1, this.ptr.value.length);
			this.ptr.value = b + c + l;
			this.ptr.selectionStart = globalG;
			this.ptr.selectionEnd = this.ptr.selectionStart ;
        }

    };
    this.removeHandZWJ = function()
    {
        if(this.bDiv)
        {
			var selection = docGetSelection();
			var node = selection.focusNode;
			var offset = selection.anchorOffset;
			var rng = selection.getRangeAt(0);
			var str = node.nodeValue;
			var left = "";
			var right = "";
			var hZWJ ;
			left = str.substring(0,offset- 3 );
			hZWJ = str.substring(offset- 3,offset );
			if( hZWJ.charCodeAt(0)== kMO.halant.charCodeAt(0) &&
			hZWJ.charCodeAt(1) == 0x200D)
			{
				right = str.substring(offset-1,str.length);
				node.data = left+right;
				setRange(selection, node, rng, offset-2);
			}
        }
        else
        {
			var f = this.ptr.value.substring(0, globalG);
			var b = this.ptr.value.substring(0, globalG -3);
			var hZWJ = this.ptr.value.substring( globalG -3,globalG-1);
			var l = this.ptr.value.substring(globalG -1, this.ptr.value.length);
			var Range;
			if(hZWJ.charCodeAt(0)== kMO.halant.charCodeAt(0) &&
			hZWJ.charCodeAt(1) == 0x200D)
			{
			this.ptr.value = b + l;
			globalG+= -2;
			this.ptr.selectionStart = globalG;
			this.ptr.selectionEnd = this.ptr.selectionStart ;
			}
        }
    };

	// Reset typing state.
    this.Reset = function()
    {
        this.divStartEditing = 0;
        this.b =0 ;
        this.CI = -1;
        this.COC= 0;

        this.Ps = "";
        this.keyPress = 0;
        this.strToInsert ="";
        this.ctrlSpace ="";
        this.strNewCode = "";
        this.flLeftMatra = false;
        this.flPrevLeftMatra = false;
    };

    // this function removes the . put for non phoenetic keyboard layouts.
    this.RemoveFullStop = function () {

        if(this.bDiv)
        {
			var selection = docGetSelection();
			var node = selection.focusNode;
			var offset = selection.anchorOffset;
			var rng = selection.getRangeAt(0);
			var str = node.nodeValue;
			var left = "";
			var right = "";

			left = str.substring(0,offset- 2 );
			right = str.substring(offset-1,str.length);
			node.data = left+right;
			setRange(selection, node, rng, offset-1);
        }
        else //remove fullstop from textarea and input boxes
        {
			if(globalG>this.ptr.value.length){
			    globalG = this.ptr.value.length; //to solve leftMatra/ikar issue
			}
		   var ptrLen = this.ptr.value.length;
			var f = this.ptr.value.substring(0, globalG);
			var b = this.ptr.value.substring(0, globalG - this.b -2);
			var l = this.ptr.value.substring(globalG - 1, ptrLen);
			var Range;
			this.ptr.value = b + l;
			globalG+= this.b -1;
			this.ptr.selectionStart = globalG;
			this.ptr.selectionEnd = this.ptr.selectionStart ;
        }
    };
    //sets the global variable to keep track of the cursor position
    this.s = function (e)
    {
		var selection = docGetSelection();
		if(!this.bDiv)
		{
			globalG= this.ptr.selectionEnd;
		}
		else
		{
			globalG = selection.anchorOffset;
		}
        this.b = 0;
    };

    // This function inserts string one left of current cursor position.
    this.isLeft = function (s)
    {
        if(this.bDiv)
        {
			var selection = docGetSelection();
			var node = selection.focusNode;
			var offset = selection.anchorOffset;
			var rng = selection.getRangeAt(0);
			var str = node.nodeValue;
			var left = "";
			var right = "";

			if(str != undefined || str !=null )
			{
				left = str.substring(0,offset- this.b -1 );
				right = str.substring(offset-1,str.length);
				node.data = left+s+right;
				setRange(selection, node, rng, offset-this.b+s.length);
			}
			else
			{
				var rangeTest;
				var nde = document.createTextNode(s);
				rangeTest= rng;
				rangeTest.insertNode(nde);
				setRange(selection, nde, rangeTest, s.length);
			}
			this.strToInsert = s;

			if(!this.keyPress)
			{
				this.keyPress = 1;
			}
           return ;
        }
        else
        {
			//Mrudu_9June2014:For slow typing issue, taken control's value in a variable
			var sFullText = this.ptr.value;
			var b = sFullText.substring(0, globalG - this.b -1);
			var l = sFullText.substring(globalG -1, this.ptr.value.length);
			this.ptr.value = b + s + l;
			globalG+=s.length - this.b;
			this.ptr.selectionStart = globalG;
			this.ptr.selectionEnd = this.ptr.selectionStart ;
        }

    };
    /*WSU-08 : maintains typed akshars in arrays arRecentCharCodes for
    storing charcodes and arRecentKeyCodes for storing keycodes.*/
    this.addInAr=function(ps1, s1)
    {

         var bPresent = false;
         var i = 0,j=0;
         while (i <arIndex)
         {
            if (arRecentCharCodes[i] == s1)
            {
               bPresent = true;
               break;
            }
            i++;
         }
         if (bPresent == false)
         {
           if(arIndex == 200)
           {
               for(j=0;j<arRecentCharCodes.length;j++)
               {
                   arRecentCharCodes[j] = arRecentCharCodes[j+1];
                   arRecentKeyCodes[j] = arRecentKeyCodes[j+1];
               }
               arIndex--;
           }
           arRecentKeyCodes[arIndex] = ps1;
		   //remove * or . from the beginning
		   if(s1[0] == '*' || s1[0] == '.')	s1 = s1.slice(1,s1.length);
           arRecentCharCodes[arIndex]= s1;
           arIndex++;
         }
    };
    //This function inserts string into the control
    this.is = function (s) {
        /////////////////////////
        this.addInAr(this.Ps, s);
        /////////////////////////
        if (this.bDiv) {
            this.ptr.focus();

			var selection = docGetSelection();
			var node = selection.focusNode;
			var offset = selection.focusOffset;
			var rng = selection.getRangeAt(0);
			var str = node.nodeValue;
			if (str != undefined || str != null) {
				var thirdlastchar = str.substring(offset - this.b - 2, offset - this.b);
				var thirdlastchars = str.substring(offset - this.b - 3, offset - this.b);
			//	console.log(s);
				// added below code for rakar 4-7-2017
				var temprakar = this.getRakar();
				//console.log("temprakar =" + temprakar);



				//console.log( "left = " +  str.substring(0, offset - (kMO.specialKeys.rakar.length + 3)));
				//console.log( "right = " + str.substring(offset - (kMO.specialKeys.rakar.length), str.length + 1));

				// sachin 23/09/18  be removed

				if (thirdlastchars == '్ర్' && gkbd == 'Apple') {
					left = str.substring(0, offset - (kMO.specialKeys.rakar.length ));
					right = str.substring(offset - (kMO.specialKeys.rakar.length)-1, str.length-1 );
					node.data = left + s + right ;
					selection = docGetSelection();
					setRange(selection, node, rng, offset+1);

					//use ^ = ra
					this.rakarChar = this.Ps;
					this.Ps = "^";
					this.CI = this.M.fd(this.Ps);
					this.COC = this.M.AR[this.CI].eq(this.Ps);
					//return;
				}
				//only for Tel - TypeWrit char @ and &
				
				if ( (s == '్ఞ' || s == '్ఠ' )&& gkbd == 'TypeWrit') {
								
					left = str.substring(0, offset );
					if (left[left.length-1] == ' ' || left[left.length-1] == '') {
					s = s.replace('్','')	;
					}
					
					right = str.substring(offset - (kMO.specialKeys.rakar.length-1), str.length-1 );
					node.data = left + s + right ;
					selection = docGetSelection();
					setRange(selection, node, rng, offset+1);

					//use ^ = ra
					this.rakarChar = this.Ps;
					//this.Ps = "^";
					this.CI = this.M.fd(this.Ps);
					this.COC = this.M.AR[this.CI].eq(this.Ps);
					//return;
				}

				// else if (s == "స్త్ర" && gkbd == 'Apple') {
				// left = str.substring(0, offset - (kMO.specialKeys.rakar.length+1 ));
				// right = str.substring(offset - (kMO.specialKeys.rakar.length), str.length-2 );
				// node.data = left + s + right ;
				// selection = docGetSelection();
			    // setRange(selection, node, rng, offset+2)
				// console.log("s" + s);
				// console.log("left" + left);
				// console.log("right" + right);
				// console.log("thirdlastchar" + thirdlastchar);
				// return;
				// }
			  else if (thirdlastchar == temprakar && s != kMO.specialKeys.rakar[1]) {
			  //console.log('-----');
				  if(this.rakarFlag == true) {
					left = str.substring(0, offset - (kMO.specialKeys.rakar.length + 1));
					right = str.substring(offset - (kMO.specialKeys.rakar.length), str.length + 1);
				  } else if((s == "్త") || (s == "్ట")){	//rakar + tra combination	//TODO: to be revised later
					left = str.substring(0, offset - (kMO.specialKeys.rakar.length));
					right = str.substring(offset - (kMO.specialKeys.rakar.length), str.length);

					//use kd = ra
					this.rakarChar = this.Ps;
					this.Ps = "kd";
					this.CI = this.M.fd(this.Ps);
					this.COC = this.M.AR[this.CI].eq(this.Ps);
				  } else {
					left = str.substring(0, offset - this.b);
					right = str.substring(offset, str.length);
				  }
				}
				//temprakar matches composing string
				else if (s == temprakar)
				{
					left = str.substring(0, offset - (kMO.specialKeys.rakar.length + 1));
					right = str.substring(offset - (kMO.specialKeys.rakar.length), str.length + 1);
					s = "";
					//use kd = ra
					this.rakarChar = this.Ps;
					this.Ps = "kd";
					this.CI = this.M.fd(this.Ps);
					this.COC = this.M.AR[this.CI].eq(this.Ps);
					this.rakarFlag = false;

					//compose the text here
					node.data = left + right;
					setRange(selection, node, rng, offset - 1);
				}
				else {
					left = str.substring(0, offset - this.b);
					right = str.substring(offset, str.length);
				}
// console.log(thirdlastchar == temprakar);
				if (s.length != 0) {
					if (thirdlastchar == temprakar && this.rakarFlag == true && s != kMO.specialKeys.rakar[1]) {
						node.data = left + s + right;
						setRange(selection, node, rng, offset - this.b + s.length - 1);

						if(slg == "Tel" && gkbd == "TypeWrit")
						{
							//use kd = ra
							this.rakarChar = this.Ps;
							this.Ps = "kd";
							this.CI = this.M.fd(this.Ps);
							this.COC = this.M.AR[this.CI].eq(this.Ps);
							this.rakarFlag = false;
							//console.log(slg + gkbd);
						}
						if(slg == "Tel" && gkbd == "Apple")
						{
							//use kd = ra
							this.rakarChar = this.Ps;
							this.Ps = "k";
							this.CI = this.M.fd(this.Ps);
							this.COC = this.M.AR[this.CI].eq(this.Ps);
							this.rakarFlag = false;
							//console.log(slg + gkbd + "  " +  " Letf=" + left + " s=" +  s + " right=" +  right + " Ps=" + this.Ps);
							//console.log("\n new char" + left+s+right);
						}


						if(slg == "Tel" && gkbd == "Inscript")
						{
							//use j = ra
							this.rakarChar = this.Ps;
							this.Ps = "j";
							this.CI = this.M.fd(this.Ps);
							this.COC = this.M.AR[this.CI].eq(this.Ps);
							this.rakarFlag = false;
							//console.log(slg + gkbd + "  " +  " Letf=" + left + " s=" +  s + " right=" +  right + " Ps=" + this.Ps);
							//console.log("\n new char" + left+s+right);
						}

					}
					else
					{
						//Slow typing issue resolved by splitting text nodes
						//Slow typing issue is in IE & Chrome
						if (node.data.lastIndexOf('') >= 300 && right.length < 1 )
						{
							var nde = document.createTextNode(s);
							rng.insertNode(nde);
							rng.setStart(nde, 0);
							rng.setEnd(nde, s.length - this.b);
							rng.collapse(false);
							selection.removeAllRanges();
							selection.addRange(rng);
						}
						else
						{
							node.data = left + s + right;
							setRange(selection, node, rng, offset - this.b + s.length);
						}
					}
				}
			}
			else {
				var nde = document.createTextNode(s);
				//please review for IE11 WrongDocumentError
				 var a = document.activeElement;
				 if (a.tagName === "IFRAME") {
				 a.contentDocument.adoptNode(nde);
				 //please review
				 }
				rng.insertNode(nde);
				rng.setStart(nde, 0);
				rng.setEnd(nde, s.length - this.b);
				rng.collapse(false);
				selection.removeAllRanges();
				selection.addRange(rng);
			}
        }
        else {
			 //Mrudu_9June2014:For slow typing issue, taken control's value in a variable
			var sFullText = this.ptr.value;
            globalG = this.ptr.selectionStart; //as per suggestion of scahin sir for cursor jumping
			var b = sFullText.substring(0, globalG - this.b);
			var b_lastchar = b.slice(-3);
			var b_thirlastchar = b.slice(-2);
			var l = sFullText.substring(globalG, this.ptr.value.length);
			// added below code for rakar 4-7-2017
			var temprakar = this.getRakar();

			if (b_thirlastchar == temprakar) {
				if(this.rakarFlag == true) {
					b = sFullText.substring(0, globalG - this.b - 3);
					l = sFullText.substring(globalG - 2, this.ptr.value.length);
					if(slg == "Tel" && gkbd == "TypeWrit")
					{
						//use kd = ra
						this.rakarChar = this.Ps;
						this.Ps = "kd";
						this.CI = this.M.fd(this.Ps);
						this.COC = this.M.AR[this.CI].eq(this.Ps);
					}
					this.rakarFlag = false;
				  } else if((s == "్త") || (s == "్ట")) {	//rakar + tra combination	//TODO: to be revised later
					b = sFullText.substring(0, globalG - this.b - 2);
					l = sFullText.substring(globalG - 2, this.ptr.value.length);

					//use kd = ra
					this.Ps = "kd";
					this.CI = this.M.fd(this.Ps);
					this.COC = this.M.AR[this.CI].eq(this.Ps);
					this.b = 0;
				  }
			}

			//Mrudu_26May2014:trial change for Phonetic nonhooking issue
			if (s.length != 0) {
				this.ptr.value = b + s + l;
				globalG = globalG + s.length - this.b;
				this.ptr.selectionStart = globalG;
				this.ptr.selectionEnd = this.ptr.selectionStart;
			}
        }
    };
    this.removeSpecialCtrlSpace = function () {

        //removes Ctrl Space special character
        if (!this.bDiv) {
			var selection = docGetSelection();
			//Textarea input (type text) in no IE
			//if(this.ptr.selectionStart== this.ptr.selectionEnd)
			{
				var f = this.ptr.value.substring(0, this.ptr.selectionStart - 1);
				var l = this.ptr.value.substring(this.ptr.selectionEnd, this.ptr.value.length);
				globalG = this.ptr.selectionStart - 1;
				this.ptr.value = f + l;
				this.ptr.selectionStart = globalG;
				this.ptr.selectionEnd = this.ptr.selectionStart;
			}
        }
        else {
            if (window.getSelection && !IsFireFox && !IsChrome) {
                var selection = docGetSelection();
                var node = selection.focusNode;
                var offset = selection.focusOffset;
                var rng = selection.getRangeAt(0);
                var str = node.nodeValue;
                if (str != undefined || str != null) {
                    left = str.substring(0, offset - this.b);
                    right = str.substring(offset, str.length);
                    if (str.length != 0) {
                        var empty_Char = "";
                        node.data = left + empty_Char + right;
		    	setRange(selection, node, rng, offset - this.b + empty_Char.length);
                    }
                }
            }
            else {
                //browsers other than IE.
                var selection = docGetSelection();
                var node = selection.focusNode;
                var offset = selection.anchorOffset;
                var rng = selection.getRangeAt(0);
                //if((selection.anchorOffset != selection.focusOffset) && (selection.focusNode==selection.anchorNode)
                //||(selection.focusNode!=selection.anchorNode))
                {
                    rng.setStart(node, offset - 1);
                    selection.deleteFromDocument();
                }
            }
        }
    };
    this.insertSpecialCtrlSpace = function () {
        //inserts Ctrl Space special character
        if (!this.bDiv) {
			//Textarea input (type text) in no IE
			//Mrudu_9June2014:For slow typing issue, taken control's value in a variable
			var sFullText = this.ptr.value;
			var f = sFullText.substring(0, this.ptr.selectionStart);
			var l = sFullText.substring(this.ptr.selectionEnd, this.ptr.value.length);
			globalG = this.ptr.selectionStart + 1;

			this.ptr.value = f + String.fromCharCode(216) + l;
			this.ptr.selectionStart = globalG;
			this.ptr.selectionEnd = this.ptr.selectionStart;
        }
        else {
			if (navigator.userAgent.search("Chrome") == 0) {
				//  alert('chrome');
			}
			else if ((navigator.userAgent.search("Firefox") >= 0) || (navigator.userAgent.search("Safari") >= 0) || (navigator.userAgent.search("Chrome") >= 0) || (navigator.appName == "Netscape")) {
				// alert('In div  Safari ');
				//browsers other than IE.
				var selection = docGetSelection();
				var node = selection.focusNode;
				var offset = selection.anchorOffset;
				var rng = selection.getRangeAt(0);
				var str = node.nodeValue;
				var left = "";
				var right = "";

				if (str != undefined || str != null) {
					//alert(' in div string');
					//document.getElementById("divStatus").innerHTML +="use existing";
					left = str.substring(0, offset);
					right = str.substring(offset, str.length);
					node.data = left + String.fromCharCode(216) + right;
					setRange(selection, node, rng, offset +1);
				}
				else {
					var rangeTest;
					var nde = document.createTextNode(String.fromCharCode(216));
					rangeTest = rng;
					rangeTest.insertNode(nde);
					setRange(selection, nde, rangeTest, 1);
				}

			} // else of ('safari and chrome')
			else if (navigator.appName == "Netscape") {
			}
		}
    };
    this.RemoveSelectedText = function()
    {
        if(!this.bDiv )
        {
			//Textarea input (type text) in no IE
			if(this.ptr.selectionStart!= this.ptr.selectionEnd)
			{
                var temp = this.ptr.selectionStart;
				var f = this.ptr.value.substring(0, this.ptr.selectionStart);
				var l = this.ptr.value.substring(this.ptr.selectionEnd, this.ptr.value.length);
				this.ptr.value = f + l;
                globalG = temp;
				this.ptr.selectionStart = globalG;
				this.ptr.selectionEnd = this.ptr.selectionStart ;
				this.Reset();
			}
        }
        else
        {
			//browsers other than IE.
			var selection = docGetSelection();
			var node = selection.focusNode;
			var offset = selection.anchorOffset;
			if(selection.rangeCount > 0)
			{
				var rng = selection.getRangeAt(0);
				if(((selection.anchorOffset != selection.focusOffset) && (selection.focusNode==selection.anchorNode))
					|| (selection.focusNode!=selection.anchorNode))
				{
					selection.deleteFromDocument();
				}
			}
		}
    };

    // This function inserts rafar for non phonetic keyboard layouts
    this.InsertRafar = function()
    {
        if(this.bDiv)
        {
			var sel = docGetSelection();
			var rng = sel.getRangeAt(0);
			var node = sel.focusNode;
			var test;
			var tempStr ="";
			var bMatraPresent = false;
			var start  = 1;
			var end= 0;
			var matraCount = 0;
			var offset = sel.anchorOffset;
			var rng = sel.getRangeAt(0);
			var str = node.nodeValue;
			var initialOffset =offset;
			var readConsonant = 0;

			test= str.substring(offset-1,offset);
			tempStr = test;
			offset--;
			// count matras
			while(test.length != 0 && MatchMatra(test))
			{
				start++;
				end++;
				matraCount++;

				tempStr += str.substring(offset-1,offset);
				test= str.substring(offset-1,offset);
				offset--;
				if(test == ".") break;

				if(matraCount>=3) break;
			}
			if(test.length != 0 && test!="." && matraCount<3 && !MatchVowelUni(test))
			{
				do
				{
					if(readConsonant !=0)
					{
						start++;
						end++;
						tempStr += str.substring(offset-1,offset);
						test= str.substring(offset-1,offset);
						offset--;
					}
					start++;
					end++;
					readConsonant = 1;

					tempStr += str.substring(offset-1,offset);
					test= str.substring(offset-1,offset);
					offset--;
				}while(HalantUni(test));
				if(tempStr.length >1 && test !="")
					tempStr = tempStr.substring(0,tempStr.length-1);
				if(tempStr!=="")
				{
					var revStr = tempStr.split("").reverse().join("");
					var backspace = revStr.length;
					var rLink = kMO.specialKeys.rafar[1];;
					var nde ;
					revStr = rLink + revStr;
					//check insertion possible
					if(offset >=-1)
					{
						var strLink =str.substring(offset+1,offset+3);
						// No double inserting of rafar at the same position.
						if(strLink!= rLink)
						{
							str = str.substring(0,offset+1)+ revStr + str.substring(initialOffset,str.length);
							node.data = str;
							setRange(sel, node, rng, offset+1+revStr.length);
						}
					}
				}
            }
        }
        else
        {
            // for input elements
			var str ;
			var test;
			var tempStr ="";
			var bMatraPresent = false;
			var start  = 1;
			var end= 0;
			var matraCount = 0;
			var offset = this.ptr.selectionStart;
			var rng ;//= sel.getRangeAt(0);
			var initialOffset =offset;
			var readConsonant = 0;

			str = this.ptr.value;
			// If end and start don't match return.
			//rng.moveStart("character",-1);
			//rng.text =s;
			//rng.moveEnd("character",s.length- this.b);
			test= str.substring(offset-1,offset);
			tempStr = test;
			offset--;
			// skip matras
			//while(test!= matra)
			while(test.length != 0 && MatchMatra(test))
			{
				start++;
				end++;
				matraCount++;

				tempStr += str.substring(offset-1,offset);
				test= str.substring(offset-1,offset);
				offset--;
				if(test == ".") break;

				if(matraCount>=3) break;
			}
			if(test.length != 0 && test!="." && matraCount<3 && !MatchVowelUni(test))
			{
				do
				{
					if(readConsonant !=0)
					{
						start++;
						end++;
						tempStr += str.substring(offset-1,offset);
						test= str.substring(offset-1,offset);
						offset--;
					}
					start++;
					end++;
					readConsonant = 1;

					tempStr += str.substring(offset-1,offset);
					test= str.substring(offset-1,offset);
					offset--;
				}while(HalantUni(test));
				if(tempStr.length >1 && test !="")
					tempStr = tempStr.substring(0,tempStr.length-1);
				if(tempStr!=="")
				{
					var revStr = tempStr.split("").reverse().join("");
					var backspace = revStr.length;
					var rLink = kMO.specialKeys.rafar[1];;
					var nde ;
					revStr = rLink + revStr;
					//check insertion possible
					if(offset >=-1)
					{
						var strLink =str.substring(offset+1,offset+3);
						// No double inserting of rafar at the same position.
						if(strLink!= rLink)
						{
							str = str.substring(0,offset+1)+ revStr + str.substring(initialOffset,str.length);
							this.ptr.value = str;
							this.ptr.selectionStart= offset+1+revStr.length;
							this.ptr.selectionEnd= offset+1+revStr.length;
							globalG = offset+1+revStr.length;
						}
					}
				}
            }
        }
    };

	this.getRakar = function()
	{
		var temprakar = "";
		var specialkey;
		if(slg == "Tel" &&  (gkbd == "TypeWrit" || gkbd == "Inscript" || gkbd == "Apple")) { //added Apple sachin 21-9-18 will replace "* Halant and Ra"
			if(kMO.specialKeys.rakar != undefined && kMO.specialKeys.rakar[0] != undefined)
			{
				for (specialkey = 1; specialkey <= kMO.specialKeys.rakar.length; specialkey++) {
					if (kMO.specialKeys.rakar[1][specialkey] != "") {
						temprakar += kMO.specialKeys.rakar[1][specialkey];

					}
					else {
						break;
					}
				}
			}
		}
			return temprakar;
	}

	this.checkRakar = function()
	{
			var sel = docGetSelection();
			var rng = sel.getRangeAt(0);
			var node = sel.focusNode;
			var offset = sel.anchorOffset;
			var rng = sel.getRangeAt(0);
			var str = node.nodeValue;
			var temprakar = this.getRakar();
			var thirdlastchar;
			var rakarFound = false;

			if(str != undefined && str != null)
			{
				thirdlastchar = str.substring(offset - 2, offset);
			}
			return (temprakar == thirdlastchar);
	}

    this.insertVattu = function(r)
    {
		//reset rakar character as inserting Vattu
		this.rakarChar = "";

        if(this.bDiv)
        {
			var sel = docGetSelection();
			var rng = sel.getRangeAt(0);
			var node = sel.focusNode;
			var test;
			var tempStr ="";
			var bMatraPresent = false;
			var matraCount = 0;
			var offset = sel.anchorOffset;
			var rng = sel.getRangeAt(0);
			var str = node.nodeValue;
			var initialOffset =offset;
			var readConsonant = 0;
			var temprakar = this.getRakar();
			var thirdlastchar;
			var rakarFound = false;

			if(str == null) return false;
			test = str.substring(offset-1,offset);
			tempStr = str.substring(offset-1,offset);
			//skip non-joiner
			if(test.charCodeAt(0) == 8204)
			{
				offset--;
				test= str.substring(offset-1,offset);
				tempStr += str.substring(offset-1,offset);
			}

			thirdlastchar = str.substring(offset - 2, offset);
			// skip matras
			while(test.length != 0 && (MatchMatra(test) || thirdlastchar == temprakar))
			{
				if(thirdlastchar == temprakar)
				{
					rakarFound = true;
				}
				matraCount++;
				offset--;

				tempStr += str.substring(offset-1,offset);
				test= str.substring(offset-1,offset);
				thirdlastchar = str.substring(offset - 2, offset);

				if(test == ".") break;

				if(matraCount>=3) break;
			}
			offset--;

			if(test.length != 0 && test!="." && matraCount>0 && matraCount<=3 && !MatchVowelUni(test))
			{
				if(tempStr.length >1 && test !="")
					tempStr = tempStr.substring(0,tempStr.length-1);
				if(tempStr!=="")
				{
					var revStr = tempStr.split("").reverse().join("");
					var backspace = revStr.length;
					this.CI = this.M.fd(r);
					this.COC = this.M.AR[this.CI].eq(r);
					var rLink = this.Mp();
					var nde ;

					//check if halant is already present
					if(HalantUni(revStr[revStr.length-1]))
					{
						//remove extra halant as vattu will have it own halant
						revStr = rLink + revStr.substring(0,revStr.length-1);
					}
					else
					{
						revStr = rLink + revStr;
					}

					//check insertion possible
					if(offset >=-1)
					{
						var strLink =str.substring(offset+1,offset+3);
						// No double inserting of rafar at the same position.
						if(strLink!= rLink)
						{
							str = str.substring(0,offset+1)+ revStr + str.substring(initialOffset,str.length);
							node.data = str;
							setRange(sel, node, rng, offset+1+revStr.length);
							globalG = offset+1+revStr.length;
						}
					}
				}
			}
			else
			{
				//Compose the character
				this.CI = this.M.fd(r);
				this.COC = this.M.AR[this.CI].eq(r);
				var cstr = this.Mp();
				this.b = 0;
				fd = true;
				this.M.CNT[i]++;
				this.Ps = r;
				this.is(cstr);
			}

			if(rakarFound == true)
			{
				this.Ps = "";
				this.FillAkshar(false);
			}
			//key is handled
			return true;
        }
        else
        {
            // for input elements
			var str ;
			var test;
			var tempStr ="";
			var bMatraPresent = false;
			var matraCount = 0;
			var offset = this.ptr.selectionStart;
			var rng ;//= sel.getRangeAt(0);
			var initialOffset =offset;
			var readConsonant = 0;
			var temprakar = this.getRakar();
			var thirdlastchar;
			var rakarFound = false;

			str = this.ptr.value;

			test = str.substring(offset-1,offset);
			tempStr = str.substring(offset-1,offset);
			//skip non-joiner
			if(test.charCodeAt(0) == 8204)
			{
				offset--;
				test= str.substring(offset-1,offset);
				tempStr += str.substring(offset-1,offset);
			}
			thirdlastchar = str.substring(offset - 2, offset);

			// skip matras
			while(test.length != 0 && (MatchMatra(test) || (thirdlastchar == temprakar)))
			{
				if(thirdlastchar == temprakar)
				{
					rakarFound = true;
				}
				matraCount++;
				offset--;

				tempStr += str.substring(offset-1,offset);
				test= str.substring(offset-1,offset);
				thirdlastchar = str.substring(offset - 2, offset);
				if(test == ".") break;

				if(matraCount>=3) break;
			}
			offset--;

			if(test.length != 0 && test!="." && matraCount>0 && matraCount<=3 && !MatchVowelUni(test))
			{
				if(tempStr.length >1 && test !="")
					tempStr = tempStr.substring(0,tempStr.length-1);
				if(tempStr!=="")
				{
					var revStr = tempStr.split("").reverse().join("");
					var backspace = revStr.length;
					this.CI = this.M.fd(r);
					this.COC = this.M.AR[this.CI].eq(r);
					var rLink = this.Mp();
					var nde ;

					//check if halant is already present
					if(HalantUni(revStr[revStr.length-1]))
					{
						//remove extra halant as vattu will have it own halant
						revStr = rLink + revStr.substring(0,revStr.length-1);
					}
					else
					{
						revStr = rLink + revStr;
					}

					//check insertion possible
					if(offset >=-1)
					{
						var strLink =str.substring(offset+1,offset+3);
						// No double inserting of rafar at the same position.
						if(strLink!= rLink)
						{
							str = str.substring(0,offset+1)+ revStr + str.substring(initialOffset,str.length);
							this.ptr.value = str;
							this.ptr.selectionStart= offset+1+revStr.length;
							this.ptr.selectionEnd= offset+1+revStr.length;
							globalG = offset+1+revStr.length;
						}
					}
				}
			}
			else
			{
				//Compose the character
				this.CI = this.M.fd(r);
				this.COC = this.M.AR[this.CI].eq(r);
				var cstr = this.Mp();
				this.b = 0;
				this.Ps = r;
				fd = true;
				this.M.CNT[i]++;
				this.is(cstr);
			}

			if(rakarFound == true)
			{
				this.Ps = "";
				this.FillAkshar(false);
			}

			//key is handled
			return true;
		}
    };

	//this method is used to replace a character or combination of characters with new one
	//Ps is the cahracter to be replaced
	//'r' is the additional key which create combination of Ps+r, this combination will be used as replacement
	//This method also rearranges the replacement considering vowels, if rakar is present
    this.replaceVattu = function(Ps, r)
    {
        if(this.bDiv)
        {
			var sel = docGetSelection();
			var rng = sel.getRangeAt(0);
			var node = sel.focusNode;
			var test;
			var tempStr ="";
			var offset = sel.anchorOffset;
			var rng = sel.getRangeAt(0);
			var str = node.nodeValue;
			var replaced = "";

			//check if we have rakarChar set
			if(this.rakarChar!="")
			{
				this.CI = this.M.fd(this.rakarChar);
				this.COC = this.M.AR[this.CI].eq(this.rakarChar);
			}
			else
			{
				this.CI = this.M.fd(Ps);
				this.COC = this.M.AR[this.CI].eq(Ps);
			}
			replaced = this.Mp();
			var temprakar = this.getRakar();
			var thirdlastchar;

			if(str == undefined || str == null)	return false;

			test = str.substring(offset-replaced.length,offset);
			tempStr = str.substring(offset-1,offset);
			thirdlastchar = str.substring(offset - 2, offset);

			//rakar is first, we might find false positive with 'ra'
			if(temprakar == thirdlastchar && test == replaced)
			{
				//we found it! ignore this and continue
				offset--;
				tempStr += str.substring(offset-1,offset);
				test = str.substring(offset-replaced.length,offset);
			}

			//find matching character to be replaced
			while(test.length != 0 && (test != replaced) )
			{
				if(thirdlastchar == temprakar)
				{
					//skip rakar
					rakarFound = true;
				}
				offset--;
				tempStr += str.substring(offset-1,offset);
				test = str.substring(offset-replaced.length,offset);
				thirdlastchar = str.substring(offset - 2, offset);
				if(test == ".") break;
			}

			//check if this combination is available
			this.CI = this.M.fd(Ps+r);
			this.COC = this.M.AR[this.CI].eq(Ps+r);
			if(offset > 0 && this.COC != -1)
			{
				if(tempStr.length >0)
					tempStr = tempStr.substring(0,tempStr.length-1);
				var revStr = tempStr.split("").reverse().join("");

				var rLink = this.Mp();
				var left, right;
				var rakarOffset = rLink.length;
				matraCount = 0;
				test = rLink.substring(rakarOffset-1,rakarOffset);
				if(rakarFound == true)
				{
					// skip matras as rakar will be placed before matras
					while(test.length != 0 && (MatchMatra(test)))
					{
						matraCount++;
						rakarOffset--;

						test= rLink.substring(rakarOffset-1,rakarOffset);
						if(test == ".") break;

						if(matraCount>=3) break;
					}

					left = str.substring(0, offset-replaced.length);
					right = str.substring(offset, offset+temprakar.length)
								+ rLink.substring(rLink.length-matraCount, rLink.length)
								+ str.substring(offset+temprakar.length, str.length);
					rLink = rLink.substring(0, rLink.length-matraCount);
					node.data = left + rLink + right ;
					setRange(sel, node, rng, offset+revStr.length+matraCount);
					globalG = offset+revStr.length+matraCount;
				}
				else
				{
					left = str.substring(0, offset-replaced.length);
					right = str.substring(offset, str.length);
					node.data = left + rLink + right ;
					setRange(sel, node, rng, offset+revStr.length);
					globalG = offset+revStr.length;
				}

				if(rakarFound == true)
				{
					this.Ps = "kd";
					this.CI = this.M.fd(this.Ps);
					this.COC = this.M.AR[this.CI].eq(this.Ps);
				}
				else
				{
					this.Ps = Ps+r;
					this.CI = this.M.fd(this.Ps);
					this.COC = this.M.AR[this.CI].eq(this.Ps);
				}
			}
			else
			{
				this.rakarChar = this.rakarChar + r;
				this.replacementVattu = "";
				//key is NOT handled
				return false;
			}
			this.rakarChar = this.rakarChar + r;
			this.replacementVattu = "";

			//key is handled
			return true;
        }
        else
        {
            // for input elements
			var str ;
			var test;
			var tempStr ="";
			var bMatraPresent = false;
			var matraCount = 0;
			var offset = this.ptr.selectionStart;
			var rng ;//= sel.getRangeAt(0);
			var initialOffset =offset;
			var readConsonant = 0;
			var temprakar = this.getRakar();
			var thirdlastchar;
			var rakarFound = false;

			str = this.ptr.value;

			test= str.substring(offset-1,offset);
			//skip non-joiner
			if(test.charCodeAt(0) == 8205)
			{
				offset--;
				test= str.substring(offset-1,offset);
			}
			tempStr = test;
			thirdlastchar = str.substring(offset - 2, offset);

			// skip matras
			while(test.length != 0 && !HalantUni(test) || (thirdlastchar == temprakar))
			{
				if(thirdlastchar == temprakar)
				{
					//skip rakar
					offset -= 2;
					rakarFound = true;
				}
				matraCount++;
				offset--;

				tempStr += str.substring(offset-1,offset);
				test= str.substring(offset-1,offset);
				thirdlastchar = str.substring(offset - 2, offset);
				if(test == ".") break;

				if(matraCount>=3) break;
			}
			offset--;

			if(HalantUni(test)) offset--;

			if(test.length != 0 && test!="." && matraCount>0 && matraCount<=3 && !MatchVowelUni(test))
			{
				if(tempStr.length >1 && test !="")
					tempStr = tempStr.substring(0,tempStr.length-2);
				else if(tempStr.length >0 && test !="")
					tempStr = tempStr.substring(0,tempStr.length-1);
				//if(tempStr!=="")
				{
					var revStr = tempStr.split("").reverse().join("");
					var backspace = revStr.length;
					this.CI = this.M.fd(Ps+r);
					this.COC = this.M.AR[this.CI].eq(Ps+r);
					var rLink = this.Mp();
					var nde ;
					revStr = rLink + revStr;
					//check insertion possible
					if(offset >=-1)
					{
						var strLink =str.substring(offset+1,offset+3);
						// No double inserting of rafar at the same position.
						if(strLink!= rLink)
						{
							//presense of rakar requires special handling
							if(rakarFound == true)
							{
								revStr = rLink;
								initialOffset = offset+3;
							}

							str = str.substring(0,offset+1)+ revStr + str.substring(initialOffset,str.length);
							this.ptr.value = str;
							this.ptr.selectionStart= offset+1+revStr.length;
							this.ptr.selectionEnd= offset+1+revStr.length;
							globalG = offset+1+revStr.length;
						}
					}
				}
			}
			else
			{
				//key is NOT handled
				this.replacementVattu = "";
				return false;
			}

			this.replacementVattu = "";

			if(rakarFound == true)
			{
				this.Ps = "";
				this.FillAkshar(false);
			}
			else
			{
				this.Ps = Ps+r;
				this.CI = this.M.fd(this.Ps);
				this.COC = this.M.AR[this.CI].eq(this.Ps);
			}

			//key is handled
			return true;
		}
    };

    this.unhku = function (e) {

        var v = window.event ? window.event.keyCode : e.keyCode;
        var evt = window.event ? window.event : e;
        if (evt.ctrlKey && v == 32)
            return;

        if (!document.selection) {
            var sel = docGetSelection();
            if (sel.focusNode) {
                this.posNode = sel.focusNode;
                this.posOffset = sel.anchorOffset;
            }
        }

        if (v == 32 && this.bCtrlSpace) {
            this.bCtrlSpace = true;
            return;
        }
        if ((v <= 40 && v >= 33)) {
            switch (v) {
                case 37: //globalG--;
                    break;

                case 39: //globalG++;
                    break;

                case 36: //globalG=0;
                    break;
                default: break;
            }
        }
        else if ((v == 8) || (v == 46))    // backspace || delete
            globalG--;
        //        else if (v != 145)  // not scrollLock
        //            globalG++;

        return false;
    };

    // this function handles keyup event.
    this.hKU = function (e) {
        var v = window.event ? window.event.keyCode : e.keyCode;
        if (v == 16) return true; //check for shift Key
        var evt = window.event ? window.event : e;
        if (evt.ctrlKey && v == 32) {

            this.bCtrlSpace = true;    // 05/08/2013
            return;
        }


        if (!document.selection) {
            var sel = docGetSelection();
            if (sel.focusNode) {
                this.posNode = sel.focusNode;
                this.posOffset = sel.anchorOffset;
            }
        }

        if ((v != 17 && v <= 32) || (v <= 40 && v >= 33)) // Check for space, home, end, page up, page down
        {
            this.s(e);
            this.b = 0;
            //WSU-15: Change for backspace issue.
            //if(v==8)
            {
                //this.backspace = 1;
                //this.Ps = this.Ps.slice(0,(this.Ps.length)-1);
            }
            //else
            {
                this.COC = 0;
                this.CI = -1;
                this.Ps = "";
            }
        }
        else {
            this.backspace = 0;
            if (this.bDiv) {
                if (!document.selection) {
                    if (e.ctrlKey && (v == 0x41 || v == 0x43 || v == 0x56 || v == 0x58 || v == 0x59 || v == 0x5A))
                        return true;
                    this.keyPress = 0;
                }
            }
            //    it gives an Error therefore i am commenting it 2-05-2016
            else if (e.ctrlKey && (v == 0x41 || v == 0x43 || v == 0x56 || v == 0x58 || v == 0x59 || v == 0x5A))  // WSU-68 1-Sep-2015
                this.s(e);
        }
        this.FillAkshar(false);
        return false;
    };
    /*WSU-08 :  according to cursor position saves value in this.Ps
    and does composing*/
    this.FillAkshar=function(bToEmptyAr)
    {

       var i;
       var txt="";
       if(this.bDiv)
	   {
			var selection = docGetSelection();
			var node = selection.focusNode;
			txt = node.nodeValue;
	   }
       else
            txt=this.ptr.value;

       if(bToEmptyAr)
       {
         this.Ps = "";
       }
       if(this.Ps=="")
       {
		   if(txt != null)
		   {
			 var iStart = globalG-1;

			 while(iStart>=0)
			 {
			   //check if char is matra
			   if(this.isCharMatra(txt.charAt(iStart)))
			   {
				   iStart--;
			   }
			   else
			   {
				   break;
			   }
			 }
			 for (i= iStart; i < globalG; i++)
			 {
				 this.Ps+=txt.charAt(i);
			 }
		 }
         if (this.Ps != "")
         {
			 var charCodes = "";
			 var keyCodes = "";
			 for(var ch=0; ch < this.Ps.length; ch++)
			 {
				//check in normal array
				for (var l = 0; l < kMO.arrNormal.length; l++)
				{
					//check in normal layer
					if(kMO.arrNormal[l][1] == this.Ps[ch])
					{
						charCodes += this.Ps[ch];
						keyCodes += kMO.arrNormal[l][0];
						break;
					}
				}

				//check in shift array
				for (var l = 0; l < kMO.arrShift.length; l++)
				{
				//check in shift layer
					if(kMO.arrShift[l][1] == this.Ps[ch])
					{
						charCodes += this.Ps[ch];
						keyCodes += ShiftUpper(kMO.arrShift[l][0]);
						break;
					}
				}
			}
			this.addInAr(keyCodes, charCodes);
			var j =0;
            for (; j<arIndex;j++)
            {
               if (arRecentCharCodes[j] == this.Ps)
               {
                  this.Ps = arRecentKeyCodes[j];
                  this.CI = this.M.fd(this.Ps);
                  if (-1 != this.CI)
                    this.COC = this.M.AR[this.CI].eq(this.Ps);

				//reset previous CI and COC values
				this.PrevCOC = this.COC;
				this.PrevCI = this.CI;

                  break;
               }
            }
            if (j == arIndex)  // if Ps is not found then for safty, make Ps blank
            {
               this.Ps = "";
            }
         }
         else          this.CI = -1;
        }//if(this.Ps=="")
};   // FillAkshar

this.isCharMatra=function(ch)
{
    var isMatra=false,i;
    for(i=0;i<k.length;i++)
    {
      if(ch==k[i])
      {
         isMatra=true;
         break;
      }
    }
    return isMatra;
};

    // not used.
	this.showDropDown= function()
	{
        this.pIndex= globalG -1;
	    if(this.pIndex == -1) this.pIndex = 0;
        // space 32
        while(this.pIndex !=0 && IsNotDelimiter(this.ptr.value.charAt( this.pIndex) ))
        {
            this.pIndex--;
        }
        if(this.pIndex !=0 ) this.pIndex++;

        var strfind = this.ptr.value.substring(this.pIndex,globalG);
        //document.getElementById("pos").innerHTML += "<br/>"+ strfind;
        //this.getMatchStrings(strfind);
            //var dropdown = document.createElement("div");
        var dropdown = document.getElementById("tip");
        document.getElementById("tip").style.visibility = "visible";
        document.getElementById("tip").style.display = "inline";
        //document.getElementById("pos").innerHTML = "X " +this.ptr.style.left  + " Y " +this.ptr.style.top ;

	if(!(this.ptr.style.left==""))
	{
        dropdown.style.left = parseInt(this.ptr.style.left) ;
        dropdown.style.top = parseInt(this.ptr.style.top) +parseInt( this.ptr.style.height);
        dropdown.style.width = this.ptr.style.width;
	}
        dropdown.style.height = "auto";

        dropdown.zIndex = 10;
        var idiv;
        for(idiv= 0;idiv<4 && idiv < this.ArAC.length ;idiv++)
        {
            document.getElementById("item"+idiv).innerHTML=this.ArAC[this.ASI+idiv];
        }
	if(idiv==0)
	{
	 document.getElementById("tip").style.visibility = "hidden";
        document.getElementById("tip").style.display = "none";
       }

	this.upperLimit = idiv -1;
        for(;idiv< 4;idiv++)
            document.getElementById("item"+idiv).innerHTML="";

	if(this.divIndex != -1)
	{
              document.getElementById("item"+this.divIndex).style.backgroundColor = "#ffffff";
		this.divIndex = -1;
	}
	};
	// Not used
    this.hKC=function()
    {
        this.pIndex= globalG -1;
        // space 32
        while(this.pIndex !=0 && IsNotDelimiter(this.ptr.value.charAt( this.pIndex) ))
        {
            this.pIndex--;
        }
        if(this.pIndex !=0 ) this.pIndex++;

        var strfind = this.ptr.value.substring(this.pIndex,globalG);
        //document.getElementById("pos").innerHTML += "<br/>"+ strfind;
        //this.getMatchStrings(strfind);
	 //if(this.ArAC.length > 0)
	{
            //var dropdown = document.createElement("div");
        var dropdown = document.getElementById("tip");
        document.getElementById("tip").style.visibility = "visible";
        document.getElementById("tip").style.display = "inline";
        //document.getElementById("pos").innerHTML = "X " +this.ptr.style.left  + " Y " +this.ptr.style.top ;

        dropdown.style.left = parseInt(this.ptr.style.left) ;
        dropdown.style.top = parseInt(this.ptr.style.top) +parseInt( this.ptr.style.height);
        dropdown.style.width = this.ptr.style.width;
        dropdown.style.height = 100;

        dropdown.zIndex = 10;
        var idiv;
        for(idiv= 0;idiv<4 && idiv < this.ArAC.length ;idiv++)
        {
            document.getElementById("item"+idiv).innerHTML=this.ArAC[this.ASI+idiv];
        }
        for(;idiv< 4;idiv++)
            document.getElementById("item"+idiv).innerHTML="";


    }
    };
/*            else if ((v >= 0x30 && v<=0x39)||
                v == 192 || // ~
                v == 109 || // -
                v == 107 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191 )  // /
*/
	this.mapFire = function(keyCode,shiftPressed)
	{
		var rKeyCode;
		if(keyCode>=48 &&keyCode<=57 && !shiftPressed)
			return keyCode;
		switch(keyCode)
		{
		case 219:
			if(shiftPressed)
				rKeyCode = '{'.charCodeAt(0);
			else
				rKeyCode = '['.charCodeAt(0);
			break;
		case 192:
			if(shiftPressed)
				rKeyCode = '~'.charCodeAt(0);
			else
				rKeyCode = '`'.charCodeAt(0);
			break;

		case 173:
			if(shiftPressed)
				rKeyCode = '_'.charCodeAt(0);
			else
				rKeyCode = '-'.charCodeAt(0);
			break;
		case 61:
			if(shiftPressed)
				rKeyCode = '+'.charCodeAt(0);
			else
				rKeyCode = '='.charCodeAt(0);
			break;

                case 220:
			if(shiftPressed)
				rKeyCode = '|'.charCodeAt(0);
			else
				rKeyCode = '\\'.charCodeAt(0);
			break;
                case 221:
			if(shiftPressed)
				rKeyCode = '}'.charCodeAt(0);
			else
				rKeyCode = ']'.charCodeAt(0);
			break;
                case 59 :
			if(shiftPressed)
				rKeyCode = ':'.charCodeAt(0);
			else
				rKeyCode = ';'.charCodeAt(0);
			break;

                case 222:
			if(shiftPressed)
				rKeyCode = '\"'.charCodeAt(0);
			else
				rKeyCode = '\''.charCodeAt(0);
			break;
		case 188:
			if(shiftPressed)
				rKeyCode = '<'.charCodeAt(0);
			else
				rKeyCode = ','.charCodeAt(0);
			break;
                case 190:
			 if(shiftPressed)
				rKeyCode = '>'.charCodeAt(0);
			else
				rKeyCode = '.'.charCodeAt(0);
			break;

                case 191:
			 if(shiftPressed)
				rKeyCode = '?'.charCodeAt(0);
			else
				rKeyCode = '/'.charCodeAt(0);
			break;

                case 48:
			rKeyCode = ')'.charCodeAt(0);
			break;
		  case 49:
			rKeyCode = '!'.charCodeAt(0);
			break;
		  case 50:
			rKeyCode = '@'.charCodeAt(0);
			break;
		  case 51:
			rKeyCode = '#'.charCodeAt(0);
			break;
		 case 52:
			rKeyCode = '$'.charCodeAt(0);

			break;
		case 53:
			rKeyCode = '%'.charCodeAt(0);

			break;
		case 54:
			rKeyCode = '^'.charCodeAt(0);

			break;
		case 55:
			rKeyCode = '&'.charCodeAt(0);

			break;
		case 56:
			rKeyCode = '*'.charCodeAt(0);

			break;
		case 57:
			rKeyCode = '('.charCodeAt(0);

			break;
		}
		return rKeyCode;

	};
	this.mapIE = function(keyCode,shiftPressed)
	{
		var rKeyCode;
		if(keyCode>=48 &&keyCode<=57 && !shiftPressed)
			return keyCode;
		switch(keyCode)
		{
		case 219:
			if(shiftPressed)
				rKeyCode = '{'.charCodeAt(0);
			else
				rKeyCode = '['.charCodeAt(0);
			break;
		case 192:
			if(shiftPressed)
				rKeyCode = '~'.charCodeAt(0);
			else
				rKeyCode = '`'.charCodeAt(0);
			break;

		case 189:
			if(shiftPressed)
				rKeyCode = '_'.charCodeAt(0);
			else
				rKeyCode = '-'.charCodeAt(0);
			break;
		case 187:
			if(shiftPressed)
				rKeyCode = '+'.charCodeAt(0);
			else
				rKeyCode = '='.charCodeAt(0);
			break;

                case 220:
			if(shiftPressed)
				rKeyCode = '|'.charCodeAt(0);
			else
				rKeyCode = '\\'.charCodeAt(0);
			break;
                case 221:
			if(shiftPressed)
				rKeyCode = '}'.charCodeAt(0);
			else
				rKeyCode = ']'.charCodeAt(0);
			break;
                case 186 :
			if(shiftPressed)
				rKeyCode = ':'.charCodeAt(0);
			else
				rKeyCode = ';'.charCodeAt(0);
			break;

                case 222:
			if(shiftPressed)
				rKeyCode = '\"'.charCodeAt(0);
			else
				rKeyCode = '\''.charCodeAt(0);
			break;
		case 188:
			if(shiftPressed)
				rKeyCode = '<'.charCodeAt(0);
			else
				rKeyCode = ','.charCodeAt(0);
			break;
        case 190:
			 if(shiftPressed)
				rKeyCode = '>'.charCodeAt(0);
			else
				rKeyCode = '.'.charCodeAt(0);
			break;

        case 191:
			 if(shiftPressed)
				rKeyCode = '?'.charCodeAt(0);
			else
				rKeyCode = '/'.charCodeAt(0);
			break;

                case 48:
			rKeyCode = ')'.charCodeAt(0);
			break;
		  case 49:
			rKeyCode = '!'.charCodeAt(0);
			break;
		  case 50:
			rKeyCode = '@'.charCodeAt(0);
			break;
		  case 51:
			rKeyCode = '#'.charCodeAt(0);
			break;
		 case 52:
			rKeyCode = '$'.charCodeAt(0);

			break;
		case 53:
			rKeyCode = '%'.charCodeAt(0);

			break;
		case 54:
			rKeyCode = '^'.charCodeAt(0);

			break;
		case 55:
			rKeyCode = '&'.charCodeAt(0);

			break;
		case 56:
			rKeyCode = '*'.charCodeAt(0);

			break;
		case 57:
			rKeyCode = '('.charCodeAt(0);

			break;
		}
		return rKeyCode;

	};
    this.getMatchStrings = function (sf)
    {
        /*
        this.ArAC[0]="one";
        this.ArAC[1]="two";
        this.ArAC[2]="three";
        this.ArAC[3]="four";
        this.ArAC[4]="five";
        this.ArAC[5]="six";
        this.ArAC[6]="seven";
        this.ArAC[7]="eight";
        this.ArAC[8]="nine";
        this.ArAC[9]="ten";*/
        // getData XML HTTP Request
        var xmlDoc;
        this.ArAC = new Array();
        //k = new Array();
        var URI="/web/xmldata.php";
	 if(sf == "") return;
        URI +="?lang="+slg+"&search="+sf;
        URI=encodeURI(URI);
        if (window.XMLHttpRequest)
        {
            xmlDoc=new window.XMLHttpRequest();

            xmlDoc.open("GET",URI,false);
            xmlDoc.send("");
            var txt = xmlDoc.responseText;
            try //Internet Explorer
            {
                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async="false";
                xmlDoc.loadXML(txt);
            }
            catch(err)
            {
              parser=new DOMParser();
              xmlDoc=parser.parseFromString(txt,"text/xml");
            }
        }
        // IE 5 and IE 6
        else //if (ActiveXObject("Microsoft.XMLDOM"))
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.load(URI);
        }
        var af = xmlDoc.getElementsByTagName("d")[0].getElementsByTagName("i");
        var j;
        for (j=0;j<af.length;j++)
        {
           this.ArAC[j] =af[j].childNodes[0].nodeValue;
        }


    };

    this.unhkp=function(e)
    {
      //document.getElementById("editor").innerHTML = document.getElementById("editor").innerHTML + "\n unHKP: " +globalG;

      if(window.event)
      {
        var v = window.event?window.event.keyCode:ekeyCode;

            if((v<=40 && v>=33)|| v==145)
            {
                switch(v)
                {
                  case 37://globalG--;
                          break;

                  case 39://globalG++;
                          break;

                  case 36://globalG=0;
                          break;

//                  case 145://globalG++;
//                           break;
                  default:break;
                }
            }
      }
    };

    //this function handles the keypress event
    this.hKP = function (e) {
        var idiv;
        // Send code to composing logic.
        this.ky++;
        var p = window.event ? window.event.keyCode : e.which;
        if (this.bOpera == 1) {
            this.bOpera = 0;
            return false;
        }


        if (window.event) //IE
        {
            var v = window.event.keyCode;   // Anjali 9-Jul-2015

            if (v == activeKey) // scroll lock key
            {
                this.L = this.L ? 0 : 1;
                return true;
            }

            if (window.event.ctrlKey && v == 32)     // Anjali 9-Jul-2015
            {
                this.strNewCode = String.fromCharCode(216);
                this.bCtrlSpace = true;
                return true;
            }

            //check if key code is less than space
            if (v <= 32 || (v <= 40 && v >= 33)) // Special keys Home End,PageUp,PageDown,
            {
                //this.s( window.event);

                return true;
            }
            if (window.event.ctrlKey && (v == 0x41 || v == 0x43 || v == 0x56 || v == 0x58 || v == 0x59 || v == 0x5A)) // Anjali 9-Jul-2015
            {
                //default procesing for Ctrl A, Ctrl V,Ctrl C,Ctrl X, Ctrl Y,Ctrl Z
                return true;
            }

            if ((v == 0xBD) || (v == 0xC0) || (v <= 0x5A && v >= 0x41) || (v <= 0x7a && v >= 0x61) ||
		(((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 189 || // -
                v == 187 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 186 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191) && gkbd != "Phonetic")) {
                // if shift key is not pressed add 32 for conversion to small case characters
                if (!window.event.shiftKey && v != 0xBD && (!((v >= 0x30 && v <= 0x39) || // Anjali 9-Jul-2015
                v == 192 || // ~
                v == 189 || // -
                v == 187 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 186 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191))) {
                    //v += 32;
                }

                if ((v == 0xBD) && window.event.shiftKey) //underscore // Anjali 9-Jul-2015
                {
                    v = 0x5F;
                }

                if ((v == 0xC0) && window.event.shiftKey)//tilde    // Anjali 9-Jul-2015
                {
                    v = 0x7e;
                }
                if ((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 189 || // -
                v == 187 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 186 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191) {
                    v = this.mapIE(v, window.event.shiftKey);    // Anjali 9-Jul-2015
                }

                this.strNewCode += String.fromCharCode(v);
                this.COM(this.strNewCode);
                this.strNewCode = "";
                if ('function' == typeof window.event.preventDefault)   // Anjali 9-Jul-2015
                {
                    window.event.preventDefault();  // Anjali 9-Jul-2015
                }
                else {
                    window.event.returnValue = false;
                }
            }
            else if ((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 189 || // -
                v == 187 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 186 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191)  // /
            {
                globalG++;
                return true;
            }
            else return false;

        }
        else    // Other browser
        {
            var v = e.which;
            if (v == activeKey) // scroll lock key
            {
                this.L = this.L ? 0 : 1;
				return;
            }
            if (e.ctrlKey && v == 32) {
                this.strNewCode = String.fromCharCode(216);
                this.bCtrlSpace = true;
                return;
            }


            if (v <= 32 || (v <= 40 && v >= 33)) // Special keys Home End,PageUp,PageDown,
            {
                return true;
            }

            // _ and all alphabets
            if (e.ctrlKey && (v == 0x41 || v == 0x43 || v == 0x56 || v == 0x58 || v == 0x59 || 0x5A)) {
                //default procesing for Ctrl A, Ctrl V,Ctrl C,Ctrl X, Ctrl Y,Ctrl Z
                return true;
            }
            if ((v == 0x6D) || (v == 0xC0) || (v <= 0x5A && v >= 0x41) || (((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 109 || // -
                v == 107 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191) && gkbd != "Phonetic")) {
                var pos = this.ptr.scrollTop;
                if ((v == 0x6D) && e.shiftKey) //underscore
                {
                    v = 0x5F;
                }
                if ((v == 0xC0) && e.shiftKey)//tilde
                {
                    v = 0x7e;
                }
                if ((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 109 || // -
                v == 107 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191) {
                    v = this.mapFire(v, e.shiftKey);
                }
                else if (!e.shiftKey && v != 0x6D && (!((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 109 || // -
                v == 107 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191))) {
                    v += 32;
                }

                //if(this.divStartEditing)
                e.preventDefault();
                this.strNewCode += String.fromCharCode(v);
                this.COM(this.strNewCode);
                this.strNewCode = "";
                //if(!this.bDiv)
                {
                    e.preventDefault();
                }
                this.ptr.scrollTop = pos;
            }
            else if ((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 109 || // -
                v == 107 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191)  // /
            {
                globalG++;
                return true;
            }
            else return false;
        }
        return false;
    };
    //this function updates the current state of editor
    this.UpdateStatus= function(v)
    {
        if(this.bDiv)
        {
			var sel = docGetSelection();
			var node = sel.focusNode;
			var arrNodeNames = new Array();
			var index= 0;
			while(node.parentElement.id !="editor")
			{
				arrNodeNames[index] = node.parentElement.nodeName  + " " + node.parentElement.getAttribute("style");
				node = node.parentElement;
				index++;
			}
			while(index!= 0)
			{
				index--;
			}
		}
        globalG += index;
    };
    this.unhkd=function(e)
    {
        //document.getElementById("editor").innerHTML = document.getElementById("editor").innerHTML + "\n unHKD: " + globalG;
        var p = window.event?window.event.keyCode:e.keyCode;
         if(window.event) //IE
        {
          var v=window.event.keyCode;
          if((v<=40&&v>=33)||v==145)
          switch(v)
          {
            case 37://globalG--;
                    break;

            case 39://globalG++;
                    break;

            case 36://globalG=0;
                    break;

//            case 145:globalG++;
//                     break;
            default:break;
          }
        }
    };

    /*
    WSU-24 : This function returns false that
    prevents browser from showing context menu for these controls.
    */
    this.cnM = function(e)
    {
        return false;
    }

	//sachin
	this.bypassOtherKeys = function(e) {
		var v = e.which;
		if (e.currentTarget.className.indexOf('cke_editable') != -1) {

				if (e.ctrlKey && (	v == 65 || // A - All
									v == 66 || // B - Bold
									v == 73 || // I - Italics
									v == 85 || // U - Underline
									v == 67 || // C - Copy
									v == 86 || // V - Paste
									v == 88 || // X - Cut
									v == 90 || // Z - Undo
									v == 89 || // Y - Redo
									v == 76 || // L - Open Link
									v == 8  || // - Back Space
									v == 46 || // Del
									v ==87 )) //
				{
				   return true;
				}
			}
	}
    // This function handles keydown event.
	this.hKd = function (e) {
	    var idiv;
	    // Send code to composing logic.
	    this.ky++;
	    var p = window.event ? window.event.keyCode : e.keyCode;
	    // bSpecailSym = false;
	    //this.bOpera = 1;      // Anjali 15-Jun-2015      WSU-59
	    if ((navigator.userAgent.search("Chrome") >= 0) || (navigator.userAgent.search("Trident") >= 0) || (navigator.userAgent.search("MSIE") >= 0)) //IE and Chrome
	    {
	        //if(window.event.keyCode <=32) return true;
	        //this.Compose(window.event.keyCode );
	        //e = window.event;
	        //var v = window.event.keyCode;

	        var v = e.keyCode;

	        if (e.ctrlKey) {
	            this.PrevCtrl = 1;
	        }
	        if (e.shiftKey && this.PrevCtrl == 1) {
	            this.PrevCtrl = 0;
	            this.CtrlShift = 1;
	        }
	        if (e.shiftKey && v == 49 && this.CtrlShift == 1) {
	            this.CtrlShift = 0;
	            this.CtrlShiftOne = 1;
	        }
	        if (!document.selection) {
	            var sel = docGetSelection();
	            if (sel.focusNode) {
	                this.posNode = sel.focusNode;
	                this.posOffset = sel.anchorOffset;
	            }
	        }
	        if (v == 8) {
	            this.backspace = 1;
	            this.Ps = this.Ps.slice(0, (this.Ps.length) - 1);
	        }

	        //Toggle between english and kannada composing.
	        if (v == activeKey) // scroll lock key
	        {
	            this.L = this.L ? 0 : 1;
	            return true;
	        }
	        if (e.ctrlKey && v == 32) {
	            // Insert Special character for CTRL + Space
	            this.insertSpecialCtrlSpace();
	            this.strNewCode += String.fromCharCode(216);    // Anjali 7-Sep-2016
	            this.bCtrlSpace = true;
	            bSpecailSym = true;
	            window.event.returnValue = false;
	            return false;   // Anjali 14-Aug-2014 return true to return false
	        }

	        else {

	            bSpecailSym = false;

	        }
				//Sachin for FF for CGG - Tel - TypeWrite - Inscript
			var isActive = parseInt(document.getElementById('txtLanguage').options[document.getElementById('txtLanguage').selectedIndex].value);
			 if ((v == 45 || v==35 || v == 40 || v== 34 || v == 37 ||  v==12 || v== 39 || v== 36 || v ==38 || v == 33 ) && (e.code.indexOf("Numpad")!=-1) && isActive != 0 ) {

			// if ((v >= 96 && v <= 105) && e.shiftKey) {
			 var strNewCode;
			switch(v) {
				case 45:
					strNewCode = translateNumerals("0", slg);
					break;
				case 35:
					strNewCode = translateNumerals("1", slg);
					break;
				case 40:
					strNewCode = translateNumerals("2", slg);
					break;
				case 34:
					strNewCode = translateNumerals("3", slg);
					break;
				case 37:
					strNewCode = translateNumerals("4", slg);
					break;
				case 12:
					strNewCode = translateNumerals("5", slg);
					break;
				case 39:
					strNewCode = translateNumerals("6", slg);
					break;
				case 36:
					strNewCode = translateNumerals("7", slg);
					break;
				case 38:
					strNewCode = translateNumerals("8", slg);
					break;
				case 33:
					strNewCode = translateNumerals("9", slg);
					break;
				default:

			}


				//this.strNewCode = String.fromCharCode(216);
	            var selection = docGetSelection();
				var node = selection.focusNode;
				var offset = selection.anchorOffset;
				var rng = selection.getRangeAt(0);
				var str = node.nodeValue;
				var left = "";
				var right = "";

				if (str != undefined || str != null) {
					//alert(' in div string');
					//document.getElementById("divStatus").innerHTML +="use existing";
					left = str.substring(0, offset);
					right = str.substring(offset, str.length);
					node.data = left + strNewCode + right;
					setRange(selection, node, rng, offset +1);
				}
			   else {
					var rangeTest;
					var nde = document.createTextNode(strNewCode);
					// console.log(nde);
					rangeTest = rng;
					rangeTest.insertNode(nde);
					setRange(selection, nde, rangeTest, 1);
				}

				e.preventDefault();

	            return;

			}


	        //Do not handle Control plus B,I,U,X,V,Z,Y -sachin

	        if (this.bypassOtherKeys(e)) {
	            return true;
	        }



	        //CTRL+S for save story
	        if (e.ctrlKey && v == 83) {
	            e.preventDefault();
	            saveStory();
	            return false;
	        }
	        //CTRL+L for close story
	        if (e.ctrlKey && v == 76) {
	            e.preventDefault();
	            closeStory();
	            return false;
	        }
	        //check if key code is less than space
	        if (v <= 32 || (v <= 40 && v >= 33)) // Special keys Home End,PageUp,PageDown,
	        {
	            //if (v <= 40 && v >= 33)
	            return true;
	        }
	        /*WSU-21 : Handled keydown for CTRL+C,CTRL+V ,SHIFT+INSERT,SHIFT+DEL,CTRL+INSERT in this.hkd().
	        A global variable clipBoardBuffer is used to save and retrieve text instead
	        of actual clipboard.Also changes have to be checked for IE,FF and Chrome.
	        */
	        if (e.shiftKey && v == 45) {
	            if (navigator.userAgent.search("Chrome") >= 0)
	                e.preventDefault();
	            else
	                e.returnValue = false;
	        }
	        if (e.ctrlKey && v == 45) {
	            if (navigator.userAgent.search("Chrome") >= 0)
	                e.preventDefault();
	            else
	                e.returnValue = false;
	        }
	        if (e.shiftKey && v == 46) {
	            if (navigator.userAgent.search("Chrome") >= 0)
	                e.preventDefault();
	            else
	                e.returnValue = false;
	        }

	        if (e.ctrlKey && (v == 0x41 || v == 0x43 || v == 0x56 || v == 0x58 || v == 0x59 || v == 0x5A)) {
	            /*WSU-21 : Handled keydown for CTRL+C,CTRL+V ,SHIFT+INSERT,CTRL+INSERT in this.hkd().
	            A global variable clipBoardBuffer is used to save and retrieve text instead
	            of actual clipboard.Also changes have to be checked for IE,FF and Chrome.
	            */
	            if (v == 0x58)  //cut
	            {
	                if (bCopyPaste)   // WSU-68
	                {
	                    // default copy-paste Anjali 25-Aug-2015
	                    e.returnValue = true;
	                    return;
	                }
	                if (navigator.userAgent.search("Chrome") >= 0) {
	                    if (this.bDiv) {
	                        e.preventDefault();
	                        var selection = docGetSelection();
	                        var node = selection.focusNode;
	                        var offset = selection.focusOffset;
	                        var rng = selection.getRangeAt(0);
	                        var str = node.nodeValue;
	                        clipBoardBuffer = str.substring(selection.anchorOffset, offset);
	                        selection.deleteFromDocument();
	                        this.s(e);
	                    }
	                    else {
	                        e.preventDefault();
	                        var lStr = this.ptr.value.substring(0, this.ptr.selectionStart);
	                        var rStr = this.ptr.value.substring(this.ptr.selectionEnd, this.ptr.value.length);
	                        clipBoardBuffer = this.ptr.value.substring(this.ptr.selectionStart, this.ptr.selectionEnd);
	                        this.ptr.value = lStr + rStr;
	                        globalG -= clipBoardBuffer.length;
	                        this.ptr.selectionStart = globalG;
	                        this.ptr.selectionEnd = this.ptr.selectionStart;
	                    }
	                }
	                else {
	                    e.returnValue = false;
	                    var sel = document.selection.createRange();
	                    clipBoardBuffer = sel.text;
	                    document.selection.clear();
	                    this.s(e);
	                }
	            }
	            if (v == 0x43)   //copy
	            {
	                if (bCopyPaste)   // WSU-68
	                {
	                    // default copy-paste Anjali 25-Aug-2015
	                    e.returnValue = true;
	                    return;
	                }
	                if (navigator.userAgent.search("Chrome") >= 0) {
	                    if (this.bDiv) {
	                        e.preventDefault();
	                        var selection = docGetSelection();
	                        var node = selection.focusNode;
	                        var offset = selection.focusOffset;
	                        var rng = selection.getRangeAt(0);
	                        var str = node.nodeValue;
	                        clipBoardBuffer = str.substring(selection.anchorOffset, offset);
	                    }
	                    else {
	                        e.preventDefault();
	                        clipBoardBuffer = this.ptr.value.substring(this.ptr.selectionStart, this.ptr.selectionEnd);
	                    }
	                }
	                else {
	                    e.returnValue = false;
	                    var sel = document.selection.createRange();
	                    clipBoardBuffer = sel.text;
	                    globalG = sel.selectionEnd;
	                }
	            }
	            if (v == 0x56)  //paste
	            {
	                if (bCopyPaste)  // WSU-68
	                {
	                    // default copy-paste Anjali 25-Aug-2015
	                    e.returnValue = true;
	                    return;
	                }
	                if (navigator.userAgent.search("Chrome") >= 0) {
	                    if (this.bDiv) {
	                        e.preventDefault();
	                        var selection = docGetSelection();
	                        var node = selection.focusNode;
	                        var offset = selection.focusOffset;
	                        var rng = selection.getRangeAt(0);
	                        var str = node.nodeValue;
	                        if (str != undefined || str != null) {
	                            left = str.substring(0, offset - this.b);
	                            right = str.substring(offset, str.length);
	                            node.data = left + clipBoardBuffer + right;
				    setRange(selection, node, rng, offset - this.b + clipBoardBuffer.length);
	                        }
	                        else {
	                            var nde = document.createTextNode(clipBoardBuffer);
	                            rng.insertNode(nde);
	                            rng.setStart(nde, 0);
	                            rng.setEnd(nde, clipBoardBuffer.length - this.b);
	                            rng.collapse(false);
	                            selection.removeAllRanges();
	                            selection.addRange(rng);
	                        }
	                    }
	                    else {
	                        if (docGetSelection()) {
	                            var lStr = this.ptr.value.substring(0, this.ptr.selectionStart);
	                            var rStr = this.ptr.value.substring(this.ptr.selectionEnd, this.ptr.value.length);
	                            var txtSelected = this.ptr.value.substring(this.ptr.selectionStart, this.ptr.selectionEnd);
	                            this.ptr.value = lStr + clipBoardBuffer + rStr;

	                            // globalG+=txtSelected.length-this.b;
	                            this.ptr.selectionStart = globalG;
	                            this.ptr.selectionEnd = this.ptr.selectionStart;
	                        }
	                        else {
	                            e.preventDefault();
	                            //Mrudu_9June2014:For slow typing issue, taken control's value in a variable
	                            var sFullText = this.ptr.value;
	                            var b = sFullText.substring(0, globalG - this.b);
	                            var l = sFullText.substring(globalG, sFullText.length);
	                            this.ptr.value = b + clipBoardBuffer + l;
	                            globalG += clipBoardBuffer.length - this.b;
	                            this.ptr.selectionStart = globalG;
	                            this.ptr.selectionEnd = this.ptr.selectionStart;
	                        }
	                    }
	                }
	                else {
	                    if (this.bDiv) {
	                        e.returnValue = false;
	                        var rng = document.selection.createRange();
	                        rng.moveStart("character", -this.b);
	                        rng.text = clipBoardBuffer;
	                        rng.moveEnd("character", clipBoardBuffer.length - this.b);
	                    }
	                    else {
	                        e.returnValue = false;
							var Range;
							//Mrudu_9June2014:For slow typing issue, taken control's value in a variable
							var sFullText = this.ptr.value;
							var b = sFullText.substring(0, globalG - this.b);
							var l = sFullText.substring(globalG, sFullText.length);
							this.ptr.focus();
							this.ptr.value = b + clipBoardBuffer + l;
							globalG += clipBoardBuffer.length - this.b;
							Range = this.ptr.createTextRange();
							var t = this.CP - globalG;
							Range.move("character", globalG + clipBoardBuffer.length - this.b);

							Range.select();
							var i;
							var lC = 0;
							for (i = 0; i <= b.length; i++) {
								var l = b.substring(i, i + 1);
								if (l == "\n")
									lC++;
							}
							this.CP = globalG + lC;
							this.ptr.selectionStart = globalG;
							this.ptr.selectionEnd = this.ptr.selectionStart;
						}
	                }
	            }
	            if (v == 0x5A)  // WSU-60 undo Anjali 1-Sep-2015.
	            {
	                this.COC = 0;
	                this.CI = -1;
	                this.Ps = "";
	                return true;
	            }
	            if (v == 0x41)  // WSU-69 Anjali 22-Sep-2015
	                return true;

	            return false;
	        }
	        if ((v == 0x6D) || (v == 0xC0) || (v <= 0x5A && v >= 0x41) || (v >= 0x30 && v <= 0x39) ||
                (v == 192 || // ~
                v == 189 || // -
                v == 187 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 186 ||  // ;
                v == 222 || // '
              (v == 188 && e.shiftKey) || (v == 188 && !e.shiftKey && ((gkbd == "Godrej") || (gkbd == "Ramington") || (gkbd == "Inscript") || (gkbd == "TypeWrit") || (gkbd == "Linotype"))) || // ,   // WSU-59 Anjali 17-Jun-2015 added Ramington, WSU-61 Anjali 9-Jul-2015 added Inscript
	        // added keyboard layout((gkbd == "TypeWrit")) to handle third layer for ctrl+space+dot and comma 21-06-2017
                (v == 190 && e.shiftKey) || (v == 190 && !e.shiftKey && ((gkbd == "Godrej") || (gkbd == "Ramington") || (gkbd == "Inscript") || (gkbd == "TypeWrit") || (gkbd == "Linotype"))) || // .   // WSU-59 Anjali 17-Jun-2015 added Ramington, WSU-61 Anjali 9-Jul-2015 added Inscript
                (v == 191 && !e.shiftKey) || (v == 191 && e.shiftKey && gkbd == "Godrej")) ||
                ((v == 191) && (e.shiftKey) && ((gkbd == "Ramington"))) ||
				((v == 191) && (e.shiftKey) && ((gkbd == "Apple"))) //For Telugu Apple IE

				)  // Anjali 24-Jul-2015
	        {
	            // if shift key is not pressed add 32 for conversion to small case characters
	            if (!e.shiftKey && v != 0x6D && (!((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 189 || // -
                v == 187 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 186 || // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191))) {
	                v += 32;
	            }

	            if ((v == 0xBD) && e.shiftKey) //underscore
	            {
	                v = 0x5F;
	            }

	            if ((v == 0xC0) && e.shiftKey)//tilde
	            {
	                v = 0x7e;
	            }
	            if ((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 189 || // -
                v == 187 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 222 || // '
                v == 186 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191) {
	                v = this.mapIE(v, e.shiftKey);
	            }

	            /*WSU-33-Maintaining cursor position after replacement of selected text
	            In Chrome,this code does not work for div tag.Need to find solution for this
	            */
	            if (navigator.userAgent.search("Chrome") >= 0) {
	                var sel = docGetSelection();
	                if (sel) {
	                    if (!this.bDiv) {
	                        var lStr = this.ptr.value.substring(0, this.ptr.selectionStart);
	                        var rStr = this.ptr.value.substring(this.ptr.selectionEnd, this.ptr.value.length);
	                        var txtSelected = this.ptr.value.substring(this.ptr.selectionStart, this.ptr.selectionEnd);

	                        if (txtSelected.length > 0) {
	                            this.ptr.value = lStr + rStr;
	                            globalG -= txtSelected.length;
	                            this.ptr.selectionStart = globalG;
	                            this.ptr.selectionEnd = this.ptr.selectionStart;
	                        }
	                    }
	                }
	            }

	            if (this.bCtrlSpace == true) {
	                this.b = 1;
	                this.removeSpecialCtrlSpace();
	                this.bCtrlSpace = false;
	            }
	            this.strNewCode += String.fromCharCode(v);
	            this.COM(this.strNewCode);
	            this.strNewCode = "";
	            if ('function' == typeof e.preventDefault) {
	                //if(this.divStartEditing || !this.bDiv)
	                e.preventDefault();

	            }
	            else {
	                window.event.returnValue = false;
	            }
	        }
	        else if ((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 189 || // -
                v == 187 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 222 || // ]
                v == 186 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191)  // /
	        {
	            // WSU-66 5-Aug-2015
	            if ((v == 188 && !e.shiftKey && gkbd == "TypeWrit") || // ,
                    (v == 190 && !e.shiftKey && gkbd == "TypeWrit") ||  // .
                    (v == 191 && e.shiftKey && gkbd == "TypeWrit") ||
					(v == 188 && !e.shiftKey && gkbd == "Aftab" ) ||
					(v == 190 && !e.shiftKey && gkbd == "Aftab" ) ||
					(v == 191 && !e.shiftKey && gkbd == "Aftab" ) ||
					(v == 191 && e.shiftKey && gkbd == "Aftab" )
					)    // ?
	            {
	                if ((v == 188) && (!e.shiftKey) && (gkbd == "TypeWrit" || gkbd == "Aftab")) v = 44;
	                else if ((v == 190) && (!e.shiftKey) && (gkbd == "TypeWrit" || gkbd == "Aftab")) v = 46;
	                else if ((v == 191) && (e.shiftKey) && (gkbd == "TypeWrit" || gkbd == "Aftab")) v = 63;

	                this.strNewCode += String.fromCharCode(v);
	                this.COM(this.strNewCode);
	                this.strNewCode = "";
	                return false;
	            }
	            globalG++;
	            return true;
	        }
	        else {
	            return true;
	        }

	    }   // end of IE / Chrome
	    else   // Other browser
	    {

	        var v = e.keyCode;


	        if (e.ctrlKey) {
	            this.PrevCtrl = 1;
	        }
	        if (e.shiftKey && this.PrevCtrl == 1) {
	            this.PrevCtrl = 0;
	            this.CtrlShift = 1;
	        }
	        if (e.shiftKey && v == 49 && this.CtrlShift == 1) {
	            this.CtrlShift = 0;
	            this.CtrlShiftOne = 1;
	        }
	        if (v == 8) {
	            this.backspace = 1;
	            this.Ps = this.Ps.slice(0, (this.Ps.length) - 1);
	        }
	        if (v == activeKey) // scroll lock key
	        {
	            this.L = this.L ? 0 : 1;
	        }

			if (e.ctrlKey && v == 40) {
				
				console.log("Control + DownArrow");
					var sel = window.getSelection();
					sel.collapseToStart();
					/*var el = document.getElementById("myeditor");;
					console.log(el);
					var range = document.createRange();
					var sel = window.getSelection();
					range.setStart(sel.focusNode, 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
					*/
				
			}
	        if (e.ctrlKey && v == 32) {
	            this.strNewCode = String.fromCharCode(216);
	            this.insertSpecialCtrlSpace();
	            e.preventDefault();
	            this.bCtrlSpace = true;
	            bSpecailSym = true;
	            return;
	        }
			else
			{
				bSpecailSym = false;
			}

			//Sachin for FF for CGG - Tel - TypeWrite - Inscript
			var isActive = parseInt(document.getElementById('txtLanguage').options[document.getElementById('txtLanguage').selectedIndex].value);
			 if ((v == 45 || v==35 || v == 40 || v== 34 || v == 37 ||  v==12 || v== 39 || v== 36 || v ==38 || v == 33 ) && (e.code.indexOf("Numpad")!=-1) && isActive != 0 ) {

			// if ((v >= 96 && v <= 105) && e.shiftKey) {
			 var strNewCode;

			switch(v) {
				case 45:
					strNewCode = translateNumerals("0", slg);
					break;
				case 35:
					strNewCode = translateNumerals("1", slg);
					break;
				case 40:
					strNewCode = translateNumerals("2", slg);
					break;
				case 34:
					strNewCode = translateNumerals("3", slg);
					break;
				case 37:
					strNewCode = translateNumerals("4", slg);
					break;
				case 12:
					strNewCode = translateNumerals("5", slg);
					break;
				case 39:
					strNewCode = translateNumerals("6", slg);
					break;
				case 36:
					strNewCode = translateNumerals("7", slg);
					break;
				case 38:
					strNewCode = translateNumerals("8", slg);
					break;
				case 33:
					strNewCode = translateNumerals("9", slg);
					break;
				default:

			}


				//this.strNewCode = String.fromCharCode(216);
	            var selection = docGetSelection();
				var node = selection.focusNode;
				var offset = selection.anchorOffset;
				var rng = selection.getRangeAt(0);
				var str = node.nodeValue;
				var left = "";
				var right = "";

				if (str != undefined || str != null) {
					//alert(' in div string');
					//document.getElementById("divStatus").innerHTML +="use existing";
					left = str.substring(0, offset);
					right = str.substring(offset, str.length);
					node.data = left + strNewCode + right;
					setRange(selection, node, rng, offset +1);
				}
			   else {
					var rangeTest;
					var nde = document.createTextNode(strNewCode);
				//	console.log(nde);
					rangeTest = rng;
					rangeTest.insertNode(nde);
					setRange(selection, nde, rangeTest, 1);
				}

				e.preventDefault();

	            return;

			}
				 else
			{
				bSpecailSym = false;
			}



	        //a=65, b=66, i=73, u=85, c=67, v=86, x=88, z=90, y=89, l=76, bksp=8, del=46 sachin
	        if (this.bypassOtherKeys(e)) {
	            return true;
	        }



	        //CTRL+S for save story
	        if (e.ctrlKey && v == 83) {
	            e.preventDefault();
	            saveStory();
	            return false;
	        }

	        //CTRL+l for close story
	        if (e.ctrlKey && v == 76) {
	            e.preventDefault();
	            closeStory();
	            return false;
	        }
	        //check if key code is less than space
	        if (v <= 32 || (v <= 40 && v >= 33)) // Special keys Home End,PageUp,PageDown,
	        {
	            //if (v <= 40 && v >= 33)
	            return true;
	        }
	        /*WSU-21 : Handled keydown for CTRL+C,CTRL+V ,SHIFT+INSERT,CTRL+INSERT,SHIFT+DEL in this.hkd().
	        A global variable clipBoardBuffer is used to save and retrieve text instead
	        of actual clipboard.
	        */

	        if (e.shiftKey && v == 45) {
	            e.preventDefault();
	            return false;
	        }
	        if (e.ctrlKey && v == 45) {
	            e.preventDefault();
	            return false;
	        }
	        if (e.shiftKey && v == 46) {
	            e.preventDefault();
	            return false;
	        }
	        // _ and all alphabets
	        if (docGetSelection()) {
	            if (e.ctrlKey && (v == 0x41 || v == 0x43 || v == 0x56 || v == 0x58 || v == 0x5A)) {
	                //WSU-21 : Handled keydown for CTRL+C,CTRL+V,CTRL+A,CTRL+X ,SHIFT+INSERT,CTRL+INSERT in this.hkd()
	                //A global variable clipBoardBuffer is used to save and retrieve text instead
	                //of actual clipboard.Also changes have to be checked for IE,FF and Chrome
	                if (v == 0x58) //cut
	                {
	                    if (bCopyPaste)   // WSU-68
	                    {
	                        // default copy-paste Anjali 25-Aug-2015
	                        e.returnValue = true;
	                        return;
	                    }
	                    if (this.bDiv) {
	                        e.preventDefault();
	                        var selection = docGetSelection();
	                        var node = selection.focusNode;
	                        var offset = selection.focusOffset;
	                        var rng = selection.getRangeAt(0);
	                        var str = node.nodeValue;
	                        clipBoardBuffer = str.substring(selection.anchorOffset, offset);
	                        selection.deleteFromDocument();

	                    }
	                    else {
	                        e.preventDefault();
	                        var lStr = this.ptr.value.substring(0, this.ptr.selectionStart);
	                        var rStr = this.ptr.value.substring(this.ptr.selectionEnd, this.ptr.value.length);
	                        clipBoardBuffer = this.ptr.value.substring(this.ptr.selectionStart, this.ptr.selectionEnd);
	                        this.ptr.value = lStr + rStr;
	                        globalG -= clipBoardBuffer.length;
	                        this.ptr.selectionStart = globalG;
	                        this.ptr.selectionEnd = this.ptr.selectionStart;
	                    }
	                }
	                if (v == 0x43) //copy
	                {
	                    if (bCopyPaste)   // WSU-68
	                    {
	                        // default copy-paste Anjali 25-Aug-2015
	                        e.returnValue = true;
	                        return;
	                    }
	                    if (this.bDiv) {
	                        e.preventDefault();
	                        var selection = docGetSelection();
	                        var node = selection.focusNode;
	                        var offset = selection.focusOffset;
	                        var rng = selection.getRangeAt(0);
	                        var str = node.nodeValue;
	                        clipBoardBuffer = str;
	                    }
	                    else {
	                        e.preventDefault();
	                        clipBoardBuffer = this.ptr.value.substring(this.ptr.selectionStart, this.ptr.selectionEnd);
	                        //globalG = this.ptr.selectionEnd;
	                    }
	                }
	                if (v == 0x56)  //paste
	                {
	                    if (bCopyPaste)    // WSU-68
	                    {
	                        // default copy-paste Anjali 25-Aug-2015
	                        e.returnValue = true;
	                        return;
	                    }
	                    if (this.bDiv) {
	                        e.preventDefault();
	                        var selection = docGetSelection();
	                        var node = selection.focusNode;
	                        var offset = selection.focusOffset;
	                        var rng = selection.getRangeAt(0);
	                        var str = node.nodeValue;
	                        if (str != undefined || str != null) {
	                            left = str.substring(0, offset - this.b);
	                            right = str.substring(offset, str.length);
	                            node.data = left + clipBoardBuffer + right;
				    setRange(selection, node, rng, offset - this.b + clipBoardBuffer.length);
	                        }
	                        else {
	                            var nde = document.createTextNode(clipBoardBuffer);
	                            rng.insertNode(nde);
	                            rng.setStart(nde, 0);
	                            rng.setEnd(nde, clipBoardBuffer.length - this.b);
	                            rng.collapse(false);
	                            selection.removeAllRanges();
	                            selection.addRange(rng);
	                        }
	                    }
	                    else {
	                        e.preventDefault();
	                        if (docGetSelection()) {
	                            //Mrudu_9June2014:For slow typing issue, taken control's value in a variable
	                            var sFullText = this.ptr.value;
	                            var lStr = sFullText.substring(0, this.ptr.selectionStart);
	                            var rStr = sFullText.substring(this.ptr.selectionEnd, sFullText.length);
	                            this.ptr.value = lStr + clipBoardBuffer + rStr;

	                            globalG += clipBoardBuffer.length - this.b;
	                            this.ptr.selectionStart = globalG;
	                            this.ptr.selectionEnd = this.ptr.selectionStart;
	                        }
	                        else {
	                            //Mrudu_9June2014:For slow typing issue, taken control's value in a variable
	                            var sFullText = this.ptr.value;
	                            var b = sFullText.substring(0, globalG - this.b);
	                            var l = sFullText.substring(globalG, sFullText.length);

	                            this.ptr.value = b + clipBoardBuffer + l;

	                            globalG += clipBoardBuffer.length - this.b;
	                            this.ptr.selectionStart = globalG;
	                            this.ptr.selectionEnd = this.ptr.selectionStart;
	                        }
	                    }
	                }

	                if (v == 0x5A)  // WSU-60 undo Anjali 1-Sep-2015.
	                {
	                    this.COC = 0;
	                    this.CI = -1;
	                    this.Ps = "";
	                    return true;
	                }
	                if (v == 0x41)  // WSU-69 Anjali 22-Sep-2015
	                    return true;

	                return false;
	            }
	            /*WSU-33-Maintaining cursor position after replacement of selected text*/
	            var sel = docGetSelection();

	            if (sel) {
	                if (this.bDiv) {
	                    sel.deleteFromDocument();
	                    this.ptr.selectionStart = globalG;
	                    this.ptr.selectionEnd = this.ptr.selectionStart;
	                }
	                else {
	                    var lStr = this.ptr.value.substring(0, this.ptr.selectionStart);
	                    var rStr = this.ptr.value.substring(this.ptr.selectionEnd, this.ptr.value.length);
	                    var txtSelected = this.ptr.value.substring(this.ptr.selectionStart, this.ptr.selectionEnd);
	                    this.ptr.value = lStr + rStr;

	                    globalG -= txtSelected.length;
	                    this.ptr.selectionStart = globalG;
	                    this.ptr.selectionEnd = this.ptr.selectionStart;
	                }
	            }
	        }

	        if ((v == 0x6D) || (v == 0xC0) || (v <= 0x5A && v >= 0x41) || (v >= 0x30 && v <= 0x39) ||
                (v == 192 || // ~
                v == 173 || // -
                v == 61 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
	        //Mrudu:Added condition for issue of Godrej kbd layout
                (v == 188 && e.shiftKey) || (v == 188 && !e.shiftKey && ((gkbd == "Godrej") || (gkbd == "Ramington") || (gkbd == "Inscript") || (gkbd == "TypeWrit") || (gkbd == "Linotype"))) || // ,    // WSU-59 Anjali 17-Jun-2015 added Ramington, WSU-61 Anjali 9-Jul-2015 added Inscript
                (v == 190 && e.shiftKey) || (v == 190 && !e.shiftKey && ((gkbd == "Godrej") || (gkbd == "Ramington") || (gkbd == "Inscript") || (gkbd == "TypeWrit") || (gkbd == "Linotype"))) || // .    // WSU-59 Anjali 17-Jun-2015 added Ramington, WSU-61 Anjali 9-Jul-2015 added Inscript
                (v == 191 && !e.shiftKey) || (v == 191 && e.shiftKey && gkbd == "Godrej")) ||
                ((v == 191) && (e.shiftKey) && ((gkbd == "Ramington")) ) || // Anjali 24-Jul-2015
				 ((v == 191) && (e.shiftKey) && ((gkbd == "Apple"))) || // For ? mark sachin
				  ((v == 192) && (!e.shiftKey) && ((gkbd == "Apple"))) ||
				  ((v == 190 || v == 173 || v == 191 || v == 188) && (!e.shiftKey) && ((gkbd == "Aftab"))) || // sachin for fullstop, dash and QuestionMark
				  ( (v == 191 || v == 188 ) && (e.shiftKey) && (gkbd == "Aftab")) // sachin

				  )

	        {

				var pos = this.ptr.scrollTop;
	            if ((v == 0x6D) && e.shiftKey) //underscore
	            {
	                v = 0x5F;
	            }

	            if ((v == 0xC0) && e.shiftKey)//tilde
	            {
	                v = 0x7e;
	            }



	            if ((v >= 0x30 && v <= 0x39) || //48 & 57
                v == 192 || // ~
                v == 173  || // -
                v == 61 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191) {
	                v = this.mapFire(v, e.shiftKey);
	            }
	            else if (!e.shiftKey && v != 0x6D && (!(/*(v >= 0x30 && v<=0x39)||*/
                v == 192 || // ~
                v == 173 || // -
                v == 61 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191))) {
	                v += 32;
	            }

				if (this.bCtrlSpace == true) {
	                this.b = 0;
	                this.removeSpecialCtrlSpace();
	                this.bCtrlSpace = false;
	            }
	            e.preventDefault();
	            this.strNewCode += String.fromCharCode(v);
	            this.COM(this.strNewCode);
	            this.strNewCode = "";

	            //if(!this.bDiv)
	            //                {
	            e.preventDefault();
	            //                }
	            this.ptr.scrollTop = pos;
	        }
	        else if ((v >= 0x30 && v <= 0x39) ||
                v == 192 || // ~
                v == 109 || // -
                v == 107 || // =
                v == 220 || // \
                v == 219 || // [
                v == 221 || // ]
                v == 59 ||  // ;
                v == 222 || // '
                v == 188 || // ,
                v == 190 || // .
                v == 191)  // /
	        {
	            // WSU-66 5-Aug-2015
	            if ((v == 188 && !e.shiftKey && gkbd == "TypeWrit") || // ,
                    (v == 190 && !e.shiftKey && gkbd == "TypeWrit") ||  // .
                    (v == 191 && e.shiftKey && gkbd == "TypeWrit") )   // ?
                   // (v == 191 && e.shiftKey && gkbd == "Apple") ||   // ?
                    //(v == 192 && !e.shiftKey && gkbd == "Apple"))    // ~
	            {
	                if ((v == 188) && (!e.shiftKey) && (gkbd == "TypeWrit")) v = 44;
	                else if ((v == 190) && (!e.shiftKey) && (gkbd == "TypeWrit")) v = 46;
	                else if ((v == 191) && (e.shiftKey) && (gkbd == "TypeWrit")) v = 63;
					// else if ((v == 191) && (e.shiftKey) && (gkbd == "Apple")) v = 63; //For ? in Tel - Appple
					//else if ((v == 192) && (!e.shiftKey) && (gkbd == "Apple")) v = 126; //For ~ Tel - Appple

	                this.strNewCode += String.fromCharCode(v);
	                this.COM(this.strNewCode);
	                this.strNewCode = "";
	                return false;
	            }
	            globalG++;
	            return true;
	        }
	        else return true;
	    }
	    return false;
	};
    // This function Composes an akshar and inserts it into current text field
    // It maintains state using Ps, enableInputConsonant, flLeftMatra
    //
	this.COM = function (r) {
	    var i;
	    var cc;
	    var cstr;
	    var storeRafar = "";
	    var storerakar = "";
	    if (bSpecailSym == true) { return; }

	    if (this.L) {
	        this.RemoveSelectedText();

	        //check if first character is halant in rafar set
	        //if it is it means rafar is to be added after consonant
	        var halant = kMO.specialKeys.rakar.length > 0 ? kMO.specialKeys.rakar[1][1] : "";

	        //Check if input is rafar keystroke
	        if (kMO.specialKeys.rafar[0] != "none" && r == kMO.specialKeys.rafar[0]) {
	            if (MatchVowel(this.Ps + r)) {
	            }
	            else if (this.CtrlShiftOne == 1) {

	                this.CtrlShiftOne = 0;
	                this.CI = -1;
	            }

	            else {
	                this.InsertRafar();
	                return;
	            }
	        }

			if(kMO.specialKeys.rakar.length > 0) {
				if (kMO.specialKeys.rakar[0] != "none") {
					if(r == kMO.specialKeys.rakar[0])
					{
						if (HalantUni(halant)) {
								this.rakarFlag = true;
							}
					}
				}
			}
			//handle conjuncts insertions
			//TODO: Find a better way to handle this
		if ((slg == "Tel" && gkbd == "TypeWrit"
				&& ((MatchVattuTel(r) && (this.replacementVattu != "kdE"))
						|| (r=="e" && this.replacementVattu!="")
						|| (r=="E" && this.replacementVattu!="")
						|| (r=="x" && this.replacementVattu!="")
						|| (this.replacementVattu=="k")
						|| (this.replacementVattu=="kd")
						|| (this.replacementVattu=="kdx")))

		   || (slg == "Dev" && gkbd == "Modular" && r == "]")
		   || (slg == "Dev" && gkbd == "Ramington" && r == "!")
		   || (slg == "Dev" && gkbd == "TypeWrit" && r == "z")
		  // || (slg == "Tel" && gkbd == "Inscript" && r == "j") // Rakar for Tel Inscript
		   )
		{
			if(slg == "Tel" && gkbd == "TypeWrit")
			{
				//replace vattu
				if((r=="e" && this.replacementVattu!="")
					|| (r=="E" && this.replacementVattu!="")
					|| (r=="x" && this.replacementVattu!="")
					|| (this.replacementVattu=="k")
					|| (this.replacementVattu=="kd")
					|| (this.replacementVattu=="kdx"))
				{
					if(this.replaceVattu(this.replacementVattu, r))
					{
						return;
					}
				}
				//insert vattu
				else if(this.insertVattu(r))
				{
					if(slg == "Tel" && gkbd == "TypeWrit")
					{
						//check for special vattus which need replacement later
						if(r=="L" || r=="V" || r=="/" || r=="M" || r=="1")
						{
							this.replacementVattu = r;
						}
					}
					return;
				}
			}
			else if(this.insertVattu(r))
			{
				return;
			}
		}
		//handle special character replacement
		 else if(slg == "Tel" && (gkbd == "TypeWrit" || gkbd == "Apple") )
//		 else if(slg == "Tel" && gkbd == "TypeWrit" )
		{
			if((r=="t" || r=="l" || r=="c" || r=="m") && this.checkRakar())
			{

				this.replacementVattu = r;
			}
			else
			{
				//adding 'E' to rakar means next character will not be part of rakarChar
				//so indicate this using replacementVattu
				if(this.Ps == "kdE" || this.replacementVattu == "kdE")
				{
					this.replacementVattu = this.Ps;
					//if matra is typed then add that to the composition as matra
					if(Match(r))
					{
						this.Ps = "kd";
						this.CI = this.M.fd(this.Ps);
						this.COC = this.M.AR[this.CI].eq(this.Ps);
					}
					else
					{
						this.Ps = "";
					}
				}
				else
				{
					this.replacementVattu = "";
				}
			}
		}
		else
		{
			this.replacementVattu = "";

		}

	        if (kMO.specialKeys.isPresent(r) || this.flLeftMatra) {
	            // If not phonetic
	            // if left side matra keydown
	            if (this.flLeftMatra && kMO.specialKeys.isPresent(r)) {
	                //fix the previous
	                // startNewComposition.
	                this.flPrevLeftMatra = this.flLeftMatra;
	                this.flLeftMatra = false;
	                this.COM(r);
	            }
	            else {
	                // Control space handling to be added
	                if (!this.flLeftMatra) {
	                    // don't go for normal compose set flag.
	                    //  adjust leftside matra and only once
	                    this.b = 0;
	                    this.strDummy ="."+ kMO.specialKeys.UniMatra(r);//added .(dot) for velanti and cursor shifting
	                    this.Reset();
	                    this.is(this.strDummy);
	                    // enable consonant.
	                    this.enableInputConsonant = true;
	                    // set leftmatra flag.
	                    this.flPrevLeftMatra = this.flLeftMatra;
	                    this.flLeftMatra = true;
	                    this.prefix = r;
	                    this.suffix = true;
	                    return;
	                }
	                this.flPrevLeftMatra = this.flLeftMatra;
	                this.flLeftMatra = true;
	                // if r matches vowel or matra part.
	                if (kMO.specialKeys.Completer != "none" && r == kMO.specialKeys.Completer) {
	                    //remove halant and zero width joiner from the end
	                    //alert("8803");
	                    this.flPrevLeftMatra = this.flLeftMatra;
	                    this.flLeftMatra = false;
	                    this.Reset();
	                    return this.removeHandZWJ();
	                }
	                else
	                    if (Match(r) && !kMO.specialKeys.isSuffix(r)) {
	                        // if matra aa matra and previous consonant
	                        // adjust left matra.

	                        this.flPrevLeftMatra = this.flLeftMatra;
	                        this.flLeftMatra = false;
	                        this.b = 0;
	                        this.CI = -1;
	                        this.COM(r);
	                        return;
	                    }

	                //if halant typed. enable input consonant
	                if (Halant(r) && !this.enableInputConsonant) {
	                    this.enableInputConsonant = true;
	                    var p;

	                    this.Ps += r;
	                    //Mrudu_09May2014:For rhasva velanti issue
	                    if (gkbd == "Modular" && this.Ps == "Kd") {
	                        this.Ps = "K\\";
	                    }
	                    //Mrudu_13May2014:For rhasva velanti issue
	                    if (gkbd == "Godrej" && this.Ps == "'`") {
	                        this.Ps += "`";
	                    }
	                    p = this.COC;
	                    this.COC = this.M.AR[this.CI].eq(this.Ps);
	                    // Insert String in edit box
	                    if (this.COC == -1) {
	                        // Set character index to -1 and call compose again
	                        this.CI = -1;
	                        this.Ps = "";
	                        this.COM(r);
	                        return;
	                    }
	                    else {
	                        // backspace the previous compositon using prevObjectCompostionIndex
	                        var b = this.M.AR[this.CI].o[p][1].length;
	                        //Insert the string.
	                        this.b = b;
	                        cstr = this.Mp();
	                        //special insert string.
	                        this.isLeft(cstr);
	                        return;
	                    }
	                }
	                if (this.enableInputConsonant) {
	                    if (this.strDummy != "") {
                            if (this.flLeftMatra == true){
                                this.b = 0;
                            }
	                        //remove the string.from display
	                        //and nullify.
	                        this.RemoveFullStop();
	                        this.strDummy = "";
	                    }

	                    var fd = false;
	                    // search in ObjectMap
	                    for (i = 0; i < this.M.AR.length; i++) {
	                        if (this.M.AR[i].M(r)) {
	                            this.CI = i;
	                            this.Ps = r;
	                            // Search Objectcomposition array
	                            // and Store
	                            this.COC = this.M.AR[this.CI].eq(this.Ps);
	                            this.PrevCOC = this.COC;
								this.PrevCI = this.CI;
	                            //Insert the string.
	                            this.b = 0;
	                            cstr = this.Mp();
	                            //special insert string
	                            this.isLeft(cstr);
	                            fd = true;
	                            this.M.CNT[i]++;
	                        }
	                    }
	                    if (fd == false) {
	                        i = this.M.fd(r);
	                        if (i != -1) {
	                            this.CI = i;
	                            this.Ps = r;
	                            // Search Objectcomposition array
	                            // and Store
	                            this.COC = this.M.AR[this.CI].eq(this.Ps);
	                            this.PrevCOC = this.COC;
								this.PrevCI = this.CI;
	                            //Insert the string.
	                            this.b = 0;
	                            cstr = this.Mp();
	                            //special insert string.
	                            this.isLeft(cstr);
	                            this.M.CNT[i]++;
	                        }
	                    }
	                    this.enableInputConsonant = false;
	                }
	                else {
	                    //check for suffix
	                    //Check in case of other languages
	                    //adjust
	                    var i = 0;
	                    if (this.suffix) {
	                        for (; i < kMO.specialKeys.suffixKeystroke.length; i++) {
	                            if (r == kMO.specialKeys.suffixKeystroke[i] && this.prefix == kMO.specialKeys.keystroke[i])
	                                break;
	                        }
	                        if (i < kMO.specialKeys.suffixKeystroke.length) {
	                            // add suffix matra
	                            this.changeSuffixMatraPart(kMO.specialKeys.UniValue[i]);
	                            this.suffix = false;
	                        }
	                        else {
	                            // alert("8919");
	                            this.flPrevLeftMatra = this.flLeftMatra;
	                            this.flLeftMatra = false;
	                            this.COM(r);
	                        }
	                    }
	                    else {
	                        // alert("8926");
	                        this.flPrevLeftMatra = this.flLeftMatra;
	                        this.flLeftMatra = false;
	                        this.COM(r);
	                    }
	                }
	            }
	            // if consonant comes place matra onright side
	            // else remove adjust leftside matra and clear left side matra flag.
	            // if more consonants are linked add the composition to left of matra.
	            // if after link a vowel/matra follows clear flag
	        }
	        else
	            if (this.CI == -1) {
	                var fd = false;
	                // search in ObjectMap
	                for (i = 0; i < this.M.AR.length; i++) {
	                    if (this.M.AR[i].M(r)) {
	                        this.CI = i;
	                        this.Ps = r;
	                        // Search Objectcomposition array
	                        // and Store
	                        this.COC = this.M.AR[this.CI].eq(this.Ps);
	                        //Insert the string.
	                        this.b = 0;
	                        cstr = this.Mp();

	                        ///Insert pulli for tamil Character.
	                        if (this.bPrevConsonant == true && this.bCurrConsonant == true && slg == "Tam" && gkbd == "Tam99") {
	                            this.is(kMO.halant);
	                            this.bPrevConsonant = false;
	                            this.bCurrConsonant = false;
	                        }
	                        this.is(cstr);
	                        fd = true;
	                        this.M.CNT[i]++;
	                    }
	                }
	                if (fd == false) {
	                    i = this.M.fd(r);
	                    if (i == -1) {
							//Key not found: Following explanation describes how the key is handled
							//----------------------------------------------------------------------------------------------------
							//Conjunct with thte pressed character cannot be found.
							//may be there is no character combination associated with this key
							//or may be developer has forgottton to add specific character for this key
							//Try to find its equivalent in the lookup
							//if not found OR ABSORB the key as if it was not pressed.
							//this way if it is a valid key, the developer will know something is wrong as keypress did not result in a glyph
							//otherwise, if this key is a DUMMY key, then it will be ignored.
	                        this.CI = this.M.fd(r);
							if(this.CI != -1)
							{
								this.COC = this.M.AR[this.CI].eq(this.Ps);
								if(this.COC != -1)
								{
									//key found, print the key, replace this.Ps with the key
									cstr = this.Mp();
									cstr = cstr.substring(1, cstr.length);
									this.Ps = r;
									this.is(cstr);
								}
								else
								{
									this.Ps = this.Ps.substring(0, this.Ps.length-1);
									this.CI = this.M.fd(this.Ps);
									if(this.M.AR[this.CI] != undefined && this.M.AR[this.CI] != null)
									{
										this.COC = this.M.AR[this.CI].eq(this.Ps);
									}
								}
							}
							else
							{
								this.Ps = this.Ps.substring(0, this.Ps.length-1);
								this.CI = this.M.fd(this.Ps);
								if(this.M.AR[this.CI] != undefined && this.M.AR[this.CI] != null)
								{
									this.COC = this.M.AR[this.CI].eq(this.Ps);
								}
							}
	                    }

	                    if (i != -1) {
	                        this.CI = i;
	                        this.Ps = r;
	                        this.ctrlSpace = "";
	                        // Search Objectcomposition array
	                        // and Store
	                        this.COC = this.M.AR[this.CI].eq(this.Ps);
	                        this.PrevCOC = this.COC;
							this.PrevCI = this.CI;
	                        //Insert the string.
	                        this.b = 0;
	                        cstr = this.Mp();
	                        ///Insert pulli for tamil Character.
	                        if (this.bPrevConsonant == true && this.bCurrConsonant == true && slg == "Tam" && gkbd == "Tam99") {
	                            this.is(kMO.halant);
	                            this.bPrevConsonant = false;
	                            this.bCurrConsonant = false;
	                        }
	                        //Mrudu:These conditions are for rakar and nukta correct composing with left matra
	                        //                            if((gkbd=="Modular" && r == "]" && this.flPrevLeftMatra) || (gkbd=="Modular" && r == "$" && this.flPrevLeftMatra))
	                        if (gkbd == "Modular" && r == "]" && this.flPrevLeftMatra) {

	                            this.isLeft(cstr);
	                            this.flPrevLeftMatra = false;
	                        }
	                        //                            else if((gkbd=="Godrej" && r == "_" && this.flPrevLeftMatra) || (gkbd=="Godrej" && r == "~" && this.flPrevLeftMatra))
	                        else if (gkbd == "Godrej" && r == "_" && this.flPrevLeftMatra) {
	                            this.isLeft(cstr);
	                            this.flPrevLeftMatra = false;
	                        }
	                        else if ((gkbd == "Monotype") && (r == "]")) {
	                            //alert(cstr);
	                        }
	                        else
							{
								this.is(cstr);
							}
	                        this.M.CNT[i]++;
	                    }

	                }
	            }
	            else {
	                var p;
					var q;

	                /*Mrudu_13May2014:For half ra on jd keystroke
	                Check here the keystrokes and assign this.Ps accordingly*/
	                if (gkbd == "Modular" && this.Ps == "j" && r == "d") {
	                    this.Ps = "j\\";
	                }
	                else if (gkbd == "Godrej" && this.Ps == "j" && r == "`") {
	                    this.Ps = "j``";
	                }

	                // vinayak for ](rafar+ dirghi i matra)
	                else if ((gkbd == "Monotype") && (r == "]")) {
	                    r = "r";
	                    this.Ps += r;
	                    //cstr = this.Mp();
	                    //this.is(cstr);
	                    // r = "r$";
	                }

	                else {
	                    this.Ps += r;
	                }
	                /*WSU-16 : For Shva composing changes made in this.COM function.
	                It is checked if this.Ps = "Md" then change this.Ps to "Mdd".*/
	                if (gkbd == "Inscript" && slg != "Tel" && this.Ps == "Md")  // Excluded Tel Sachin for Shta etc
	                    this.Ps += "d";
	                else if (gkbd == "Inscript" && this.Ps == "Mdd~")
	                    this.Ps = "Md~";
	                //Mrudu_08May2014 : half sha composing
	                if (gkbd == "Modular" && this.Ps == "Kd") {
	                    this.Ps = "K\\";
	                }
	                //Mrudu_13May2014 : half sha composing
	                if (gkbd == "Godrej" && this.Ps == "'`") {
	                    this.Ps += "`";
	                }
					if (slg == "Tel" && gkbd == "TypeWrit")
					{
						if(this.checkRakar() && this.rakarChar != "k" && this.rakarChar != "" && r=="x")
						{
							var ps = this.rakarChar + r;
							var ci = this.M.fd(ps);
							var coc = -1;
							if(ci != -1)
							{
								coc = this.M.AR[ci].eq(ps);
							}
							if(coc != -1)
							{
								this.replacementVattu = this.rakarChar;
								this.rakarChar = "";
								//call COM here to invoke replaceVattu() method with our parameters
								this.COM(r);
								return;
							}
							else
							{
								this.Ps = r;
							}
						}
						//Handling of 'k' key is very tricky in Telugu TypeWrit keyboard.
						//single 'k' is meant for Anuswar, whereas 'kd' is mean for 'ra'
						//but combinations of k with any other matra, such as ks,kS,k;,k: should work as 'kds,kdS,kd;,kd: etc.
						//also, there are few keys which should be treated differently, viz. ki, Kh, k|, kq, kP, kz
						//also also, 'kdx' is ఠ and its combinations are to be treated differently.
						//One more thing, this works differently when rakar which is halant(h)+ra(kd) is present
						//that's why you willl see so many conditions here.
						//Following condition handles only 'k' and its combinations with vowels and rakar
						else if(this.Ps[0] == "k" && (Match(r) || r=="x") || (this.checkRakar() && r=="d")) {
							if((this.Ps[1] != "d") && (r=="i" || r=="H" || r=="|" || r=="q" || r=="P" || r=="z"))
							{
								//do not change anything for ki, Kh, k|, kq, kP, kz
								if (this.Ps != "kiwi" && r != 'i') { // except key sequence -> kiwi & kii execute above if statement 
								this.Ps = "k" + r;       //  This is required by cgg and this is not as per Shree-Lipi TypeWrit kb 14Jan2019
							//	console.log('Kiwi');
								}
							}
							//skip 'kx' and 'kdx' handling. Let default path take care of it
							else if(this.Ps.length > 2 && (this.Ps[this.Ps.length-1] == "x"))
							{}
							else if(this.Ps.length <= 2 && this.Ps[1] != "i")
							{
								this.Ps = "kd" + r;
							}

							//check if rakar present, need to replace the placeholder, since the combination is Kk+<character>
							if(this.checkRakar() && this.rakarChar[0]=="k")
							{
								//'kd' is pressed
								if(this.Ps == "kdd" && this.rakarChar == "k")
								{
									this.rakarChar = "k";
									this.replacementVattu = "kd";
									r="";
									//call COM here to invoke replaceVattu() method with our parameters
									this.COM(r);
									this.rakarChar = "kd";
									return;
								}
								//'kd' is pressed
								if(this.rakarChar == "kx")
								{
									this.rakarChar = "kdx";
									this.replacementVattu = "kdx";
									//call COM here to invoke replaceVattu() method with our parameters
									this.COM(r);
									this.rakarChar = "kd";
									return;
								}
								else
								{
									if(this.rakarChar == "k" && (r=="i" || r=="H" || r=="|" || r=="q" || r=="P" || r=="z"))
									{
										this.replacementVattu = "k";
									}
									else
									{
										this.replacementVattu = "kd";
									}
								}
								//call COM here to invoke replaceVattu() method with our parameters
								this.COM(r);
								return;
							}
							else
							{
								this.rakarChar = "";
							}
						}
						//replace 'wq' with 'q'
						else if(r == "q" && this.Ps[this.Ps.length-2] == "w")
						{
							this.Ps = this.Ps.substring(0,this.Ps.length-2) + 'q';
						}
						this.rakarChar = "";
					}
	                if (this.backspace == 1)
					{
						q = this.PrevCI;
	                    p = this.PrevCOC;
					} else {
						p = this.COC;
						q = this.CI;
					}

	                this.COC = this.M.AR[this.CI].eq(this.Ps);
	                if (this.COC == -1) {
	                    // Set character index to -1 and call compose again
	                    this.CI = -1;
	                    this.COM(r);
	                } else {
	                    // backspace the previous compositon using prevObjectCompostionIndex
	                    var b = this.M.AR[q].o[p][1].length;
	                    //Insert the string.
	                    this.b = b;
	                    cstr = this.Mp();
	                    /*Mrudu_13May2014:If half ra is to be composed
	                    then make cstr as ra nukta which will make it half ra*/
	                    if (gkbd == "Modular" && this.Ps == "j\\") {
	                        cstr = String.fromCharCode(0X0931) + String.fromCharCode(0X094D);
	                    }
	                    if (gkbd == "Godrej" && this.Ps == "j``") {
	                        cstr = String.fromCharCode(0X0931) + String.fromCharCode(0X094D);
	                    }

	                    this.is(cstr);
	                    if (this.bPrevConsonant == true && this.bCurrConsonant == true && slg == "Tam" && gkbd == "Tam99") {
	                        this.bPrevConsonant = false;
	                        this.bCurrConsonant = false;
	                    }
	                }
	            }
	    }
	    else {
	        this.b = 0;
	        this.Ps = "";
	        this.CI = -1;
	        this.is(r);
	    }
	};

     this.Mp= function()
     {
        var cc;
        var cstr;
             // this.M.Ind[this.CI] will give you the index from main array
        //Mrudu:Added this condition to handle a char not present in layout
        if(kMO.CI[this.M.Ind[this.CI]].o != null)
        {
			if(kMO.CI[this.M.Ind[this.CI]].o[this.COC]==undefined)
			{
			   cstr="";
			   return cstr;
			}
		}
		else
		{
			cstr="";
			return cstr;
		}
        cc = kMO.CI[this.M.Ind[this.CI]].o[this.COC][1].charCodeAt(0);
        if((kMO.s <= this.M.Ind[this.CI]) && (this.M.Ind[this.CI] < kMO.t )/*&& (checkURL(kMO.c.x)|| this.ky <5)*/ )
        {
            //Add 1
            /*Mrudu_16Apr2014:Commented this condition as Chha in godrej was not composed*/
            //if(this.M.Ind[this.CI] != 50)
            cc++;
        }
        else if((kMO.t <= this.M.Ind[this.CI]) && (this.M.Ind[this.CI] < kMO.fo)/*&& (checkURL(kMO.c.x)||this.ky <5)*/)
        {
            //Add 2
            cc+=2;
        }
        else if((kMO.fo <= this.M.Ind[this.CI]) && (this.M.Ind[this.CI] < kMO.CI.length)/*&& ( checkURL(kMO.c.x)|| this.ky <5)*/)
        {
            //Add 3
            cc+=3;
        }
        cstr= String.fromCharCode(cc)+this.M.AR[this.CI ].o[this.COC ][1].substring(1, this.M.AR[this.CI ].o[this.COC ][1].length);
        // remembering a typed consonant.
        // for tamil language keyboard tam99
        if(cstr.length ==1 && slg=="Tam" && gkbd=="Tam99")
        {
            this.bPrevConsonant = this.bCurrConsonant;
            if(!(MatchVowelUni(cstr) || MatchMatra(cstr) || MatchNumeralsTam(cstr)))
                this.bCurrConsonant = true;
            else
                this.bCurrConsonant = false;
        }
        else
        {
            this.bPrevConsonant = false;
            this.bCurrConsonant = false;
        }

		//insert * for rakar -- Added below for Apple sachin
		if(slg == "Tel" && (gkbd == "TypeWrit" || gkbd == "Apple" ) && kMO.CI[this.M.Ind[this.CI]].o[this.COC][0] == kMO.specialKeys.rakar[0])
		{
			cstr = "*" + cstr;
		}

        return cstr;
     };
}//function h ends here

// Populate Items Vowels, Combinations, Consonants
// o is object containing vowels, combinations of ka and consonants
// a window object
// b index to object array
// c XML file to read
function PI(o,a,b,c)
{
    var xmlDoc;
    o[b] = new Array();
    if (a.XMLHttpRequest)
    {
        xmlDoc=new a.XMLHttpRequest();
        xmlDoc.open("GET",gPath+"/web/" + c+ ".xml",false);
        xmlDoc.send("");
        var txt =xmlDoc.responseText;
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/" + c + ".xml");
    }
    // using XML Document fill the arrays in Map
    var af = xmlDoc.getElementsByTagName("v")[0].getElementsByTagName("i");
    var j;
    var i;
    ii=0;
    for (j=0;j<af.length;j++)
    {
        var bf = af[j].getElementsByTagName("as")[0].childNodes[0].nodeValue;
        var hf = af[j].getElementsByTagName("u")[0].childNodes[0].nodeValue;
        var el = hf.split(",");
        var kf ;
        var ef ;
        var ff = "";

        for (kf = 0; kf < el.length;kf++)
        {
            ef = parseInt(el[kf],16);
            if(c.indexOf("Vowels")== 0)
            {
                if(kMO.c.x.indexOf("ost") == 6)
                {
                ef++;
                }
            }
            else if(c.indexOf("Consonants")== 0)
            {
                if(kMO.c.x.indexOf("loc") == 0)
                {
                ef+=2;
                }
            }

            ff = ff + String.fromCharCode(ef );
        }
        o[b][ii] = ff;
        o[b][ii+1]= bf;
        ii+=2;
    }

}
// COmbinations of consonants
function  CB(o,a,b,c)
{
    var i= 0;
    var j =0;
    o[a] = new Array();
     for(i=0;j< k.length/2;i+=2)
     {
        o[a][i] = b+k[i+1];
        document.getElementById("ConsonantCombi"+i).innerHTML = o[a][i] ;
        o[a][i+1] = c +k[i];
        document.getElementById("ConsonantCombi"+(i+1)).innerHTML = o[a][i+1] ;
        j++;
     }
}

function Insert(o)
{
    if(focusObj!= -1)
        C[focusObj].is(o.innerHTML);
}
//
// Showing help in a div tag
// Three tables are added dynamically to innerHTML of div tag
// Data is taken from XML file and populated in arrays.
var obj = new Array();

function Help(x)
{
    var i;
    var strTable;
    var j;
    PI(obj,window,0,"Vowels"+ slg);
    PI(obj,window,1,"Consonants"+slg);

    //obj[0] = new Array('\u0C85','a','\u0C86','aa');
    //obj[1] = new Array('\u0C95\u0CCD','k','\u0C95','ka','\u0C95\u0CBE','kaa');
    //obj[2] = new Array('\u0C95','ka','\u0C96','kaa');
    strTable = "<table border=1 cellpadding=2 cellspacing=0 >";
    strTable += "<tr>";
    for(i=0;i<obj[0].length;i+=2)
    {
        strTable += "<td style='font-size:30' ><p> ";
        strTable +=obj[0][i];
        strTable += " </p></td>";
    }
    strTable += "</tr>";
    strTable += "<tr>";
    for(i=1;i<obj[0].length;i+=2)
    {
        strTable += "<td><p> ";
        strTable +=obj[0][i];
        strTable += " </p></td>";
    }
    strTable += "</tr>";
    strTable += "</table>";
    strTable += "<table border=1 cellpadding=2  cellspacing=0>";
    strTable += "<tr>";
    for(i=0;i<k.length;i+=2)
    {
        strTable += "<td style='font-size:30' id=\""+ "ConsonantCombi"+i +  "\" onclick=\"Insert(document.getElementById('" +"ConsonantCombi"+i+"') );\" onmouseover=\"this.style.cursor='hand';\" > ";
        //strTable +=obj[2][i];
        strTable += " </td>";
    }
    strTable += "</tr>";
    strTable += "<tr>";
    for(i=1;i<k.length;i+=2)
    {
        strTable += "<td id=\""+ "ConsonantCombi"+i + "\" > ";
        //strTable +=obj[2][i];
        strTable += " </td>";
    }
    strTable += "</tr>";
    strTable += "</table>";

    for(j =0; j < (obj[1].length/20) -1;j++)
    {
        strTable += "<table border=1 cellpadding=2  cellspacing=0>";
        strTable += "<tr>";
        for(i=j*20;i<(j*20+20);i+=2)
        {

            strTable += "<td style='font-size:30' onclick=\""+ "CB(obj,2,obj[1]["+i+"],obj[1]["+(i+1)+"].substr(0,"+(obj[1][i+1].length -1)+"));" + "\" onmouseover=\"this.style.cursor='hand';\" >  ";
            strTable +=obj[1][i];
            strTable += " </td>";
        }
        strTable += "</tr>";
        strTable += "<tr>";
        for(i=j*20+1;i<(j*20+20);i+=2)
        {
            strTable += "<td> ";
            strTable +=obj[1][i];
            strTable += " </td>";
        }
        strTable += "</tr>";
        strTable += "</table>";
    }
    strTable += "<table border=1 cellpadding=2  cellspacing=0>";
    strTable += "<tr>";
    for(i=j*20;i <obj[1].length;i+=2)
    {
        //strTable += "<td> ";
        strTable += "<td style='font-size:30' onclick=\""+ "CB(obj,2,obj[1]["+i+"],obj[1]["+(i+1)+"].substr(0,"+(obj[1][i+1].length -1)+"));" + "\" onmouseover=\"this.style.cursor='hand';\" >  ";
        strTable +=obj[1][i];
        strTable += " </td>";
    }
    strTable += "</tr>";
    strTable += "<tr>";
    for(i=j*20+1;i< obj[1].length;i+=2)
    {
        strTable += "<td> ";
        strTable +=obj[1][i];
        strTable += " </td>";
    }
    strTable += "</tr>";
    strTable += "</table>";

    document.getElementById(x).innerHTML = strTable;
    CB(obj,2,obj[1][0],obj[1][1].substr(0,1));

};

function IsNotDelimiter(charachter)
{
	if(charachter == ' ' || charachter=='\n' || charachter=='\t' || charachter==',')
        return false;
    return true;
};
function RLMX(a,b,c)
{
    var xmlDoc;
    if (b.XMLHttpRequest)
    {
        xmlDoc=new b.XMLHttpRequest();

        xmlDoc.open("GET",gPath+"/web/" + c+ ".xml",false);
        xmlDoc.send("");
        var txt =xmlDoc.responseText;
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/" + c + ".xml");
    }
    return xmlDoc;
}
function R(a,b,c)
{
    var xmlDoc ;
    switch(c)
    {
    case 1: f="Vowel";
            break;
    case 2: f="Consonant"+b;
            break;
    case 3: f="Matra";
    }
    xmlDoc = RLMX(a,b,f);
}
function getTutorText()
{
    var txtTT;
    // slg script
    // read Vowels.xml file for script.
    txtTT= R(slg,window,1);
    // create contents for tutor.
    // read Consonants xml file for the script
    txtTT+=R(slg,window,2);
    // create contents for tutor
    // read Matras xml file for the script
    txtTT+=R(slg,window,3);
    // create contents for tutor
    return txtTT;
}

var brCount = 5;
var rows = 0;
function Init(o,a,c)
{
    var xmlDoc;
    var l = o;
    //o[b] = new Array();
    if (a.XMLHttpRequest)
    {
        xmlDoc=new a.XMLHttpRequest();
        xmlDoc.open("GET",gPath+"/web/" + c+ ".xml",false);
        xmlDoc.send("");
        var txt =xmlDoc.responseText;
        try //Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(txt);
        }
        catch(err)
        {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(txt,"text/xml");
        }
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.load(gPath+"/web/" + c + ".xml");
    }
    // using XML Document fill the arrays in Map
    var af = xmlDoc.getElementsByTagName("v")[0].getElementsByTagName("i");
    var j;
    var i;
    var cnt= 0;
    ii=0;
    for (j=0;j<af.length;j++)
    {
        var bf = af[j].getElementsByTagName("as")[0].childNodes[0].nodeValue;
        var hf = af[j].getElementsByTagName("u")[0].childNodes[0].nodeValue;
        var el = hf.split(",");
        var kf ;
        var ef ;
        var ff = "";
        for (kf = 0; kf < el.length;kf++)
        {
            ef = parseInt(el[kf],16);
            if(c.indexOf("Vowels")== 0)
            {
                if(kMO.c.x.indexOf("ost") == 6)
                {
                ef++;
                }
            }
            else if(c.indexOf("Consonants")== 0)
            {
                if(kMO.c.x.indexOf("loc") == 0)
                {
                ef+=2;
                }
            }
            ff = ff + String.fromCharCode(ef );
        }
        if(c.indexOf("Consonants")== 0)
            l.innerHTML+= "<input type='button' style='background-color:White;height:40px;width:30px;font-size:medium' value='"+ ff+ "' onclick='OnKeyTutorButtonClick(event)' id='Consonant"+j+"' name='Consonant"+j+"' />";
        else
            l.innerHTML+= "<input type='button' style='background-color:White;height:40px;width:30px;font-size:medium' value='"+ ff+ "' onclick='OnKeyTutorButtonClick(event)' id='Vowel"+j+"' name='Vowel"+j+"' />";
        cnt++;
        if (cnt==brCount && (c.indexOf("Consonants")== 0))
        {
            l.innerHTML+="</br>" ;
            cnt =0;
            rows++;
            if(rows == 5)
            {
                l = document.getElementById("Consonants2");
                l.innerHTML = "";
                brCount = 2;
             }
        }
        ii+=2;
    }
    CCount = af.length;
    rows = 0;
    brCount = 5;
}



// Filling Keyboard Tutor with details of Vowels,
// consonants, and Matras.
//
function FillTutor(divContents)
{
    // details();
    var d = divContents;
    var v;
    var cn;
    var cj;
    var m;
    var lnk;
    d.innerHTML = "";
    d.innerHTML = "<table><tr><td id='Vowels'></td></tr></table><table style='border:1'  id='tbContents' ><tr><td><table style='border:1' ><tr><td id='Consonants1'></td><td id='Consonants2'></td></tr></table></td><td id='Conjuncts'></td></tr></table><table style='text-align:center'><tr><td id='Link' ></td></tr><tr><td id='Matras'></td></tr></table>";
    v = document.getElementById('Vowels');
    cn =document.getElementById('Consonants1');
    cj =document.getElementById('Conjuncts');
    m = document.getElementById('Matras');
    lnk =document.getElementById('Link');
    function FillMatras()
    {

        // Using k;
        for (index = 1; index < k.length/2;index++)
        {
            if(k[index*2 +1]!="")
            {
                //d.innerHTML += "<input type='button' style='font-size:medium' value='"+ k[index*2 +1]+ "' onclick='OnKeyTutorButtonClick(event);' />"
                m.innerHTML += "<input type='button' style='background-color:White;height:40px;width:30px;font-size:medium' value='"+ k[index*2 +1]+ "' onclick='OnKeyTutorButtonClick(event);' />";
            }
        }
        m.innerHTML +="<br/>";
    };
    function FillVowels()
    {
        Init(v,window,"Vowels"+slg);
        v.innerHTML +="<br/>";
    };
    function FillConsonants()
    {
        Init(cn,window,"Consonants"+slg);
        cn.innerHTML +="<br/>";
    };
    FillVowels();
    FillConsonants();
    lnk.innerHTML += "<input type='button' style='background-color:White;width:50px;font-size:medium' value='Link' onclick='OnKeyTutorButtonClick(event);' />";
    lnk.innerHTML += "<br/>";
    FillMatras();
    d.innerHTML += "<input type='button' style='width:200px;font-size:medium' value=' ' onclick='OnKeyTutorButtonClick(event);' />";
}
var activeCurr;
function OnKeyTutorButtonClick(e)
{
    var ctrlButtonObj;
    if(navigator.appName == "Netscape")
    {
        ctrlButtonObj = e.currentTarget;
    }
    else
    {
        if(!e)
        {
            e =window.event;
            ctrlButtonObj = e.srcElement;
        }
        else
        {
            ctrlButtonObj = e.srcElement;

        }
    }
    ctrlButtonObj.style.backgroundColor = "Silver";
    if(typeof(activeCurr) != "undefined")
        activeCurr.style.backgroundColor = "White";
    activeCurr = ctrlButtonObj;
    // Insert the value in the code ctrlButtonObj.value;
    // ctrButtonObj.value in active element;
    // Temporary keep one Id fixed.
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed

        if(activeElement == C[i].ptr)
        {
            break;
        }
    }
    if(ctrlButtonObj.id.indexOf("Consonant") == 0)
    {
        var conjs;
        conjs= document.getElementById("Conjuncts");
        conjs.innerHTML = "";
        for(ii = 0;ii< CCount;ii++)
        {
            var text;
            text = ctrlButtonObj.value + k[1]+ document.getElementById("Consonant"+ii).value;
            conjs.innerHTML+="<input type='button' style='background-color:White;width:30px;height:40px;font-size:medium' value='"+text+"' onclick='OnKeyTutorButtonClick(event);' id='"+"Conjunct"+ii +"' />";
            if(ii%8 == 7)
            {
                conjs.innerHTML+="</br>";

            }
        }

    }
    if(i<C.length)
    {
        var text = ctrlButtonObj.value;
        if (text !="Link")
        {
            C[i].b = 0;
            C[i].is(text);
        }
        else
        {
            C[i].b = 0;
            C[i].is(k[1]);
        }
    }
}
function ChangeFont(fontName)
{
    //if((navigator.userAgent.indexOf("Apple") == -1 ))
    //    document.getElementById("editor").focus();
    var ln = C.length;
    var i;
     var sel;
        var testCursorStart ;
        var testCursorEnd ;
        var testStartContainer ;
        var testEndContainer ;
        var rng;
    for ( i=0;i <C.length;i++)
    {
        if(activeElement == C[i].ptr)
        {
        break;
        }
    }

    if(i <C.length)
    {
        C[i].Reset();
        if(navigator.appName != "Microsoft Internet Explorer")
        {
        sel = docGetSelection();
        testCursorStart = sel.anchorOffset;
        testCursorEnd = sel.focusOffset;
        testStartContainer = sel.anchorNode;
        testEndContainer = sel.focusNode;
        rng= document.createRange();
        }
        else
        {
            document.getElementById(C[i].divEditor).focus();
        }
    }

    document.execCommand("fontName",false,fontName);
    // For browsers other than IE.
    if(i<C.length)
    {
        if(navigator.appName != "Microsoft Internet Explorer")
        {

        document.getElementById(C[i].divEditor).focus();
        sel = docGetSelection();
        rng.setStart(testStartContainer,testCursorStart);
        rng.setEnd(testEndContainer,testCursorEnd);
        sel.removeAllRanges();
        sel.addRange(rng);
        }
    }
}

function ChangeSize(fontSize)
{
    //if((navigator.userAgent.indexOf("Apple") == -1 ))
    //    document.getElementById("editor").focus();
    var ln = C.length;
    var i;
    var sel ;
    var testCursorStart;
    var testCursorEnd ;
    var testStartContainer;
    var testEndContainer;
    var rng;
    for ( i=0;i <C.length;i++)
    {
        if(activeElement == C[i].ptr)
        {
        break;
        }
    }

    if(i <C.length)
    {
        C[i].Reset();
        if(navigator.appName != "Microsoft Internet Explorer")
        {
        sel = docGetSelection();
        testCursorStart = sel.anchorOffset;
        testCursorEnd = sel.focusOffset;
        testStartContainer = sel.anchorNode;
        testEndContainer = sel.focusNode;
        rng= document.createRange();
        }
        else
        {
            document.getElementById(C[i].divEditor).focus();
        }
    }

    document.execCommand("fontSize",false,parseInt(fontSize,10));
    // For browsers other than IE.
    if(i<C.length)
    {
        if(navigator.appName != "Microsoft Internet Explorer")
        {

        document.getElementById(C[i].divEditor).focus();
        sel = docGetSelection();
        rng.setStart(testStartContainer,testCursorStart);
        rng.setEnd(testEndContainer,testCursorEnd);
        sel.removeAllRanges();
        sel.addRange(rng);
        }
    }
}

function Color(type,color)
{
    //if((navigator.userAgent.indexOf("Apple") == -1 ))
    //    document.getElementById("editor").focus();
    var ln = C.length;
    var i;
    var sel = docGetSelection();
    var testCursorStart = sel.anchorOffset;
    var testCursorEnd = sel.focusOffset;
    var testStartContainer = sel.anchorNode;
    var testEndContainer = sel.focusNode;
    var rng= document.createRange();

    for ( i=0;i <C.length;i++)
    {
        if(activeElement == C[i].ptr)
        {
        break;
        }
    }

    if(i <C.length)
    {
        C[i].Reset();
        if(navigator.appName != "Microsoft Internet Explorer")
        {
        sel = docGetSelection();
        testCursorStart = sel.anchorOffset;
        testCursorEnd = sel.focusOffset;
        testStartContainer = sel.anchorNode;
        testEndContainer = sel.focusNode;
        rng= document.createRange();
        }
        else
        {
            document.getElementById(C[i].divEditor).focus();
        }
    }
    if(type == 0) //forecolor
        document.execCommand("foreColor",false,color);
    else
        document.execCommand("backColor",false,color);
    // For browsers other than IE.
    if(i<C.length)
    {
        if(navigator.appName != "Microsoft Internet Explorer")
        {

        document.getElementById(C[i].divEditor).focus();
        sel = docGetSelection();
        rng.setStart(testStartContainer,testCursorStart);
        rng.setEnd(testEndContainer,testCursorEnd);
        sel.removeAllRanges();
        sel.addRange(rng);
        }
    }
}

function editing(type)
{

    //if((navigator.userAgent.indexOf("Apple") == -1 ))
    //    document.getElementById("editor").focus();
    var ln = C.length;
    var i;
    for ( i=0;i <C.length;i++)
    {
        if(activeElement == C[i].ptr)
        {
        break;
        }
    }

    if(i <C.length)
    {
        C[i].Reset();
        if(navigator.appName != "Microsoft Internet Explorer")
        {
        var sel = docGetSelection();
        var testCursorStart = sel.anchorOffset;
        var testCursorEnd = sel.focusOffset;
        var testStartContainer = sel.anchorNode;
        var testEndContainer = sel.focusNode;
        var rng = document.createRange();
        }
        else
        {
            document.getElementById(C[i].divEditor).focus();
        }
    }
    switch(type)
    {
    case 1:
        document.execCommand("bold",false,null);
        break;
    case 2:
        document.execCommand("italic",false,null);
        break;
    case 3:
        document.execCommand("underline",false,null);
        break;
    case 4:
        document.execCommand("strikeThrough",false,null);
        break;
    case 5:
        document.execCommand("justifyCenter",false,null);
        break;
    case 6:
        document.execCommand("justifyFull",false,null);
        break;
    case 7:
        document.execCommand("justifyLeft",false,null);
        break;
    case 8:
        document.execCommand("justifyRight",false,null);
        break;
    case 9:
        document.execCommand("insertorderedlist", false, null);
        break;
    case 10:
        document.execCommand("insertunorderedlist", false, null);
        break;
    case 11:
        document.execCommand("indent", false, null);
        break;
    case 12:
        document.execCommand("outdent", false, null);
        break;
    case 13:
        document.execCommand("decreaseFontSize", false, null);
        break;

    }
    // For browsers other than IE.
    if(i<C.length)
    {
        if(navigator.appName != "Microsoft Internet Explorer")
        {
            document.getElementById(C[i].divEditor).focus();
        }
    }

}
function getAvailableKeyboards(script) {

    var strKey = new Array;
    switch(script)
    {
    case DEV:
        strKey[0] = "Phonetic";
     /*   strKey[1] = "Inscript";
        strKey[2] = "Modular";
        strKey[3] = "Godrej";
        strKey[4] = "Ramington";
        strKey[5] = "TypeWrit"; */

        break;
    case TAM:
        strKey[0] = "Prakshak";
        strKey[1] = "Raming1";
        strKey[2] = "Tam99";
        strKey[3] = "TSCII";
        strKey[4] = "Keyman";
        strKey[5] = "Typewrit";

        break;
    case KAN:
        strKey[0] = "Phonetic";
        strKey[1] = "KGP";

        break;
    case TEL:
        // strKey[0] = "Phonetic";
        strKey[0] = "Inscript";
	    strKey[1] = "Apple";
		strKey[2] = "TypeWrit";
        break;
    case MAL:
        strKey[0] = "Inscript";
        strKey[1] = "Manorama";
        strKey[2] = "Phonetic";

        break;
    case GUJ:
        strKey[0] = "Inscript";
        strKey[1] = "Typewrit";
        strKey[2] = "Phonetic";
        break;
   case BAN:
       strKey[0] = "Phonetic";
       strKey[1] = "Linotype";
       strKey[2] = "Monotype";

        break;

	case URD:
       strKey[0] = "Aftab";
       break;
	}


    return strKey;
}

function SetKeyboards(arrKeyboards)
{
    arrKeyboards[0] = new Array();
    arrKeyboards[1] = new Array();
    arrKeyboards[2] = new Array();
    arrKeyboards[3] = new Array();
    arrKeyboards[4] = new Array();
    arrKeyboards[5] = new Array();
    arrKeyboards[6] = new Array();
    arrKeyboards[7] = new Array();
    arrKeyboards[8] = new Array();
    arrKeyboards[9] = new Array();
    arrKeyboards[10] = new Array();
    arrKeyboards[11] = new Array();

    arrKeyboards[DEV][0] = "Phonetic";
    arrKeyboards[DEV][1] = "Inscript";
    arrKeyboards[DEV][2] = "Modular";
    arrKeyboards[DEV][3] = "Godrej";
    arrKeyboards[DEV][4] = "Ramington";
    arrKeyboards[DEV][5] = "TypeWrit";

    arrKeyboards[TAM][0] = "Prakshak";
    arrKeyboards[TAM][1] = "Raming1";
    arrKeyboards[TAM][2] = "Tam99";
    arrKeyboards[TAM][3] = "TSCII";
    arrKeyboards[TAM][4] = "Keyman";
    arrKeyboards[TAM][5] = "Typewrit";

    arrKeyboards[KAN][0] = "Phonetic";
    arrKeyboards[KAN][1] = "KGP";

    arrKeyboards[TEL][0] = "Phonetic";
    arrKeyboards[TEL][0] = "Typewrit";

    arrKeyboards[GUJ][0] = "Inscript";
    arrKeyboards[GUJ][1] = "Typewrit";
    arrKeyboards[GUJ][2] = "Phonetic";

    arrKeyboards[MAL][0] = "Inscript";

    arrKeyboards[BAN][0] = "Phonetic";
    arrKeyboards[BAN][1] = "Linotype";
    arrKeyboards[BAN][2] = "Monotype";

	arrKeyboards[URD][0] = "Aftab";

}

function InitTutor(element,partialHTMLPage)
{
    if(null == document.getElementById(element)) return;
    var txt ="";
    var req = null;
    if (window.XMLHttpRequest)
    {
        var xmlDoc=new window.XMLHttpRequest();
        xmlDoc.open("GET",gPath+"/web/"+partialHTMLPage,false);
        xmlDoc.send("");
        txt =xmlDoc.responseText;
    }
    // IE 5 and IE 6
    else //if (ActiveXObject("Microsoft.XMLDOM"))
    {
        try
        {
              req = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e)
        {
              try
              {
                req = new ActiveXObject("Microsoft.XMLHTTP");
              }
              catch (e)
              {
                req = false;
              }
        }
    }
    if (txt=="")
    {
        if (req)
        {
        // Synchronous request, wait till we have it all
            req.open("GET", gPath+"/web/"+partialHTMLPage,false);
            req.send(null);
            document.getElementById(element).innerHTML = req.responseText;
        }
    }
    else
    {

        document.getElementById(element).innerHTML = txt;
    }
}

function ShowTutor(bShow)
{	
    //if(document.getElementById("tutor").style.display =="none")
    if(document.getElementById("tutor").style.display =="none")
    {
        document.getElementById("TutorTitle").innerHTML  = "Modular Infotech Tutor for Keyboard : "+gkbd;
        document.getElementById("tutor").style.display ="inline";
    }
    else
    {
        document.getElementById("tutor").style.display ="none";
    }
}


var key;

//"24d45e25e01f5cf8502e63021e8e36e7"
//,"09e28f26beac1583c4e2decbd4dada3",
function checkURL(url)
{
    var i = 0;
    key = new RSAKeyPair(
		 "8f542ef1cd01230223d2cc9436c5eab3",
		 "23bf615f29233a6e3ec005eccd1de26b",
         "2d467f11bf7358473dc38738f09feab1"
		);
    for(;i<arrURLs.length;i++)
    {
        var strD;
        strD = Decrypt(arrURLs[i]);
        if(url == strD  )
            return true;
    }

    return false;
}

//    function Encrypt(str)
//    {
//    	setMaxDigits(19);
//		key = new RSAKeyPair(
//		 "7e74e331cdabc0f23d1bb9436c5e283",
//         "23bf615f29233a6e3ec005eccd1de26b",
//         "2d467f11bf7358473dc38738f09feab1"	);
//		return encryptedString(key, str);
//    }
    function Decrypt(strToDecrypt)
    {
         key = new RSAKeyPair(
		 "8f542ef1cd01230223d2cc9436c5eab3",
		 "23bf615f29233a6e3ec005eccd1de26b",
         "2d467f11bf7358473dc38738f09feab1"
		);
        return decryptedString(key, strToDecrypt);
    }
function FindAndReplace(bShow)
{
    //if(document.getElementById("tutor").style.display =="none")
    if(bShow)
    {
        document.getElementById("findreplace").style.display ="inline";
    }
    else
    {
        document.getElementById("findreplace").style.display ="none";
    }

    //var open=window.showModalDialog("/" + gPath + "/findreplace.htm", gPath, "height:200px;width:300px; center:yes,scroll:no");
    //document.getElementById('editor');
}
function FnR(id)
{
    if(id=="imgfnd"){
     document.getElementById("divfnr").style.visibility="visible";
     document.getElementById("divfnr").style.display ="inline";
     }
     else
     {
     removeFind();
     setCounts();
     document.getElementById("find").value="";
     document.getElementById("replace").value="";
     document.getElementById("divfnr").style.visibility="hidden";
     document.getElementById("divfnr").style.display = 'none';
     }
}

function initdef()
{
 if (!dlc())  return false;
if(!hnc()) return false;
    //WSU-57
    if(null!=document.getElementById("myInput"))
        document.getElementById("myInput").onkeyup=unhku;
    if(null!=document.getElementById("myTextArea"))
        document.getElementById("myTextArea").onkeyup=unhku;
    if(null!=document.getElementById("find"))
        document.getElementById("find").onkeyup=unhku;
    if(null!=document.getElementById("replace"))
        document.getElementById("replace").onkeyup=unhku;
    if(null!=document.getElementById("editor"))
        document.getElementById("editor").onkeyup=unhku;

	iL = 0; //index to composers array
	C = new Array(); // Composers array for each hooked element in HTML (textarea, input text)
	InitTutor("floatTutor", "tutor.htm");
	    Initialize(parseInt(document.getElementById('txtLanguage').options[document.getElementById('txtLanguage').selectedIndex].value),
							document.getElementById('txtKeyboard').options[document.getElementById('txtKeyboard').selectedIndex].value);
    setActivationKey(145); //to toggle language on SrcLk
}

function unhku(e)
{
   var i;
  if(C!=null)
   {
    for(i=0;i< C.length;i++)
    {
        //Finding the the composer corresponding to the element in which the key pressed
        if(this == C[i].ptr)
        {
            break;
        }
    }


    if(i<C.length)
    {
        C[i].unhku(e);
    }
   }
    //setCounts(e);
}
/*WSU-22 : Following functions added for exporting calls*/
function isDiv(id)
{
    var bDiv;

	var obj = document.getElementById(id);

    return ((document.getElementById(id)).nodeName == "Div");
}

function countChars(id)
{
    if(isDiv(id))
      cMCount = document.getElementById(id).innerHTML.length;
    else
      cMCount=document.getElementById(id).value.length;
    return cMCount;
}
function countWords(id)
{
   var inputstring,cntWord;
   var wCount=new Array()
   var htmlWCount=new Array();
    var tempint = 0,whcount = 0, htmlword;
    if(isDiv(id))
    {
      inputstring=document.getElementById(id).innerHTML;

        if(inputstring=="<br>" || inputstring=="<P>&nbsp;</P>")
        {
            whcount=0;
        }
        if (navigator.userAgent.search("Firefox") >= 0)
        {
           htmlWCount=inputstring.split("<br>")
        }
        else if (navigator.userAgent.search("Chrome") >= 0)
        {
            htmlWCount=inputstring.split("<div>")
        }
        else /* if (navigator.userAgent.search("MSIE") >= 0)*/
        {
            htmlWCount=inputstring.split("<P>")

        }
        while(tempint < htmlWCount.length)
        {
            htmlword = htmlWCount[tempint].split(" ");
            if(htmlword[0] != "" || htmlword[0]!="<br>" || htmlword[0]!="<P>&nbsp;</P>")
            {
                if(htmlword[htmlword.length-1] == "")
                    whcount = whcount + htmlword.length-1;
                else whcount = whcount + htmlword.length;
            }
            tempint++;
        }
        cntWord=whcount;
    }
    else
    {
      inputstring=document.getElementById(id).value;
      if(inputstring!=" ")
      {
        wCount=inputstring.split(" ");

        var itrMulti;
        var cntSpaces=0;
        //   WSU-34 : filtered splitted array for spaces and got correct count of words with additional spaces
        for(itrMulti=0;itrMulti<wCount.length;itrMulti++)
        {
            //Mrudu:Check if browser is IE,then use regular expression
            if(navigator.userAgent.search("MSIE") >= 0)
            {
                if(wCount[itrMulti].toString().replace(/^\s+|\s+$/g, '')=="")
                {
                    cntSpaces++;
                }
            }
            else
            {
                if(wCount[itrMulti].trim()=="")
                {
                    cntSpaces++;
                }
            }
        }
        var wordCount = wCount.length-cntSpaces;

        cntWord=wordCount;

      }
    }
    return cntWord;
}

function countLines(id)
{
    var inputstring;
    var htmlWCount=new Array();
    var lCont=new Array();
    var cntLine=0;
    var tempint = 0,whcount = 0, htmlword;
    if(isDiv(id))
    {
        inputstring=document.getElementById(id).innerHTML;
        if(inputstring=="<br>" || inputstring=="<P>&nbsp;</P>")
        {
            whcount=0;
        }
        if (navigator.userAgent.search("Firefox") >= 0)
        {
           htmlWCount=inputstring.split("<br>")
        }
        else if (navigator.userAgent.search("Chrome") >= 0)
        {
            htmlWCount=inputstring.split("<div>")
        }
        else /* if (navigator.userAgent.search("MSIE") >= 0)*/
        {
            htmlWCount=inputstring.split("<P>")

        }

        cntLine=htmlWCount.length-1;
    }
    else
    {
            var lineHt =parseInt(document.getElementById(id).style.lineHeight);
           //Mrudu:If browser is IE,then use textarea's scrollheight directly
            if(navigator.userAgent.search("MSIE") >= 0)
            {
                var nooflines = Math.floor(document.getElementById(id).scrollHeight/lineHt);
                cntLine = nooflines - 1;
            }
            else
            {
                 //Mrudu:added newDiv which will be clone for textarea and
                //take its scrollHeight to calculate lineCount
                var nDiv=document.createElement("textarea");
                nDiv.id = "newText";
                nDiv.value = document.getElementById(id).value;
                nDiv.style.height = document.getElementById(id).value.length;
                nDiv.style.width=document.getElementById(id).style.width;
                nDiv.style.fontFamily = "USUBAK";
                nDiv.style.fontSize =document.getElementById(id).style.fontSize;
                nDiv.style.lineHeight = document.getElementById(id).style.lineHeight;
                document.body.appendChild(nDiv);

                var nooflines = Math.floor(document.getElementById("newText").scrollHeight/lineHt);
                cntLine = nooflines - 1;
                document.body.removeChild(nDiv);
            }
    }
    return cntLine;
}

/*WSU-02 : number of words and number of lines are displayed through this function */
function setCounts()
{
    var  smulti;
    var nooflines;
    //character count for multiline
    //WSU-57
    if(null!=document.getElementById("myTextArea"))
        cMCount= document.getElementById("myTextArea").value.length-1;
    //character count for single line
    if(null!=document.getElementById("myInput"))
        cSCount= document.getElementById("myInput").value.length;
    //character count for div
    if(null!=document.getElementById("editor"))
        cECount=document.getElementById("editor").innerHTML.length;
    if(null!=document.getElementById("myTextArea"))
    {
        if (document.getElementById("myTextArea").value == "" || document.getElementById("myTextArea").value == "\n")
            cMCount = 0;
    }
    if(null!=document.getElementById("myInput"))
    {
        if (document.getElementById("myInput").value == "") cSCount =0;
    }
    if(null!=document.getElementById("editor"))
    {
        if (document.getElementById("editor").innerHTML == "") cECount =0;
    }

    if (null != document.getElementById("multiLineCharCnt"))    // Anjali 7-Jul-2015
        document.getElementById("multiLineCharCnt").innerHTML = cMCount

    if (null != document.getElementById("singleLineCharCnt"))    // Anjali 7-Jul-2015
        document.getElementById("singleLineCharCnt").innerHTML = cSCount

    if (null != document.getElementById("htmllinecharcnt"))    // Anjali 7-Jul-2015
        document.getElementById("htmllinecharcnt").innerHTML  =cECount

    //word count for single line
    //WSU-57
    if(null!=document.getElementById("myInput"))
        inputstring= document.getElementById('myInput').value
   var wCount=new Array()
   wCount=inputstring.split(" ")
   if (null != document.getElementById("singleLineWordCnt"))    // Anjali 7-Jul-2015
   {
     if(cSCount == 0 )
     {
       document.getElementById("singleLineWordCnt").innerHTML=0;
     }
     else {document.getElementById("singleLineWordCnt").innerHTML=wCount.length;}
   }

   //Counting words for multiline
   if(null!=document.getElementById("myTextArea"))
    smulti = document.getElementById('myTextArea').value

   var multiWCount=new Array()
   multiWCount=smulti.split(" ")
   var itrMulti;
   var cntwrd=0;//multiWCount.length;
//   WSU-34 : filtered splitted array for spaces and got correct count of words with additional spaces
   for(itrMulti=0;itrMulti<multiWCount.length;itrMulti++)
   {
    //Mrudu:For IE,split doesn't work hence regular expressions used
    if(navigator.userAgent.search("MSIE") >= 0)
    {
     if(multiWCount[itrMulti].toString().replace(/^\s+|\s+$/g, '')=="")
     {
        cntwrd++;
     }
    }
    else
    {
        if(multiWCount[itrMulti].trim()=="")
    {
      cntwrd++;
    }
    }


   }
var wordCount = multiWCount.length - cntwrd;
if (null != document.getElementById("multiLineWordCnt"))    // Anjali 7-Jul-2015
{
    if (cMCount == 0) {
        document.getElementById("multiLineWordCnt").innerHTML = 0;
    }
    else document.getElementById("multiLineWordCnt").innerHTML = wordCount; //multiWCount.length;
}
   multiWCount = smulti.split("\n");

   //Line and word counting for div tag
   //WSU-57
   if(null!=document.getElementById("myTextArea"))
       nooflines = Math.floor(document.getElementById('myTextArea').scrollHeight / 70);

   if (null != document.getElementById("multiLineLineCnt"))    // Anjali 7-Jul-2015
    document.getElementById("multiLineLineCnt").innerHTML= nooflines-1;

   var shtml;
   var htmlWCount=new Array()
   var tempint = 0, whcount = 0;
   var htmlword;
   //WSU-57
   if(null!=document.getElementById("editor"))
    shtml=document.getElementById('editor').innerHTML


   if (navigator.userAgent.search("Firefox") >= 0)
   {
     htmlWCount=shtml.split("<br>")
   }
   else if (navigator.userAgent.search("Chrome") >= 0)
   {
     htmlWCount=shtml.split("<div>")
   }
   else /* if (navigator.userAgent.search("MSIE") >= 0)*/
   {
    htmlWCount=shtml.split("<P>")

   }

   if(null!=document.getElementById("editor"))
     nooflines = Math.floor(document.getElementById('editor').scrollHeight/70);

   if(null!=document.getElementById("htmlLineCnt"))
     document.getElementById("htmlLineCnt").innerHTML= nooflines-1;

   while(tempint < htmlWCount.length)
    {
       htmlword = htmlWCount[tempint].split(" ");
       if(htmlword[0] != "")
       {
          if(htmlword[htmlword.length-1] == "")
           whcount = whcount + htmlword.length-1;
          else whcount = whcount + htmlword.length;
       }
       tempint++;
   }

   if (null != document.getElementById("htmlWordCnt"))    // Anjali 7-Jul-2015
    document.getElementById("htmlWordCnt").innerHTML=whcount

}

function plugin0()
{
    return document.getElementById('plugin0');
}
function readFile(id)
{
  var plugin = plugin0;
  var plugin1 = plugin();

 if(plugin1.valid)
 {
    var res = plugin1.readFromFile();
    var ele=document.getElementById(id);
    ele.disabled = false;
    if(ele.tagName && ele.tagName.toLowerCase() == "textarea")
    {
       ele.value = res;
    }
    else if(ele.tagName && ele.tagName.toLowerCase() == "input" && ele.type.toLowerCase() == "text")
    {
       ele.value = res;
    }
 }
 else
 {
    alert('Plugin failed to read');
 }
}
function pluginValid(id)
{
    var plugin = plugin0;
    var plugin1 = plugin();
    if(plugin1.valid)
    {
        var tempBuffer = "ppp";
        var ele=document.getElementById(id);
        ele.disabled = true;
        if(ele.tagName && ele.tagName.toLowerCase() == "textarea")
        {
            tempBuffer = ele.value;
        }
        else if(ele.tagName && ele.tagName.toLowerCase() == "input" && ele.type.toLowerCase() == "text")
        {
            tempBuffer = ele.value;
        }
        else
        {
            alert("Spell Checking Not Supported !");
        }
        var op = plugin1.checkSpell(tempBuffer);
        ele.disabled = false;
        ele.value = op;
    }
    else
    {
        alert("Plugin is not working :(");
    }
}


//function to set activation key
function setActivationKey(key)
{
    if(key==145 || key==20 || key==144)
    {
        
		activeKey = key;
    }
    else
    {
        alert("Activation key can be SCROLL LOCK or CAPS LOCK or NUM LOCK only!!");
    }
}

//function to allow counting of chars,words and lines
function allowCounting(val)
{
    flDoCount = val;
}

//function to get version
function getVersion()
{
    return "1.0.0.5";
}

//functionality:-this function filters input string,gets all unicode chars and copy them to clipboard
function copyUnicodeText(ip)
{
    var k;
    var op="";
    for(k=0;k<ip.length;k++)
    {
        if((ip.charCodeAt(k) >= 0 && ip.charCodeAt(k) <= 255) || (ip.charCodeAt(k) >= 2304 && ip.charCodeAt(k) <= 2431) ||
            (ip.charCodeAt(k) >= 8192 && ip.charCodeAt(k) <= 8303))
        {
            op+=String.fromCharCode(ip.charCodeAt(k));
        }
    }
    clipBoardBuffer = op;
}

// WSU-68
//function to allow/deny external data copy paste
function setCopyPasteOption(bOption)
{
    bCopyPaste = bOption;
}

// sagar  3-5-2016
// function to set fontsize

function SetColumnCentimeter() {
    var lines = document.getElementById('lblLines');
    var txtLineSpacing = document.getElementById('txtLineSpacing');
    var txtFontSize = document.getElementById('txtFontSize');
    var colcm = document.getElementById('lblColumnCm');
    var columns = document.getElementById('hdnColumns');
    if (lines != null && txtLineSpacing != null && colcm != null) {
        colcm.innerText = Math.round(parseFloat(lines.innerText) * (parseFloat(txtFontSize.value) + parseFloat(txtLineSpacing.value)) * 2.54 / 72 * 1000) / 1000;
        var txtColumnCm = document.getElementById('txtColumnCm');
        if (txtColumnCm != null) {
            txtColumnCm.value = colcm.innerText;
        }
        if (columns != null) {
            colcm.innerText = Math.round(parseFloat(colcm.innerText) / parseInt(columns.value) * 10000) / 10000 + "*" + columns.value;
        }
    }
}

function ComposeAttributeString(txtWebSamCtrl) {
    if (txtWebSamCtrl != null)
        return txtWebSamCtrl.FontSize + "," + txtWebSamCtrl.ILFontSize + "," + txtWebSamCtrl.ZoomFactor;
    return "0,0,0";
}
function SetCalculatedValues() {
    if (document.all["AxtxtPreview"] != null) {
        SetLines();
        SetColumnCentimeter();
        if (parseInt(SetCharacterCount()) == 0) {
            ResetColumnCm();
        }
    }
}
function increaseFontSize() {
    var p = document.getElementsByTagName('div');
    for (i = 0; i < p.length; i++) {
        if (p[i].style.fontSize) {
            var s = parseInt(p[i].style.fontSize.replace("px", ""));
        } else {
            var s = 12;
        }
        if (s != max) {
            s += 1;
        }
        p[i].style.fontSize = s + "px"
    }
}
function decreaseFontSize() {
    var p = document.getElementsByTagName('div');
    for (i = 0; i < p.length; i++) {
        if (p[i].style.fontSize) {
            var s = parseInt(p[i].style.fontSize.replace("px", ""));
        } else {
            var s = 12;
        }
        if (s != min) {
            s -= 1;
        }
        p[i].style.fontSize = s + "px"
    }
}

var editor1 = document.getElementById("editor");

//change font style
function changeFont1(txt1, change1) {
    var editor1 = document.getElementById(txt1);

    //for fontsize
    if (change1 == 'fontSize1') {
        var fsize1 = document.getElementById("fsize1");
        var fontSize1 = fsize1.value;
        editor1.style.fontSize = fontSize1 + "px";
    }
}


        var langcode = 0;            //Mrudu:variable for storing selected language
        var kb = document.getElementById('txtKeyboard').value;  //Mrudu:variable for storing selected keyboard
        var cMCount = 0;
        var cSCount = 0;
        var cECount = 0;
        /*
        WSU-01:This function will hook a selected keyboard type & unhook the previous one
        */
        function changeKB() {
            unhook();
            kb = document.getElementById('txtKeyboard').value;
			langcode = Number(document.getElementById('txtLanguage').value);
            Initialize(langcode, kb);
        }

        /*WSU-01:
        This function changes
        the language when
        selection is changed from combobox
        */
        function setLang() {
			//remove hook
			unhook();

			//set language code
			langcode = Number(document.getElementById('txtLanguage').value);
			//set list of keyboards for selected language
			document.getElementById('txtKeyboard').disabled = false;
			document.getElementById('txtKeyboard').visible = true;
			listKeyboards(langcode);

			switch(langcode) {
				case DEV:	//get XML data for selected language
					kb = document.getElementById('txtKeyboard').value;
					Initialize(langcode, kb);
					document.getElementById('txtKeyboard').value = kb;
					break;
				case GUJ:break;
				case BAN:break;
				case KAN:break;
				case TEL:
					//get XML data for selected language
					kb = document.getElementById('txtKeyboard').value;
					Initialize(langcode, kb);
					document.getElementById('txtKeyboard').value = kb;
					break;
				case TAM:break;
					//get XML data for selected language
				//	kb = "Tam99";
				//	Initialize(langcode, kb);
				//	document.getElementById('txtKeyboard').value = "Tam99";
					break;
				case ENG:break;
				case PUN:break;
				case ORI:break;
				case MAL:break;
				case ASS:break;
				case URD:
				if (window.location.hostname.indexOf("telanganalegislature.org.in") >= 0 
						|| window.location.hostname.indexOf("localhost") >= 0 
						|| window.location.hostname.indexOf("demo6.cgg.gov.in") >= 0  ) {
				
						kb = document.getElementById('txtKeyboard').value;
						Initialize(langcode, kb);
						document.getElementById('txtKeyboard').value = kb;
						}
						break;
				default:
					//for all these language default is English
					document.getElementById('txtKeyboard').disabled = true;
					document.getElementById('txtKeyboard').visible = false;
                    break;
			}
        }

        function changeLang(e) {
            var evt = e ? e : event;
            var kcode = evt.keyCode;
            var inputstring;
			unhook();
            if (kcode == activeKey) {
                setLang();
            }

        }

        function hook(obj) {
		if (document.getElementById('txtLanguage').value == 0) 	return;
               if (!dlc())  return false;
			   if(!hnc()) return false;
			var isDiv;


			if(obj.tagName == "DIV" || obj.tagName == "BODY")
			{
				isDiv = true;
			}
			else
				isDiv = false;

			HookControl(obj, parseInt(document.getElementById('txtLanguage').options[document.getElementById('txtLanguage').selectedIndex].value), isDiv);

        }
        function unhook() {
			var ctrls = C.length;
			//unhook all controls
			for (var j = 0 ; j<ctrls; j++)
			{
				UnhookControl(C[0].ptr);
			}
        }

        function Language(strLanguage) {
            Initialize(parseInt(strLanguage), document.getElementById('txtKeyboard').options[0].value);
        }
        function Keyboard(stKeyboard) {
            Initialize(parseInt(document.getElementById('txtLanguage').options[document.getElementById('txtLanguage').selectedIndex].value), stKeyboard);
        }
        function DisplayHideTutor(bShow) {
            ShowTutor(bShow);
        }
        function listKeyboards(script) {
            var strkeyboards = getAvailableKeyboards(script);
            document.getElementById("txtKeyboard").options.length = 0;

            for (i = 0; i < strkeyboards.length; i++) {
                document.getElementById("txtKeyboard").options[document.getElementById("txtKeyboard").options.length] = new Option(strkeyboards[i], strkeyboards[i]);
                //var oOption = document.createElement("OPTION");
                //oSelect.options.add(oOption);
                //document.getElementById("txtKeyboard").options.add(oOption,i);
                //oOption.innerText = arrKeyboards[index][i];
                //oOption.value = arrKeyboards[index][i];
            }
        }
        var load = 0;
        function Upper() {
            if ((null == document.getElementById("editor")) || (null == document.getElementById("htmlText"))) return;
            document.getElementById("htmlText").value = document.getElementById("editor").innerHTML;
        }
        function listKbds() {

            var script = parseInt(document.getElementById('txtLanguage').options[document.getElementById('txtLanguage').selectedIndex].value);
            listKeyboards(script);
        }

        function findMyText(find, replace, id) {
            alert('findmytext');
            var haystackText = "";
            var newFind = "";
            var cnt = 0;
            if (find.length == 0) {
                alert('Enter Text');
            }
            if (haystackText.length == 0) {
                /*WSU-10 : call given to removeFind method
                which clears the previous highlighting
                */
                removeFind();
                if (null == document.getElementById("editor")) return;
                haystackText = document.getElementById("editor").innerHTML;
            }

            var match = new RegExp(find, "ig");
            var replaced = "";

            //if (replace.length > 0) {
            if (id == "btnreplace") {
                if (replace.length > 0) {
                    replaced = haystackText.replace(match, replace);
                }
                else alert('Enter Text');

            }
            else {
                var boldText = "<div id=\"cDiv\" style=\"background-color: yellow; display: inline; font-weight: bold;\">" + find + "</div>";
                replaced = haystackText.replace(match, boldText);

            }
            if (replaced != "") {
                if (null == document.getElementById("editor")) return;
                document.getElementById("editor").innerHTML = replaced;
            }
            /*WSU-10 : call given to setCounts
            show correct character count
            */
            setCounts();

        }
		
		function hnc()
{
	
	if (!dlc())
		
		return false;
	
	var hn = window.location.hostname;
	//check for approved host name
		
	 if( (hn.indexOf("localhost") == -1) && (hn.indexOf("shreenews.com") == -1) )
	//if( (hn.indexOf("localhost") == -1) )
	{
		alert("Language typing is not licensed to this domain. Please contact support@modular-infotech.com for further assistance.");
		return false;
}
	return true;
}


        function removeFind() {
            if (null == document.getElementById("editor")) return;
            var parent = document.getElementById("editor");
            var child = parent.children;
            var txt;
            var i;
            if (child) {
                for (i = 0; i < child.length; i++) {
                    if (child[i].id == "cDiv") {
                        document.getElementById(child[i].id).parentNode.insertBefore(document.getElementById(child[i].id).firstChild, document.getElementById(child[i].id));
                        document.getElementById(child[i].id).parentNode.removeChild(document.getElementById(child[i].id));
                        i--;
                    }
                }
            }
        }
        function myTextArea_onclick() {
            //alert('halloe');
            setCounts();
        }

	function beginDrag(elementToDrag, event){
	var deltaX = event.clientX - parseInt(elementToDrag.style.left);
	var deltaY = event.clientY - parseInt(elementToDrag.style.top);
	if (document.addEventListener){
		document.addEventListener("mousemove", moveHandler, true);
		document.addEventListener("mouseup", upHandler, true);
	}
	else if (document.attachEvent){
		document.attachEvent("onmousemove", moveHandler);
		document.attachEvent("onmouseup", upHandler);
	}
	else {
	//local variables destroyed on disappearance of scope
		var oldmovehandler = document.onmousemove;
		var olduphandler = document.onmouseup;
		document.onmousemove = moveHandler;
		document.onmouseup = upHandler;
	}
	if (event.stopPropagation) event.stopPropagation();
	else event.cancelBubble = true;
	if (event.preventDefault) event.preventDefault();
	else event.returnValue = false;
	function moveHandler(e){
		if (!e) e = window.event;
		elementToDrag.style.left = (e.clientX - deltaX) + "px";
		elementToDrag.style.top = (e.clientY - deltaY) + "px";
		if (e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}
	function upHandler(e){
		if (!e) e = window.event;
		if (document.removeEventListener){
			document.removeEventListener("mouseup", upHandler, true);
			document.removeEventListener("mousemove", moveHandler, true);
		}
		else if (document.detachEvent){
			document.detachEvent("onmouseup", upHandler);
			document.detachEvent("onmousemove", moveHandler);
		}
		else {
			document.onmouseup = olduphandler;
			document.onmousemove = oldmovehandler;
		}
		if (e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}
}



function translateNumerals(input, target) {
    var systems = {
            dev: 2406, tam: 3046, kan:  3302,
            tel: 3174, mal: 3430, ori: 2918, gur: 2662, guj: 2790, urd: 1776
        },
        zero = 48, // char code for Arabic zero
        nine = 57, // char code for Arabic nine
        offset = (systems[target.toLowerCase()] || zero) - zero,
        output = input.toString().split(""),
        i, l = output.length, cc;

    for (i = 0; i < l; i++) {
        cc = output[i].charCodeAt(0);
        if (cc >= zero && cc <= nine) {
            output[i] = String.fromCharCode(cc + offset);
        }
    }
    return output.join("");
}


function dlc()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }
    today = mm + '/' + dd + '/' + yyyy;
    var ed = demodate;
    if (Date.parse(ed) < Date.parse(today)) {
        alert("Demo License has expired. Please contact Modular Infotech Pvt Ltd.");
        return false;
    }
    return true;
}


