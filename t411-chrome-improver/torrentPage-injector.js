// Ce script a pour but d'injecter le code fonctionnel dans la page web
// ce qui entraine l'execution du-dit code.

var scripts = ["lib-peers-checker.js","details-peers-checker.js", "torrentComsResponse.js"];
for (var i=0; i<scripts.length; i++) injectScript(scripts[i]);
