
/**Parcours les liens vers des profil "forum" pour ajouter une icone
 * linké vers le profil t411
 */
var profilLinks = document.querySelectorAll('a[href^="/profile"]:not(.ProfileLink)'); //selection des liens profile
var profileIcoUrl = chrome.extension.getURL("Contact-32.png"); // URL de l'image du lien
var profileUrlFilter = /\/profile\/\d+\/([^\/]+)$/; // RegEx pour filtrer les URL de profile
for (var i=0; i < profilLinks.length; i++) {
	var fofoProfil = profilLinks[i];
	var extractedNickname = profileUrlFilter.exec(fofoProfil.href);
	if (extractedNickname) extractedNickname=extractedNickname[1];
	else continue; // pas URL profil, on zappe
	
	// Création des élément et imbrication
	// capsule(lien_profil, lien_profil_t411(image))
	var capsule = document.createElement("div");
	fofoProfil.parentElement.insertBefore(capsule, fofoProfil);
	capsule.appendChild(fofoProfil);
	var t411Href = document.createElement("a");
	capsule.appendChild(t411Href);
	var profImg = new Image();
	t411Href.appendChild(profImg);
	
	
	t411Href.href="http://www.t411.me/users/profile/"+extractedNickname;
	profImg.src = profileIcoUrl;
	// Pour éviter l'effet '2nd avatar'
	profImg.style.height="16px";
	profImg.style.width="16px";
	profImg.style.float="none";
	profImg.style["background-color"]="transparent";
}


/**Parcours les avatars pour leur mettre de la transparence
 */
var profilImgs = document.querySelectorAll('img.ProfilePhotoMedium');
for (var i=0; i < profilImgs.length; i++) {
	var imgProfil = profilImgs[i];
	imgProfil.style["background-color"]="transparent";
}


