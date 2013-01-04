mediainfo = {
	languages : {},
	// Donne toutes les traductions d'un même token
	getLangEntries : function(lId) {
		var result = [];
		for (var langName in mediainfo.languages) {
			result.push(mediainfo.languages[langName][lId]);
		}
	},
	
	// Donne la langue en fonction de l'échantillon fourni
	getLangBySample : function(sample) {
		for (var langName in mediainfo.languages) {
			if (mediainfo.languages[langName].indexOf(sample) >= 0) return langName;
		}
		return null;
	},
	
	// Donne la traduction "primaire" d'un token
	getLangKey : function(sourceLang, token) {
		var tokenPosition = mediainfo.languages[sourceLang].indexOf(token);
		if (tokenPosition < 0) return token;
		var result = mediainfo.languages["Language_ISO639"][tokenPosition];
		//console.log(token+"("+sourceLang+") -> "+result);
		return result;
	}
};

(function() {
/* Charge le fichiers CSV dans les traductions de MediaInfo. Le fichier
 * est parsé dans mediainfo.languages
 * Une entrée par langue est ajoutée
 * Une entrée est un tableau ordonnée contenant tout les termes traduits
 */
var loadTranslations = function(fName) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", chrome.extension.getURL(fName), true);
	xhr.onload = function() {
		// Convert
		var csvLines = xhr.responseText.split("\n"); xhr=null;
		var csvArray = [];
		for (var i=0; i<csvLines.length; i++) csvArray.push(csvLines[i].split(";"));
		csvLines=null;
		
		// Language Index
		var langIndex = [];
		for (var i=0; i<csvArray[0].length; i++) {
			var langId = csvArray[0][i].trim();
			mediainfo.languages[langId] = [];
			langIndex.push(langId);
		}
		
		// Add entries
		for (var line=143; line<csvArray.length; line++)
			for (var token=0; token<csvArray[line].length; token++) {
				mediainfo.languages[langIndex[token]].push(csvArray[line][token]);
			}
		
		//console.log(JSON.stringify(mediainfo));
	};
	xhr.send();
};

loadTranslations('mediainfo-langs.csv');
})();
