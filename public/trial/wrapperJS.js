/* This file containes all the exported calls for copy,paste,get contents,set contents,get cursor position,set cursor position,charcount,word count and line count
   Developer is supposed to call the functions wherever required.
IMP :- 1.In HTML page , input box must have id 'myInput'.
           2.In HTML page ,TextArea control must have id 'myTextArea'               
           3.In HTML page ,div tag must have id 'editor'.
*/

//gets character count of  'id' 
function wrap_charCount(id)
{
    return countChars(id);
}

//gets word count of  'id' 
function wrap_wordCount(id)
{
    return countWords(id);
}

//gets line count of  'id'
function wrap_lineCount(id)
{
    return countLines(id);
}

//sets data to clipboard
function wrap_setClipboardData(data)
{
    clipBoardBuffer = data;
}

//gets data from clipboard
function wrap_getClipboardData()
{
    return clipBoardBuffer;
}

//gets formatted contents from id
function wrap_getFormattedContents(id)
{
    var contents;
    if(isDiv(id))
        contents = document.getElementById(id).innerHTML;
          
    else
        contents = document.getElementById(id).value;
    return contents;
}

//gets plain contents from id
function wrap_getPlainContents(id)
{
    var contents;
    if(isDiv(id))
       contents = document.getElementById(id).innerText;
    else
       contents = document.getElementById(id).value;
    return contents; 
}

//sets formatted contents to id
function wrap_setFormattedContents(id,contents)
{
    if(isDiv(id))
        document.getElementById(id).innerHTML = contents;
    else
        document.getElementById(id).value = contents;
}

//sets plain contents to id
function wrap_setPlainContents(id,contents)
{
    if(isDiv(id))
        document.getElementById(id).innerText = contents;
    else
        document.getElementById(id).value = contents;
}
//sets position of cursor
//Change : this function requires id of control
function wrap_setCursorPosition(id,pos)
{
    globalG = pos;
    document.getElementById(id).selectionStart=pos;
    document.getElementById(id).selectionEnd = document.getElementById(id).selectionStart;

}

//gets position of cursor
function wrap_getCursorPosition()
{
    return globalG;
}

//wrapper function to show tutor
function wrap_showTutor(bShow)
{
    ShowTutor(bShow);
}
/*wrapper function for reading data from o/p file of spellcheck
Parameter:- id of the control where correct data is to be displayed
*/
function wrap_readFile(id)
{
    readFile(id);
}

/*wrapper function for spellcheck
Parameter:- id of control whose contents to be spell checked
*/
function wrap_pluginValid(id)
{
    pluginValid(id);
}

/*wrapper function for setting activation key
  Parameter :- key code for activation key
*/
function wrap_setActivationKey(key)
{
    setActivationKey(key);
}

/*wrapper function for allowing/denying char,line and word counting
  Parameter :- boolean value to allow/deny counting
*/
function wrap_allowCounting(val)
{
    allowCounting(val);
}

/*wrapper function for getting current version*/
function wrap_getVersion()
{
   return getVersion();
}
/*wrapper function for copying unicode text to clipboard*/
/*Parameter:- string input to be copied*/
function wrap_copyUnicodeText(ip)
{
    copyUnicodeText(ip);
}

// WSU-68
//wrapper function to allow/deny extrnal data copy/paste
//parameter:- boolean variable to allow/deny copy paste option
function wrap_setCopyPasteOption(bOption)
{
    setCopyPasteOption(bOption);
}
