README.md
# Google Chrome Extension: Ext_SearchLanguage

## AI: Codex: GPT 3.5

## Initial Prompt
Create a Google Chrome extension named "Ext_SearchLanguage"
The function of the extension is to append required url params to any url that is entered in the address bar for google search queries.
The extenstion should have a UI with one checkbox labeled "Enabled" The value is a boolean value. The default value is false.
When the checkbox is enabled, the value should be true. When it is disabled the value should be false.
A Google search query is defined as a url with the domain: google.com, path: "search", and a url param: "q".  Here is an example: "https://www.google.com/search?q=this+is+a+search"
Only if the url in the address is a Google search query apply the following instructions:
1. When the checkbox value is true set the url parameter key "gl" to "us" and the url parameter "hl" to "en" before completing the request.
2. When the checkbox value is false remove the url paramter keys "gl" and "us"  before completing the request.

## Installation
In Google Chrome load it via chrome://extensions → Load unpacked → << navigate to the extension files >>

