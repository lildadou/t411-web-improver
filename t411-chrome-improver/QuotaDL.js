getSettings(function(settings) {
	if ( ! settings.ratioBar.dispQuota) { console.log('RatioBar.dispQuota est désactivé'); return; }

	injectScript("common.js");
	
	var targetRatio	= settings.ratioBar.targetRatio;
	var loginBar	= document.querySelector(".loginBar");
	var QtUploadElm	= loginBar.querySelector(".up");
	var QtUpload	= getBytes(QtUploadElm.textContent.substring(2));
	var QtDownload	= getBytes(loginBar.querySelector(".down").textContent.substring(2));
	var quotaRestant= (QtUpload/targetRatio) - QtDownload;
	
	var quotaHtml	= document.createElement('strong');
	quotaHtml.style.color = "#C46500";
	quotaHtml.textContent = '↑↓ '+toHumanBytes(quotaRestant)+' ';
	QtUploadElm.parentElement.insertBefore(quotaHtml, QtUploadElm);
	QtUploadElm.parentElement.insertBefore(document.createTextNode('/ '), QtUploadElm);
});