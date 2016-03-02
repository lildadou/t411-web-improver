getSettings(function(settings) {
	if ( ! settings.fastdownload.shortcut) return;
	
	// Ajout checkbox individuelle
	var allTorrents= document.querySelectorAll("table.results>tbody>tr");
	var dwnIco = chrome.extension.getURL("Download-64.png");
	for (var i=0; i<allTorrents.length; i++) {
		var nfoImg = new Image();
		nfoImg.src = "http://www.t411.ch/images/icon_nfo.gif";
		var nfoLink = allTorrents[i].querySelector("a.nfo");
		nfoLink.classList.remove("nfo");
		nfoLink.appendChild(nfoImg);
		
		var tId = /\d+$/.exec(nfoLink.href)[0];
		var dlLink = document.createElement("a");
		dlLink.href = "http://www.t411.ch/torrents/download/?id="+tId;
		dlLink.setAttribute("alt","Lien de téléchargement direct");
		var dlImg = new Image();
		dlImg.src = dwnIco;
		dlImg.width="16";
		dlLink.appendChild(dlImg);
		nfoLink.parentElement.appendChild(dlLink);
	}
});