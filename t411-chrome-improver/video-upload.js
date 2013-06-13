// Author: Daniel L. (aka lildadou)
(function() {
// Expression regulières utilisées pour l'extraction de données depuis le nom de fichier
extractTitle = function(uglyName) {
	/* Retirer un chemin (GROUP-6). Match examples:
	* C:\my\path\file.ext -> file.ext
	* ~/my/path/file.ext -> file.ext
	*/
	var rFilePath = /^(.:|\.|\.\.|~)?(\\|\/)?(([^\\\/])*(\\|\/))*(.*)$/;
	
	/* Retirer l'extension du fichier (GROUP-1)*/
	var rFileExt = /\.(avi|mp4|mkv|mov)$/i;
	
	// Filtre pour la source originale
	var rOrgSource = /[ _\,\.\(\)\[\]\-]+(bluray|brip|brrip|bdrip|dvdrip|webdl|hdtv|bdscr|dvdscr|sdtv|web.?rip|dsr|tvrip|preair|ppvrip|hdrip|r5|tc|ts|cam|workprint)([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour le format de la release
	var rFormat = /[ _\,\.\(\)\[\]\-]+(1080p|1080i|720p|720i|hr|576p|480p|368p|360p)([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour le codec
	var rVideoCodec = /[ _\,\.\(\)\[\]\-]+(10.?bits?|[xh]264|xvid|divx)([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour le codec audio
	var rAudiCodec = /[ _\,\.\(\)\[\]\-]+(dts|flac|ac3|aac|dd[ _\.\(\)\[\]\-]?([12357]\.[01])|mp3)([ _\.\(\)\[\]\-]?([12357]\.[01]))?([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour les langues
	var rLangs = /[ _\,\.\(\)\[\]\-]+(vo(st)?|vf|vff|vfq|fr(e(nch)?)?|truefrench|multi)([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour l'année de réalisation
	var rYear = /[ _\,\.\(\)\[\]\-]+(19\d{2}|20\d{2})([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour les séries
	var rSeries = /S(\d+)E(\d+)/;
	
	// Filtre pour le reste
	var rUnknow = /[ _\,\.\(\)\[\]\-]{2,}.*$/i;
	
	var result = rFilePath.exec(uglyName.trim())[6];
	result=result.replace(rFileExt,"");
	
	var extractedDatas = {
		releaseName		: result,
		fileExtension	: rFileExt.test(result)?rFileExt.exec(result)[1]:null,
		originalSource	: rOrgSource.test(result)?rOrgSource.exec(result)[1]:null,
		videoFormat		: rFormat.test(result)?rFormat.exec(result)[1]:null,
		videoCodec		: rVideoCodec.test(result)?rVideoCodec.exec(result)[1]:null,
		audioCodec		: rAudiCodec.test(result)?rAudiCodec.exec(result)[1]:null,
		langs			: rLangs.test(result)?rLangs.exec(result)[1]:null,
		year			: rYear.test(result)?rYear.exec(result)[1]:null
	};
	
	// Extraction id_serie
	if (rSeries.test(result)) {
		var mSeries = rSeries.exec(result);
		extractedDatas.serie_season = new Number(mSeries[1]);
		extractedDatas.serie_episode = new Number(mSeries[2]);
	}
	
	// Nettoyage du releaseName
	// Retrait des tags reconnus
	var extractedComp = ['name','originalSource','videoFormat','videoCodec','langs','audioCodec','year'];
	for (var i=0; i<extractedComp.length; i++) result=result.replace(extractedDatas[extractedComp[i]],"");
	result=result.replace(rSeries,"");
	
	
	// Retraits des tags inconnus
	extractedDatas.unreconizedData = rUnknow.test(result)?rUnknow.exec(result)[0]:null;
	result=result.replace(extractedDatas.unreconizedData,"");
	var rSpecialChars = /[_\,\.\(\)\[\]\-]+/;
	var rInternTrim = / {2,}/;
	while (rSpecialChars.test(result)) result=result.replace(rSpecialChars," ");
	while (rInternTrim.test(result)) result=result.replace(rInternTrim," ");
	result=result.trim();
	extractedDatas.title = result;
	
	return extractedDatas;
};
	
	
/**Retourne un tableau contenant l'ensemble des objets JSON
 * pour une section donnée
 * nfoJson {Array} Un tableau qui contient un NFO sérialisé au format JSON (cf. nfo2json())
 * sectionName {String} Le nom de la section voulu dans la langue Language_ISO639 (ex: Audio, General, Video)
 */
var getNamedSections = function(nfoJson, sectionName) {
  var result=[];
  for (var i=0; i<nfoJson.length; i++) if (nfoJson[i].sectionName==sectionName) result.push(nfoJson[i]);
  return result;
};

/** Convertie le contenu d'un fichier NFO (une String) en tableau. Chaque case 
 * du tableau contient une section (General, Video, Text, ...)
 * sous forme JSON.
 * IMPORTANT: Seul les NFO produit par mediainfo sont acceptés
 * nfoText {String} Le contenu du fichier NFO au format mediainfo
*/
var nfo2json = function(nfoText) {
  var lines = nfoText.split('\n'); //On découpe en ligne par ligne
  var sectionRegex = /^[^\s]+$/; //RegExp qui match un début de section (General, Video)
  var entrieRegex =  /^([^\s]+(\s[^\s]+)*)\s+: (.+)$/; //RegExp qui match une entré (Width:  220px)

  /* On determine la langue. Pour ce faire, pour chaque langue on va compter 
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
  // --- FIN de détection de la langue ---
  
  /* On va maintenant iterer ligne par ligne le nfo.
   * A chaque fois qu'une nouvelle section commence, on ajoute une entrée
   * dans le tableau de résultat. Toutes les lignes d'informations rencontrées
   * seront dans cette case du tableau ; jusque la section suivante.
   * 
   * On en profite pour convertir les noms des entrées/sections dans un langage
   * pivot (Language_ISO639). En effet, on trouve des NFO en français et en 
   * anglais.
   */
  var result = []; var currentSection={};
  for (var i=0; i<lines.length; i++) {
    var l = lines[i];
    var sectionName = sectionRegex.exec(l);
    var entrie = entrieRegex.exec(l);
    
    
    if (sectionName != null) { // Cas d'une nouvelle section
      var translatedSectionName = mediainfo.getLangKey(detectedLang, sectionName[0]);
      currentSection = {};
      currentSection.sectionName = translatedSectionName;
      result.push(currentSection);
    } else if (entrie != null) { // Cas d'une nouvelle entrée
      var entrieName = mediainfo.getLangKey(detectedLang, entrie[1]);
      currentSection[entrieName] = entrie[3];
    } //else console.warn("Unreconized: ", l);
  }
  // --- FIN classification hierarchique des sections et des entrées ---
  
  /* A ce niveau, les informations sont classées hierarchiquement.
   * Toutefois, toutes les informations sont des chaines de caractères même
   * les valeurs numériques! (ex: hauteur d'une vidéo)
   * Nous allons donc parser ces valeurs, du moins celles que l'on connait:
   * Width, Height, FrameRate et Bits-(Pixel*Frame)
   */
  var s = getNamedSections(result, "Video");
  for (var i=0; i<s.length; i++) {
    s[i]["Width"] = Number(/(\d+(\s\d+)*)/.exec(s[i]["Width"])[1].replace(" ",""));
    s[i]["Height"] = Number(/(\d+(\s\d+)*)/.exec(s[i]["Height"])[1].replace(" ",""));
    s[i]["FrameRate"] = Number(/(\d+(\.\d+)*)/.exec(s[i]["FrameRate"])[1]);
    s[i]["Bits-(Pixel*Frame)"] = Number(/(\d+(\.\d+)*)/.exec(s[i]["Bits-(Pixel*Frame)"])[1]);
  }
  // --- FIN conversion des valeurs numériques
  
  //console.log("Resultat du parsage du NFO:", result);
  return result;
};

/**Cette méthode renvoie l'objet de section d'un NFO parsé. La méthode est 
 * appelé "First" car il peut exister plusieurs sections avec le même nom
 * (ex: plusieurs section Audio dans le cas d'un Multi-langue)
 * nfoJson {Array} NFO parsé
 * sectionName {String} Le nom de la section désirée
 */
var getFirstNamedSection = function(nfoJson, sectionName) {
  for (var i=0; i<nfoJson.length; i++) if (nfoJson[i].sectionName==sectionName) return nfoJson[i];
  return null;
};


/**Cette fonction va servir à extraire les informations utilisées par T411.
 * Est-ce une série? numéro d'épisode, résolution etc
 * nfoJson {Array} NFO parsé
 */
var nfoJsonDecoder = function(nfoJson) {
  var result = {};
  var g = getFirstNamedSection(nfoJson, "General");
  var v = getFirstNamedSection(nfoJson, "Video");
  var exData = extractTitle(g["CompleteName"]);
  result.extractedData = exData;
  result.nfoJson = nfoJson;
  //var fName = /^(\.\/)?(.*)$/.exec(g["CompleteName"])[2]; //TODO: Utiliser extractDataFromReleaseName
  result.name=exData.releaseName;
  
  
  // serie ou film?
  result.isSerie = (exData.serie_season != null);
  result.isMovie = !result.isSerie;
  
  // saison/episode
  if (result.isSerie) {
    result.season = exData.serie_season;
    result.episode = exData.serie_episode;
  }
  
  // PAL/NTSC
  result.isPAL = ((v["FrameRate"]==25) || (v["FrameRate"]==50));

  // Langue. Cette information est déterminé via le nom de fichier
  // et non pas les section Audio/Text
  result.lang = 
    (/VOSTFR/i.exec(exData.langs))?"VOSTFR":
    (/(VFF|TrueFrench)/i.exec(exData.langs))?"VFF":
    (/(VFQ|VF|French)/i.exec(exData.langs))?"VFQ":
    (/VO/i.exec(exData.langs))?"Anglais":
    (/multi/i.exec(exData.langs))?"Multi":null;
  
  // qualité
  result.quality = null;
  var isHDFormat = (v["Height"] > 680);
  if (isHDFormat) {
    result.quality = (v["Height"] > 1020)?"HDrip 1080":"HDrip 720";
    console.log(result.quality);
  }
  
  if (/web.?rip/i.exec(exData.originalSource)) result.quality = "WEBrip";
  if (/HDTV/i.exec(exData.originalSource)) result.quality = isHDFormat?"HDTV":"TVrip";
  if (/dvdrip/i.exec(exData.originalSource)) result.quality = "DVDrip";
  
  return result;
};

/**Méthode qui applique les données du NFO au formulaire
 * d'upload.
 * nfo {Object} L'objet JSON qui contient les informations synthétiques (cf. nfoJsonDecoder)
 */
var applyOnUploadPage = function(nfo) {
  // Petite fonction qui permet de récupérer un choix de catégorie
  // par son texte plutôt que par un identifiant
  var getOptByText = function(selectElem, val) {
    var opts = selectElem.options;
    for (var i=0; i<opts.length; i++) {
      var o = opts[i];
      if (o.textContent.match(val)) return o;
    }
    return opts[0];
  };
  
  document.getElementById("name_text").value = nfo.name;
  
  if (nfo.isSerie) {
    var seSelect = document.getElementsByName("term[45][]")[0];
    getOptByText(seSelect, nfo.season).selected = true;
    
    var epSelect = document.getElementsByName("term[46][]")[0];
    getOptByText(epSelect, nfo.episode).selected = true;
  }
  
  var frmtSelect = document.getElementsByName("term[8][]")[0];
  getOptByText(frmtSelect, nfo.isPAL?/^PAL/:/^NTSC/).selected = true;
  
  var langSelect = document.getElementsByName("term[17][]")[0];
  getOptByText(langSelect, nfo.lang).selected = true;
  
  var qualSelect = document.getElementsByName("term[7][]")[0];
  getOptByText(qualSelect, nfo.quality).selected = true;
  
  getOptByText(document.getElementsByName("term[34][]")[0], "Platine").selected = true;
  
  getOptByText(document.getElementsByName("term[9][]")[0], "2D").selected = true;
};
// FIN des déclarations statiques


/* Ce bout de code va ajouter un listener à la basile INPUT
 * qui reçoit le fichier NFO. Quand le contenu de cette balise
 * est modifiée on va
 *  - lire le fichier (FileReader)
 *  - parser le NFO (nfo2json)
 *  - en extraire les infos qui nous interresse (nfoJsonDecoder)
 *  - puis pré-remplir le formulaire d'upload (applyOnUploadPage)
 */
var nfoInput = document.getElementsByName("nfo")[0];
nfoInput.onchange = function(e) {
  var nfoFile = nfoInput.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var nfoJson = nfo2json(reader.result);
    var nfo = nfoJsonDecoder(nfoJson);
    console.log(nfo);
    applyOnUploadPage(nfo);
    
   
  };
  reader.readAsText(nfoFile);
};

})();