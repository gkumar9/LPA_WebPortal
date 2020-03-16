<%@ Page Language="C#" AutoEventWireup="true" CodeFile="test.aspx.cs" Inherits="Test" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">--%>
<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <title>Test Websamhita Unicode Editor</title>
<meta http-equiv="Content-Type" content="text/html;charset=csUnicode" />





<%--	<script type="text/javascript" src="/websamhitaUniFull/cookie.min.js"></script>
--%> 
<style>
#editor {
            height: 100%;
            width: 500px;
            overflow: auto;
         }
</style>   
    
</head>
<body onload="initdef();setActivationKey(145);">
<form NAME="myForm">
  <select id="txtLanguage" onchange="setLang();"  >
    <option value="0" >English</option>
    <option value="1" selected="selected">Marathi</option>
  </select>
    <select id="txtKeyboard" onchange="changeKB()">
        <option value="Phonetic">Phonetic</option>
        <option value="Inscript">Inscript</option>
        <!-- <option value="Ramington">Ramington</option> -->
        <!--<option value="Network">Network</option> -->
        <option value="Typewrit">TypeWrit</option>
        <option value="Modular">Modular</option>
        <option value="Godrej">Godrej</option>
        <!--<option value="Ramington2">Ramington2</option> -->
    </select>
    &nbsp;&nbsp;
  <br />
  <br />
  <table style="border-right: black 1px groove; border-top: black 1px groove;border-left: black 1px groove; border-bottom: black 1px groove;">
    <tr >
      <td style="width: 145px">
        <label id="keybdtr" style="vertical-align: middle; text-align: center">Keyboard Tutor : &nbsp;<img src="tutor.jpg" onclick="DisplayHideTutor(true);" style="width: 24px; height: 24px" />&nbsp;
        </label>
      </td>
    </tr>
  </table>
  
  <table >
    <tr>
    </tr>
    <input id="Button1" type="button" value="Show Char,Word Count" onclick="return Button1_onclick()" /><br />
    
    <input type="button" onclick="setLang();" value="Init Unicode" id="Button2"/>
    <input type="submit" id="btnReload" value="Set in Cookie And Reload" onclick="return reloadAndSet()"/>
    <input type="button" onclick="setCookieVals()" value="Fetch Old values" id="Button3"/>
	<a href="#" style="padding: 2px; display: inline-block; background: #eee; border: 1px solid black;" onclick="javascript:wrap_pluginValid('myTextArea')">spellcheck</a>
    <tr>
      <td>
        <b>Multi Line</b>
      </td>
      <td>
	  
        <textarea name="myTextArea" id ="myTextArea" style="line-height:70px;font-family:USUBAK;font-size:40px;width:840px;height:550px;" onfocus="hook(this);" >नवी दिल्ली : बुलेट ट्रेनच्या मार्गात काटेच काटे दिसत असतानाच पूर्ण स्वदेशी बनावटीच्या व इंजिनविरहीत "ट्रेन-एटीन' म्हणजेच "टी-18'च्या चाचण्यांना आजपासून सुरवात झाली. ताशी 160 किलोमीटर वेगाने धावण्यासाठी या गाड्या सक्षम आहेत. पुढील महिन्यापासूनच सध्याच्या शताब्दी गाड्यांच्या जागी टप्प्याटप्प्याने नव्या गाड्या चालविण्याचा रेल्वेचा मानस आहे. यापाठोपाठ सध्याच्या राजधानी गाड्यांच्या जागी येणाऱ्या प्रस्तावित "ट्रेन-20' गाड्यांची तयारीही रेल्वेने वेगाने सुरू केली आहे. "सकाळ'ने याबाबतचे वृत्त याआधीच दिले आहे. 
        </textarea>
        <br />
		
        <label name = "multiLineChars"><b>Ch:</b></label><label id="multiLineCharCnt">0</label>
        <label name = "multiLineWords"><b>Words:</b></label><label id="multiLineWordCnt">0</label>
        <label name = "multiLineLines"><b>Lines:</b></label><label id="multiLineLineCnt">0</label>
      </td>
      <td>
      </td>
    </tr>
  </table>

  <div id="divfnr" style="position:absolute;background-color:White;display:none;width:600;vertical-align:top;">
     Find <input id="find" name="find" style="height:17px;" type="text" onkeydown="hKd(event)"/>
    Replacement
    <input id="replace" name="replace" style="height:17px;" type="text"/>
    <input type="button" value="Find" id="btnfind" style="height:17px; font-size:xx-small;" onclick="findMyText(document.getElementById('find').value, document.getElementById('replace').value,'btnfind');"/>
    <input type="button" value="Replace" id="btnreplace" style="height:17px;font-size:xx-small;" onclick="findMyText(document.getElementById('find').value, document.getElementById('replace').value,'btnreplace');"/>
    <img src="imgs/close.png" onclick="FnR('imgclose');" id="imgclose" title="Close" alt="Close"/>
  </div>
  <object id="plugin0" type="application/x-spellcheckplugin" width="100" height="30">
  </object>
  <div id="floatTutor" style="font-family:USUBAK;"></div>
  <br />
  <br />
  <b>This Textarea is used only for showing messages and not for composing.</b>
  <textarea id="TextArea1" cols="20" rows="2"></textarea>
  <input id="copyButton" type="button" value="Copy Unicode Data" onclick="wrap_copyUnicodeText(document.getElementById('myTextArea').value);" />
  
  <div contenteditable="true">
							</div>
</form>
    
    <a href="#" onclick="javascript:wrap_readFile('myTextArea')">Get corrected data</a>

<script type="text/javascript" src="Unicode.js"></script>
<script type="text/javascript" src="wrapperJS.js"></script>
</body>
</html>