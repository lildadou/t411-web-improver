var defaultSettings = {
	version		: 1,
	forcehttps	: { interne	: true },
	fastdownload: { shortcut: true },
	masssignal	: {
		optUploaderPub	: true,		// Notifier publiquement
		optUploaderPriv	: false,	// ou via MP
		optTPending		: true,		// Notifier la TP
		optVoteBad		: true		// Voter mauvaise prez
	},
	wysiwyg		: { forum	: true },
	peerstats	: {
		use				: true,
		orangeSigma		: 1,
		rougeSigma		: 2
	},
	commentNotifier	: {
		signalMentionned: true,
		signalLastAuthor: 0
	},
	autoprez	: {
		video	: {
			detectCat	: true,
			buildPrez	: true
		}
	}
};

function getStorage() {
	return chrome.storage.local;
}


/**Cette fonction initialise la configuration par défaut du plugin.
 * @param reset {Boolean} Indique si l'on doit éventuellement 
 * écraser la configuration existante.
 */
function initializeSettings(reset) {
	var erase = function() {
		getStorage().set(defaultSettings, function() {
			console.log('Configuration écrasée par le modèle n°'+defaultSettings.version);
		});
	};
	
	if (reset) erase();
	else {
		getStorage().get(['version'], function(e) {
			if ((typeof(e.version)=="undefined") 
					|| (e.version < defaultSettings.version)) erase();
		});
	}
}

/**Retourne la liste des noms de modules utilisé pour
 * la configuration
 * @returns [String]
 */
function getModuleNames() {
	var result = [];
	for (var i in defaultSettings) result.push(i);
	return result;
}

function getSettings(callback) {
	initializeSettings();
	getStorage().get(getModuleNames(), callback);
}

initializeSettings(false);