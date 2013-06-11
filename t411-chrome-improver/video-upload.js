// Author: Daniel L. (aka lildadou)
(function() {
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
  //var a = getFirstNamedSection(nfoJson, "Audio");
  //var s = getFirstNamedSection(nfoJson, "Text");
  var fName = /^(\.\/)?(.*)$/.exec(g["CompleteName"])[2];
  result.name=fName;
  
  // serie ou film?
  var serieTokens = /S(\d+)E(\d+)/.exec(fName);
  result.isSerie = (serieTokens != null);
  result.isMovie = !result.isSerie;
  
  // saison/episode
  if (result.isSerie) {
    result.season = serieTokens[1];
    result.episode = serieTokens[2];
  }
  
  // PAL/NTSC
  result.isPAL = ((v["FrameRate"]==25) || (v["FrameRate"]==50));

  // Langue. Cette information est déterminé via le nom de fichier
  // et non pas les section Audio/Text
  result.lang = 
    (/[. -]VOSTFR[. -]/i.exec(fName))?"VOSTFR":
    (/[. -](VFF|TrueFrench)[. -]/i.exec(fName))?"VFF":
    (/[. -](VFQ|VF|French)[. -]/i.exec(fName))?"VFQ":
    (/[. -]VO[. -]/i.exec(fName))?"Anglais":
    (/[. -]multi[. -]/i.exec(fName))?"Multi":null;
  
  // qualité
  result.quality = null;
  var isHDFormat = (v["Height"] > 680);
  console.log("isHD?", isHDFormat);
  if (isHDFormat) {
    result.quality = (v["Height"] > 1020)?"HDrip 1080":"HDrip 720";
    console.log(result.quality);
  }
  
  if (/[. -](WEBRIP|WEB-RIP)[. -]/i.exec(fName)) result.quality = "WEBrip";
  if (/[. -]HDTV[. -]/i.exec(fName)) result.quality = isHDFormat?"HDTV":"TVrip";
  if (/[. -]dvdrip[. -]/i.exec(fName)) result.quality = "DVDrip";
  
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
  getOptByText(frmtSelect, nfo.isPal?"PAL":"NTSC").selected = true;
  
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
    applyOnUploadPage(nfo);
  };
  reader.readAsText(nfoFile);
};

})();