getSettings(function(settings) {
	if ( ! settings.forcehttps.interne) return;

	var httpsableDomains = new RegExp("http://((www|wiki|forum).)?t411.me/");
	var unsecuredTarget = document.querySelectorAll('a[href^="http://"]');
	var qtCorrectedUrls=0;
	for (var i=0; i< unsecuredTarget.length; i++) {
		var aLink=unsecuredTarget[i];
		if (httpsableDomains.exec(aLink.href)) {
			aLink.href = "https"+aLink.href.substring(4);
			qtCorrectedUrls++;
		}
	}
	console.log("T411-Improver a corrigé "+qtCorrectedUrls+" urls non-sécurisées sur "+unsecuredTarget.length);

});