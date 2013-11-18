injectScript("common.js");

var loginBar	= document.querySelector(".loginBar");
var QtUploadElm	= loginBar.querySelector(".up");
var QtUpload	= getBytes(QtUploadElm.textContent.substring(2));
var QtDownload	= getBytes(loginBar.querySelector(".down").textContent.substring(2));
var quotaRestant= (QtUpload/0.75) - QtDownload;

var quotaHtml	= document.createElement('strong');
quotaHtml.style.color = "#C46500";
quotaHtml.textContent = '↑↓ '+toHumanBytes(quotaRestant)+' ';
QtUploadElm.parentElement.insertBefore(quotaHtml, QtUploadElm);
QtUploadElm.parentElement.insertBefore(document.createTextNode('/ '), QtUploadElm);