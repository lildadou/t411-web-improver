/* api.allocine n'accepte que les connexions depuis des mobiles! Nous allons
 * donc devoir modifier le User-Agent de nos requête. Problème on ne peut pas faire
 * searchRequest.setRequestHeader('User-Agent', mdbproxy.allocine.user_agent);
 * car la spec de XHR l'interdit (et Chrome aussi)
 * 
 * Pour passer outre, nous allons faire quelque chose de très violent: utiliser
 * chrome.webRequest pour intercepter nos requêtes XHR et modifier le User-Agent
 */
var url_api			= 'http://api.allocine.fr/rest/v3/';
var user_agent		= 'Dalvik/1.6.0 (Linux; U; Android 4.2.2; Nexus 4 Build/JDQ39E)';

/**Change le User-Agent d'une webRequest de façon à ce 
 * qu'elle soit acceptée par le service AlloCiné.
 * @param details {WebRequest}
 */
var alloUserCorrector = function(details) {
	var isSuccess = false;
	for (var i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name === 'User-Agent') {
			details.requestHeaders[i].value = user_agent;
			isSuccess = true;
			break;
	   }
	}
    console.log("Allocine-API request intercepted ("+details.url+") with"+((isSuccess)?"":"out")+" success.");
     return {'requestHeaders': details.requestHeaders};
};

/* On demande à Chrome de nous prévenir et de retenir 
 * toutes requête à destination de AlloCiné juste 
 * avant qu'il envoie les headers.
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
	alloUserCorrector,
	{urls: [url_api+'*']},
	["blocking", "requestHeaders"]);