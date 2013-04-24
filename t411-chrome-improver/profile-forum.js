(function() {
	var icoT411ProfileUrl = chrome.extension.getURL("Contact-32.png");
	//var icoT411ProfileUrl = "http://www.t411.me/images/avatar/54/6505954_Phoenix10498.gif?18117";
	var pseudoTaker = /\/([^\/]+)$/;
	
	var buildForumProfileUrl = function(pseudo) {
		return "http://forum.t411.me/profile/"+pseudo;
	};
	
	var buildT411ProfileUrl = function(pseudo) {
		return "http://www.t411.me/users/profile/"+pseudo;
	};
	

	/** On recupere les balises de "meta-information" de tout les commentaires 
	 * ces balises contient l'avatar et le pseudo du posteur. Ces 2 elements sont 
	 * linké vers le profil du posteur. L'avatar est linké au profil du forum, le 
	 * pseudo à celui de t411...*/
	var metas = document.querySelectorAll('div.Meta');
	for (var i=0; i < metas.length; i++) {
		var divMeta = metas[i];
		
		// On change le lien sur le pseudo pour qu'il pointe vers le profil du forum
		// et on corrige celui de l'avatar qui ne fonctionne pas...
		var authorSection = divMeta.querySelector('span.Author');
		if (authorSection == null) continue;
		var pseudoLink = authorSection.querySelector('a[href^="//www.t411.me/users/profile/"]');
		var avatarLink = authorSection.querySelector('a.ProfileLink');
		var pseudo = pseudoTaker.exec(pseudoLink.href)[1];
		pseudoLink.href = buildForumProfileUrl(pseudo);
		avatarLink.href = buildForumProfileUrl(pseudo);
		
		// On ajoute ensuite l'icone qui sera linké vers le profil t411
		// <div><a href=profile_forum>pseudo</a><a href=profile_t411><img></a></div>
		var capsule = document.createElement("span"); capsule.style.display = "inline";
		var linkImage = document.createElement("a");
		var iconeImage = new Image();
		authorSection.appendChild(capsule);
		capsule.appendChild(pseudoLink);
		capsule.appendChild(linkImage);
		linkImage.appendChild(iconeImage);
		
		linkImage.href = buildT411ProfileUrl(pseudo);
		iconeImage.src = icoT411ProfileUrl;
		iconeImage.style.height="16px";
		iconeImage.style.width="16px";
		iconeImage.style.float="none";
		iconeImage.style["background-color"]="transparent";
	}



	/** On recupere les author-quotes (@pseudo) */
	var authorQuotes = document.querySelectorAll('div.Message > a[href^="/profile/"]');
	for (var i=0; i < authorQuotes.length; i++) {
		var anAuthorQuote = authorQuotes[i];
		var pseudo = pseudoTaker.exec(anAuthorQuote.href)[1];
		
		var capsule = document.createElement("span"); capsule.style.display = "inline";
		var linkImage = document.createElement("a");
		var iconeImage = new Image();
		anAuthorQuote.parentElement.insertBefore(capsule, anAuthorQuote);
		capsule.appendChild(anAuthorQuote);
		capsule.appendChild(linkImage);
		linkImage.appendChild(iconeImage);
		
		linkImage.href = buildT411ProfileUrl(pseudo);
		iconeImage.src = icoT411ProfileUrl;
		iconeImage.style.height="16px";
		iconeImage.style.width="16px";
		iconeImage.style.float="none";
		iconeImage.style["background-color"]="transparent";
	}

	/**Parcours les avatars pour leur mettre de la transparence
	 */
	var profilImgs = document.querySelectorAll('img.ProfilePhotoMedium');
	for (var i=0; i < profilImgs.length; i++) {
		var imgProfil = profilImgs[i];
		imgProfil.style["background-color"]="transparent";
	}	
})();