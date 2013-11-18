var defaultSettings = {
	version		: 4,
	forcehttps	: { interne	: true },
	fastdownload: { shortcut: true },
	masssignal	: {
		use				: false,
		msgUploaderPub	: 'Votre prez est incorrecte',
		optUploaderPub	: true,		// Notifier publiquement
		msgUploaderPriv	: 'Votre prez est incorrecte',
		optUploaderPriv	: false,	// ou via MP
		msgTPending		: 'Cette prez n\'est pas conforme',
		optTPending		: true,		// Notifier la TP
		optVoteBad		: false		// Voter mauvaise prez
	},
	forum		: {
		fixProfilLinks	: true,
		wysiwyg			: true,
		alphaAvatar		: true,
		linkMentions	: true,
		underlineHref	: true
	},
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
	},
	ratioBar	: {
		dispQuota		: true,
		targetRatio		: 0.75
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
	
	var update = function(old) {
		var merged = basicMerge(old, defaultSettings);
		merged.version = defaultSettings.version;
		getStorage().set(merged, function() {
			console.log('Configuration mergée par le modèle n°'+defaultSettings.version);
		});
	};
	
	if (reset) erase();
	else {
		getStorage().get(['version'], function(e) {
			if ((typeof(e.version)=="undefined") 
					|| (e.version < defaultSettings.version)) update();
		});
	}
}

function basicMerge(oldSettings, defaultSettings, result) {
	var _result = (result)?result:{};
	var _oldSettings = (oldSettings)?oldSettings:{};
	
	for (var aParam in defaultSettings) {
		_result[aParam] = (typeof defaultSettings[aParam] === 'object')?
				basicMerge(_oldSettings[aParam], defaultSettings[aParam]):
				(typeof _oldSettings[aParam] === 'undefined')?defaultSettings[aParam]:_oldSettings[aParam];
	}
	
	return _result;
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

function saveSettings(settings, callback) {
	getStorage().set(settings, (callback)?callback:function() {console.log('settings saved');});
}