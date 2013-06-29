var scripts = ["lib-peers-checker.js","details-peers-checker.js"];
var injectScript = function(name) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(name);
	s.onload = function() {
	    this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
};

for (var i=0; i<scripts.length; i++) injectScript(scripts[i]);
