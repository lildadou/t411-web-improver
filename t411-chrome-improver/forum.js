getSettings(function(settings) {
	// Icone de raccourci vers le profil utilisateur
	var icoT411ProfileUrl = chrome.extension.getURL("Contact-32.png");
	var pseudoTaker = /\/([^\/]+)$/;
	var buildForumProfileUrl = function(pseudo) { return "http://forum.t411.li/profile/"+pseudo; };
	var buildT411ProfileUrl = function(pseudo) { return "http://www.t411.li/users/profile/"+pseudo; };
	
	
	/** On recupere les balises de "meta-information" de tout les commentaires 
	 * ces balises contient l'avatar et le pseudo du posteur. Ces 2 elements sont 
	 * linké vers le profil du posteur. L'avatar est linké au profil du forum, le 
	 * pseudo à celui de t411...*/
	var improveProfilLinks = function() {
		var metas = document.querySelectorAll('div.Meta');
		for (var i=0; i < metas.length; i++) {
			var divMeta = metas[i];
	
			// #region Traitement des liens de profils dans les pages 'Catégories de discussions'
			var footResum = divMeta.querySelector('span.LastDiscussionTitle > a[href^="//www.t411.li/users/profile/"]');
			if (footResum != null) {
				var pseudo = pseudoTaker.exec(footResum.href)[1];
				footResum.href=buildForumProfileUrl(pseudo);
				
				var capsule = document.createElement("span"); capsule.style.display = "inline";
				var linkImage = document.createElement("a");
				var iconeImage = new Image();
				footResum.parentElement.insertBefore(capsule, footResum);
				capsule.appendChild(footResum);
				capsule.appendChild(linkImage);
				linkImage.appendChild(iconeImage);
				
				linkImage.href = buildT411ProfileUrl(pseudo);
				iconeImage.src = icoT411ProfileUrl;
				iconeImage.style.height="16px";
				iconeImage.style.width="16px";
				iconeImage.style.float="none";
				iconeImage.style["background-color"]="transparent";
			}
			// #endregion Traitement des liens de profils dans les pages 'Catégories de discussions'
			
			// On change le lien sur le pseudo pour qu'il pointe vers le profil du forum
			// et on corrige celui de l'avatar qui ne fonctionne pas...
			var authorSection = divMeta.querySelector('span.Author');
			if (authorSection != null) {
				var pseudoLink = authorSection.querySelector('a[href^="//www.t411.li/users/profile/"]');
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
		}
	};

	var linkProfileMentionned = function() {
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
	};
	
	/**Parcours les avatars pour leur mettre de la transparence
	 */
	var useAlphaAvatar = function() {
		var profilImgs = document.querySelectorAll('img.ProfilePhotoMedium');
		for (var i=0; i < profilImgs.length; i++) {
			var imgProfil = profilImgs[i];
			imgProfil.style["background-color"]="transparent";
		}
	};
	
	
	/** Parcours des liens dans les messages du forum
	 * pour les rendre visible.
	 */
	var makeVisibleLinks = function() {
		var bblinks = document.querySelectorAll('a.bbcode_url');
		for (var i=0; i<bblinks.length; i++) {
			var aBBLink=bblinks[i];
			aBBLink.style.textDecoration="underline";
			aBBLink.style.color="blue";
		}
	};
	
	
	/**Injection de l'éditeur bbcode WYSIWYG */
	var replaceBbcodeEditor = function() {
		// On charge le formulaire à injecter
		loadAppContent("wysiwyg-bbcode/form.html", function(xhr) {
			// Cette fonction sert à donner les emplacement des icones de la barre d'édition
			
			// Substitution des emplacements d'images
			var rImgBackGrnd = /background-image:url\('(.+)'\)/g;
			var formHtml = xhr.responseText.replace(rImgBackGrnd, function(g, rUrl) {
				return "background-image:url('"+chrome.extension.getURL(rUrl)+"')";
			});
			
			// On créer le nouvel éditeur
			var builder = document.createElement("div");
			builder.innerHTML = formHtml;
			
			// Injection
			var msgForm	= document.querySelector("div.MessageForm");
			var editorContainer = msgForm.parentElement;
			var newForm = builder.children[0];
			editorContainer.appendChild(newForm);
			
			// L'éditeur est créer, on va lui ajouter les inputs caché de l'éditeur d'origine
			var hiddenInputs = msgForm.querySelectorAll("input[type='hidden']");
			for (var i=0; i<hiddenInputs.length; i++) {
				newForm.appendChild(hiddenInputs[i]);
			}
			
			// On remplace l'ancien éditeur
			editorContainer.removeChild(msgForm);
			
			// Une fois le formulaire injecté, on injecte l'API
			// Quand l'API est chargé, on initialise le formulaire avec l'API
			injectScript("wysiwyg-bbcode/editor.js", function(){
				executeScriptOnPage('wswgEditor.initEditor("commentArea", true);');
			});
			injectStyle("wysiwyg-bbcode/editor.css");
		});
	};
	
	if (settings.forum.fixProfilLinks) improveProfilLinks();
	if (settings.forum.alphaAvatar) useAlphaAvatar();
	if (settings.forum.wysiwyg) replaceBbcodeEditor();
	if (settings.forum.linkMentions) linkProfileMentionned();
	if (settings.forum.underlineHref) makeVisibleLinks();
});