// Ce script a pour but d'injecter le code fonctionnel dans la page web
// ce qui entraine l'execution du-dit code.
getSettings(function(settings) {
	var scripts = [];
	if (settings.peerstats.use) scripts.push("common.js", "lib-peers-checker.js","details-peers-checker.js");
	if (settings.commentNotifier.signalMentionned) scripts.push("torrentComsResponse.js");

	for (var i=0; i<scripts.length; i++) injectScript(scripts[i]);
});