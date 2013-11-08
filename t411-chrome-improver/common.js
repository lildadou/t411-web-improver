/**Charge de façon asynchrone une ressource via XHR
 * @param url {String}
 * @param onload {Function}
 * @returns {XmlHttpRequest}
 */
function loadContent(url, onload) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = function() {onload(xhr);};
	xhr.send();
	
	return xhr;
}

/** Charge de façon asynchrone une ressource contenu dans l'extension
 * @param filePath {String} Le chemin du fichier à charger
 * @param onload {Function} La fonction à appeller lorsque la ressource est chargée
 * @returns {XmlHttpRequest}
 */
function loadAppContent(filePath, onload) {
	return loadContent(chrome.extension.getURL(filePath), onload);
}

/** Injecte un script de l'extension dans la page. Le script est executé
 * à l'injection dans le contexte de page
 * @param filename
 * @param onload {Function}
 */
function injectScript(filename, onload) {
	var s = document.createElement("script");
	s.src = chrome.extension.getURL(filename);
	s.type	= "text/javascript";
	s.charset = 'UTF-8';
	if (onload) s.onload = onload;
	(document.head||document.documentElement).appendChild(s);
};

/**Injecte un script sous forme textuel dans la page.
 * @param textScript Le contenu du script
 * @param onload {Function}
 */
function executeScriptOnPage(textScript, onload) {
	var s = document.createElement("script");
	s.type	= "text/javascript";
	s.charset = 'UTF-8';
	s.textContent = textScript;
	if (onload) s.onload = onload;
	(document.head||document.documentElement).appendChild(s);
}

/**Injecte une feuille de style dans la page.
 * @param filename {String} Le chemin interne de la feuille de style
 */
function injectStyle(filename) {
	var s = document.createElement("link");
	s.href	= chrome.extension.getURL(filename);
	s.rel	= "Stylesheet";
	s.type	= "text/css";
	(document.head||document.documentElement).appendChild(s);
}

/**Donne le chemin relative de la page. Par exemple 
 * http://www.t411.me/lolcat/trucmuche retourne http://www.t411.me/lolcat/
 * @returns
 */
function getRelativeLocation() {
	return /^(.+\/)([^\/])*$/.exec(location.href)[1];
}

var dojo = {};
dojo.getProp	= function(canonProps, create, context, defaultValue) {
	if (canonProps.length<=0) return context;
	if (!context) throw new Error('no context');
	
	var prop = context[canonProps[0]];
	if (typeof(prop)!='undefined') return dojo.getProp(canonProps.slice(1), create, prop);
	else {
		if (create) {
			context[canonProps] = (canonProps.length > 1)?{}:(defaultValue)?defaultValue:null;
			return dojo.getProp(canonProps.slice(1), create, context[canonProps]);
		}
	}
};

dojo.set		= function(name, create, context, value) {
	var path = name.split('.');
	var setRec	= function(ar,crt,ctx, val) {
		if (typeof(ctx) == 'undefined') return;
		if (ar.length <= 0) return;
		
		if ((ar.length == 1) && (ctx.hasOwnProperty(ar[0]) || crt)) ctx[ar[0]] = val;
		else {
			if (!ctx.hasOwnProperty(ar[0]) && crt) ctx[ar[0]] = {};
			return setRec(ar.slice(1), crt, ctx[ar[0]], val);
		}
	};
	
	return setRec(path, create, context, value);
};

dojo.getObject	= function(name, create, context){
    // summary:
    //                Get a property from a dot-separated string, such as "A.B.C"
    // description:
    //                Useful for longer api chains where you have to test each object in
    //                the chain, or when you have an object reference in string format.
    // name: String
    //                Path to an property, in the form "A.B.C".
    // create: Boolean?
    //                Optional. Defaults to `false`. If `true`, Objects will be
    //                created at any point along the 'path' that is undefined.
    // context: Object?
    //                Optional. Object to use as root of path. Defaults to
    //                'dojo.global'. Null may be passed.
    return dojo.getProp(name.split("."), create, context); // Object
};