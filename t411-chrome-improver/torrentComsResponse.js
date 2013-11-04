// Finds all occurences of a substring in a string using a regular expression
// Similar to real JavaScript RegExp match with 'g' modifier
// @author: http://dontpanic82.blogspot.fr/2009_04_01_archive.html
String.prototype.matchAll = function( regExp ){
 // The input String 
 var string = this;
 
 // Find all matches/add to matches-array  
 var matches = [];
 while( string.match( regExp ) ){
  matches.push( string.match( regExp )[0] );
  string = string.replace( regExp, '' );
 }
 return matches;
};

/**Encode les données envoyées au serveur en iso-8859-1
 * plutôt qu'en UTF-8
 * @param formData {Object|String}
 */
function formDataISOEncode(formData) {
	var stringEncoder = function(s) { return escape(s); };
	switch (typeof(formData)) {
	case 'string': return stringEncoder(formData);
	case 'object':
		var result = '';
		var isFirstEntry = true;
		for (var anEntry in formData) {
			if (isFirstEntry) isFirstEntry=false;
			else result += '&';
			result += anEntry+'='+stringEncoder(formData[anEntry].toString());
		}
		return result;
	default: return '';
	}
	return '';
}

// Permet d'envoyer automatiquement un MP aux personnes quotés
// lorsque l'on rédige un commentaire sur un torrent
$('#comment-form').submit(function(){
	var comment = $('#inputtext').val().trim();
	var userTags = comment.matchAll(/@(\w+)/);
	if (userTags.length <= 0) return;
	
	var torrentTitle = document.querySelector("div.torrentDetails>h2>span")
						.firstChild.textContent.trim();
	var messageBody	= 'Un utilisateur vous a mentionné sur le torrent "'+torrentTitle
	+'", voici son message:\n[quote]'+comment+'[/quote]\n';
	
	var noticeBody = "";
	for (var i=0; i<userTags.length; i++) {
		var username = userTags[i].slice(1); //On enleve le @
		
		// Pour la notice
		if (userTags.length == 1) noticeBody = username;
		else if (i <= 0) noticeBody = username;
		else if (i == userTags.length-1) noticeBody += " et "+username;
		else noticeBody += ', '+username;
		
		// Re-scopage pour Issue #3
		var subject = 'Quelqu\'un a répondu à l\'un de vos commentaires';
		
		(function() {
			var un = username;
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/mailbox/compose/', true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=ISO-8859-1");
			//xhr.overrideMimeType("application/x-www-form-urlencoded; charset=ISO-8859-1");
			xhr.onload = function() { console.log("Message envoyé avec succès à "+un); };
			xhr.send(formDataISOEncode({
				'receiverName':	username,
				'subject':		subject,
				'msg':			messageBody,
				'save':			'on'
            }));
		})();
	}
	
	noticeBody += (userTags.length == 1)
			?' a été prévenu de votre réponse'
			:' ont été prévenus de votre réponse';
	Messages.addNotice(noticeBody);
});

console.log("Module torrentComsResponse activé");