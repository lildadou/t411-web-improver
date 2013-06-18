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

var MediaNFO = function(textNFO) {
	if (textNFO) {
		if (typeof textNFO == "string") this._load(textNFO);
		else throw new Error("MediaNFO's constructor accept String, not "+typeof textNFO);
	}
	
};

MediaNFO.prototype = {
	/**Retourne un tableau contenant l'ensemble des objets JSON
	 * pour une section donnée
	 * @param {String} sectionName Le nom de la section voulu dans 
	 * la langue Language_ISO639 (ex: Audio, General, Video)
	 * @returns {Array}
	 */
	getNamedSections	: function(sectionName) {
	  var result=[]; var nfoJson = this._data;
	  for (var i=0; i<nfoJson.length; i++) 
		  if (nfoJson[i].sectionName==sectionName) result.push(nfoJson[i]);
	  return result;
	},

	/**Cette méthode renvoie l'objet de section d'un NFO parsé. La méthode est 
	 * appelé "First" car il peut exister plusieurs sections avec le même nom
	 * (ex: plusieurs section Audio dans le cas d'un Multi-langue)
	 * @param {String} sectionName Le nom de la section désirée
	 * @return {Object}
	 */
	getFirstNamedSection	: function(sectionName) {
		var nfoJson = this._data;
	  for (var i=0; i<nfoJson.length; i++) 
		  if (nfoJson[i].sectionName==sectionName) return nfoJson[i];
	  return null;
	},
	
	/** Convertie le contenu d'un fichier NFO (une String) en tableau. 
	 * sous forme JSON.
	 * IMPORTANT: Seul les NFO produit par mediainfo sont acceptés
	 * @param {String} nfoText Le contenu du fichier NFO au format mediainfo
	 * @returns {Array} result Chaque case du tableau contient une 
	 * section (General, Video, Text, ...)
	*/
	_load					: function(nfoText) {
	  var lines = nfoText.split('\n'); //On découpe en ligne par ligne
	  var sectionRegex = /^[^\s]+$/; //RegExp qui match un début de section (General, Video)
	  var entrieRegex =  /^([^\s]+(\s[^\s]+)*)\s+: (.+)$/; //RegExp qui match une entré (Width:  220px)

	  /* #region Detection de la langue
	   * On determine la langue. Pour ce faire, pour chaque langue on va compter 
	   * le nombre d'occurence. La langue qui détient le plus d'occurence remporte le test
	   */
	  var langCount = {};
	  for (var i=0; i<lines.length; i++) {
	    var l = lines[i];
	    var sectionName = sectionRegex.exec(l);
	    var entrie = entrieRegex.exec(l);
	    if (sectionName != null) {
	      var detectLang = mediainfo.getLangBySample(sectionName[0]);
	      if (detectLang)
	    	  if (typeof(langCount[detectLang])=="undefined") langCount[detectLang]=1;
	    	  else langCount[detectLang]++;
	    } else if (entrie != null) {
		  var detectLang = mediainfo.getLangBySample(entrie[1]);
		  if (detectLang)
			if (typeof(langCount[detectLang])=="undefined") langCount[detectLang]=1;
		  	else langCount[detectLang]++;
	    }
	  }
	  var detectedLang = "Language_ISO639";
	  var detectedLangScore = 0;
	  for (var langId in langCount) if (langCount[langId] > detectedLangScore) {
		  detectedLangScore = langCount[langId];
		  detectedLang = langId;
	  }
	  // #endregion de détection de la langue ---
	  
	  /* #region classification hierarchique des sections et des entrées
	   * On va maintenant iterer ligne par ligne le nfo.
	   * A chaque fois qu'une nouvelle section commence, on ajoute une entrée
	   * dans le tableau de résultat. Toutes les lignes d'informations rencontrées
	   * seront dans cette case du tableau ; jusque la section suivante.
	   * 
	   * On en profite pour convertir les noms des entrées/sections dans un langage
	   * pivot (Language_ISO639). En effet, on trouve des NFO en français et en 
	   * anglais.
	   */
	  var result = []; var currentSection={};
	  this._data = result;
	  for (var i=0; i<lines.length; i++) {
	    var l = lines[i];
	    var sectionName = sectionRegex.exec(l);
	    var entrie = entrieRegex.exec(l);
	    	
	    if (sectionName != null) {
	      // #region Nouvelle section
	      var translatedSectionName = mediainfo.getLangKey(detectedLang, sectionName[0]);
	      currentSection = {};
	      currentSection.sectionName = translatedSectionName;
	      result.push(currentSection);
	      // #endregion
	    } else if (entrie != null) { // Cas d'une nouvelle entrée
	      var entrieName = mediainfo.getLangKey(detectedLang, entrie[1]);
	      currentSection[entrieName] = entrie[3];
	    }
	  }
	  
	  this._parseNumericField();
	},
	
	/**
	 * Converti certains champs (Width, Height, FrameRate et Bits-(Pixel*Frame)) 
	 * dans leurs valeurs numérique.
	 */
	_parseNumericField : function() {
		var s = this.getNamedSections("Video");
		for (var i=0; i<s.length; i++) {
			s[i]["BitDepth"] = Number(/(\d+).?bits?/i.exec(s[i]["BitDepth"])[1]);
		    s[i]["Width"] = Number(/(\d+(\s\d+)*)/.exec(s[i]["Width"])[1].replace(" ",""));
		    s[i]["Height"] = Number(/(\d+(\s\d+)*)/.exec(s[i]["Height"])[1].replace(" ",""));
		    s[i]["FrameRate"] = Number(/(\d+(\.\d+)*)/.exec(s[i]["FrameRate"])[1]);
		    s[i]["Bits-(Pixel*Frame)"] = Number(/(\d+(\.\d+)*)/.exec(s[i]["Bits-(Pixel*Frame)"])[1]);
		}
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
	};
	xhr.send();
};

loadTranslations('mediainfo-langs.csv');
})();
