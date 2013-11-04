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
		
		$.ajax({
            url: '/mailbox/compose/',
            type: 'post',
            data: {
            	'receiverName'	: username,
            	'subject'		: 'Quelqu\'un a répondu à l\'un de vos commentaires',
            	'msg'			: messageBody,
            	'save'			: 'on'
            },
            success: function(){ console.log("Message envoyé avec succès à "+username);}
        });
	}
	
	noticeBody += (userTags.length == 1)
			?' a été prévenu de votre réponse'
			:' ont été prévenus de votre réponse';
	Messages.addNotice(noticeBody);
});

console.log("Module torrentComsResponse activé");