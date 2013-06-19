// Author: Daniel L. (aka lildadou)
(function() {

// #region Déclaration de sous-fonctions
	
/**Classe qui modèlise les données extraites d'un nom de release
 * @attribute {Object} extractedDatas.general
 * @attribute {String} extractedDatas.general.releaseName Le nom de release (différent du nom de fichier)
 * @attribute {String} extractedDatas.general.title Le titre de l'oeuvre (nom de la release sans les tags)
 * @attribute {Number} [extractedDatas.general.year] Année de réalisation du film
 * @attribute {String} [extractedDatas.general.fileExtension] Extension de fichier
 * @attribute {Number} [extractedDatas.general.serie.season] Numéro de saison de la série
 * @attribute {Number} [extractedDatas.general.serie.season] Numéro d'épisode de la série
 * @attribute {String} [extractedDatas.general.originalSource] Source du rip (bluray|brip|brrip|bdrip|
 * dvdrip|webdl|hdtv|bdscr|dvdscr|sdtv|webrip|dsr|tvrip|preair|ppvrip|hdrip|r5|tc|ts|cam|workprint)
 * 
 * @attribute {Object} extractedDatas.video
 * @attribute {String} [extractedDatas.video.format] Format de l'image (1080p|1080i|720p|720i|hr|576p|480p|368p|360p)
 * @attribute {String} [extractedDatas.video.codec] Codec vidéo (10bits|h264|xvid|divx)
 * 
 * @attribute {Array} extractedDatas.langs
 * @attribute {String} [extractedDatas.langs[].codec] Codec audio (dts|flac|ac3|aac|dd5.1)|mp3)
 * @attribute {String} [extractedDatas.langs] Langues du média
 * @attribute {Object} [extractedDatas.serie] Informations complémentaires relatif à une série
 * 
 * 
 * @attribute {String} [extractedDatas.simplifiedLang] Langues du média en codification VOSTFR, VFF etc
 * @constructor
 * @base RlzData
 */
var RlzData = function(){
	this.general	= {
		releaseName		: "",
		fileExtension	: null,
		originalSource	: null,
		year			: null,
		serie			: null,
		poster			: null,
		plot			: null,
		genres			: [],
		rating			: null,
		rating_count	: null
	};
	this.video		= {
		format			: null,
		codec			: null,
		framerate		: null
	};
	this.langs		= [{
		codec			: null,
		lang			: null
	}];
	this.langs.tag	= null;
};

/**Il existe plusieurs codification d'un même concept. 
 * ex: bluray blueray bdr bdrip bd etc
 * Cette fonction effectue une "normalisation" des codifications 
 * présentes dans un objet RlzData
 * @param {RlzData} objet à nettoyer
 * @returns {RlzData} objet passé en parametre
 * @base RlzData
 */
RlzData.prototype.normalize = function() {
	if (this.general.fileExtension) this.general.fileExtension = this.general.fileExtension.toLowerCase();
	if (this.general.originalSource) {
		var src = this.general.originalSource;
		if (/blue?[\ .\-]?ray|bd[\ .\-]?rip/i.test(src)) this.general.originalSource = "bluray";
		if (/br[\ .\-]?r?ip/i.test(src)) this.general.originalSource = "bdrip";
		if (/web[\ .\-]?dl/i.test(src)) this.general.originalSource = "webdl";
		if (/dvd[\ .\-]?rip/i.test(src)) this.general.originalSource = "dvd";
		if (/hd[\ .\-]?tv[\ .\-]?(rip)?/i.test(src)) this.general.originalSource = "hdtv";
		if (/bd[\ .\-]?scr/i.test(src)) this.general.originalSource = "bdscr";
		if (/dvd[\ .\-]?scr/i.test(src)) this.general.originalSource = "dvdscr";
		if (/web[\ .\-]?rip/i.test(src)) this.general.originalSource = "webrip";
		if (/hd[\ .\-]?rip/i.test(src)) this.general.originalSource = "hdrip";
		if (/(sd)?[\ .\-]?tv[\ .\-]?(rip)?/i.test(src)) this.general.originalSource = "sdtv";
		this.general.originalSource = this.general.originalSource.toLowerCase();
	}
	if (this.video.codec) {
		var c = this.video.codec; 
		if (/([xh][\ .\-]?264|MPE?G.?4|AVC)/i.test(c)) this.video.codec = "h264";
		if (/10[\.\-]?bits?/i.test(c)) this.video.codec = "10bit";
		this.video.codec = this.video.codec.toLowerCase();
	}
	if (this.langs[0].codec) {
		var c = this.langs[0].codec;
		if (/dd[ _\.\(\)\[\]\-]?(5.?1)/i.test(c)) this.langs[0].codec="dd51";
		this.langs[0].codec = this.langs[0].codec.toLowerCase();
	}
	if (this.langs.tag) {
		var l = this.langs.tag;
		if (/vo/i.test(l)) {
			this.langs[0].lang	= "unknow";
			this.langs.tag		= "vo";
		}
		if (/vo.?st/i.test(l)) {
			this.langs[0].lang	= "unknow";
			this.langs.push({
				lang : "fr-fr",
				codec: "srt"
			});
			this.langs.tag		= "vostfr";
		}
		if (/vo.?st(.?fr(e?nch)?)/i.test(l)) {
			this.langs[1].lang	= "fr-fr";
			this.langs.tag		= "vostfr";
		}
		if (/vo.?st(.?eng?)/i.test(l)) {
			this.langs[1].lang	= "en-us";
			this.langs.tag		= "vosten";
		}
		if (/(VFF|TrueFrench)/i.test(l)) {
			console.log("VFF",l);
			this.langs[0].lang	= "fr-fr";
			this.langs.tag		= "vff";
		}
		if (/(VFQ|VF|fr(e(nch)?)?)/i.test(l) 
				&& !/vo.?st(.?fr(e?nch)?)/i.test(l)
				&& !/(VFF|TrueFrench)/i.test(l)) {
			console.log("VFQ",l);
			this.langs[0].lang	= "fr-ca";
			this.langs.tag		= "vfq";
		}
		this.langs[0].lang = this.langs[0].lang.toLowerCase();
		if ( ! this.langs.tag) this.langs.tag = this.langs[0].lang.toLowerCase();
	}
	return this;
};
// #endregion

// #region Déclaration des mergeurs de données externes
/**Fonction qui extrait des informations depuis un nom de release
 * formaté de manière usuel. Cette fonction accepte aussi:
 *  - un nom de fichier (ex: Title.2002.VOSTFR.mkv)
 *  - un chemin de fichier Windows (ex: D:\Mondossier\Title.2002.VOSTFR.mkv)
 *  - un chemin de fichier Unix (ex: ~/Vidéos/Title.2002.VOSTFR.mkv)
 * @param {RlzData} rlzData 
 * @param {String} uglyName Nom de release (Ex: Hypothermia.2010.FRENCH.720p.BluRay.AC3-ARTEFAC)
 * @returns {RlzData} extractedDatas Les données extraites
 */
var mergeDataIntoReleaseName = function(rlzData, uglyName) {
	var extractedDatas = rlzData;
	
	// Ensemble des tags relevés lors de l'analyse
	var tags = [];
	
	/* Retirer un chemin (GROUP-6). Match examples:
	* C:\my\path\file.ext -> file.ext
	* ~/my/path/file.ext -> file.ext
	*/
	var rFilePath = /^(.:|\.|\.\.|~)?(\\|\/)?(([^\\\/])*(\\|\/))*(.*)$/;
	
	/* Retirer l'extension du fichier (GROUP-1)*/
	var rFileExt = /\.(avi|mp4|mkv|mov)$/i;
	
	// Filtre pour la source originale
	var rOrgSource = /[ _\,\.\(\)\[\]\-]+(blue?[\ .\-]?ray|b[rd][\ .\-]?r?ip|dvd[\ .\-]?rip|web[\ .\-]?dl|(hd|sd)?[\ .\-]?tv[\ .\-]?(rip)?|bd[\ .\-]?scr|dvd[\ .\-]?scr|web[\ .\-]?rip|dsr|preair|ppvrip|hd[\ .\-]?rip|r5|tc|ts|cam|workprint)([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour le format de la release
	var rFormat = /[ _\,\.\(\)\[\]\-]+(1080p|1080i|720p|720i|hr|576p|480p|368p|360p)([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour le codec
	var rVideoCodec = /[ _\,\.\(\)\[\]\-]+(([xh][\ .\-]?264[ _\,\.\(\)\[\]\-]?)?10[\.\-]?bits?([xh][\.\-]?264[ _\,\.\(\)\[\]\-]?)?|[xh][\.\-]?264|xvid|divx)([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour le codec audio
	var rAudioCodec = /[ _\,\.\(\)\[\]\-]+(dts|flac|ac3|aac|dd[ _\.\(\)\[\]\-]?(5.?1)|mp3)([ _\.\(\)\[\]\-]?([12357]\.[01]))?([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour les langues
	var rLangs = /[ _\,\.\(\)\[\]\-]+(vo(.?st(.?(fr(e?nch)?|eng?))?)?|vf|vff|vfq|fr(e(nch)?)?|truefrench|multi)([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour l'année de réalisation
	var rYear = /[ _\,\.\(\)\[\]\-]+(19\d{2}|20\d{2})([ _\,\.\(\)\[\]\-]|$)/i;
	
	// Filtre pour les séries
	var rSeries = /S(\d+)E(\d+)/;
	
	// Filtre pour le reste
	var rUnknow = /[ _\,\.\(\)\[\]\-]{2,}.*$/i;
	
	var rlzName = rFilePath.exec(uglyName.trim())[6];
	extractedDatas.general.fileExtension	= rFileExt.test(rlzName)?rFileExt.exec(rlzName)[1]:null;
	rlzName=rlzName.replace(rFileExt,"");
	
	extractedDatas.general.releaseName		= rlzName;
	extractedDatas.general.originalSource	= rOrgSource.test(rlzName)?rOrgSource.exec(rlzName)[1]:null;
	extractedDatas.video.format				= rFormat.test(rlzName)?rFormat.exec(rlzName)[1]:null;
	extractedDatas.video.codec				= rVideoCodec.test(rlzName)?rVideoCodec.exec(rlzName)[1]:null;
	extractedDatas.langs[0].codec			= rAudioCodec.test(rlzName)?rAudioCodec.exec(rlzName)[1]:null;
	extractedDatas.langs.tag				= rLangs.test(rlzName)?rLangs.exec(rlzName)[1]:null;
	
	// Extraction année de réalisation du film
	if (rYear.test(rlzName)) extractedDatas.general.year	= new Number(rYear.exec(rlzName)[1]);	
	
	// Extraction id_serie
	if (rSeries.test(rlzName)) {
		var mSeries = rSeries.exec(rlzName);
		tags.push(mSeries[0]);
		extractedDatas.general.serie		= {};
		extractedDatas.general.serie.season = new Number(mSeries[1]);
		extractedDatas.general.serie.episode = new Number(mSeries[2]);
	}
	
	// #region Nettoyage du releaseName pour construire title
	// Retrait des tags
	tags.push(extractedDatas.general.year);
	tags.push(extractedDatas.general.originalSource);
	tags.push(extractedDatas.video.format);
	tags.push(extractedDatas.video.codec);
	tags.push(extractedDatas.langs[0].codec);
	tags.push(extractedDatas.langs.tag);
	for (var i=0; i<tags.length; i++) rlzName=rlzName.replace(tags[i],"");
	
	
	// Retraits des tags inconnus
	extractedDatas.unreconizedData = rUnknow.test(rlzName)?rUnknow.exec(rlzName)[0]:null;
	rlzName=rlzName.replace(extractedDatas.unreconizedData,"");
	var rSpecialChars = /[_\,\.\(\)\[\]\-]+/;
	var rInternTrim = / {2,}/;
	while (rSpecialChars.test(rlzName)) rlzName=rlzName.replace(rSpecialChars," ");
	while (rInternTrim.test(rlzName)) rlzName=rlzName.replace(rInternTrim," ");
	rlzName=rlzName.trim();
	
	extractedDatas.general.title = rlzName; // Injection du titre de l'oeuvre nettoyée
	// #endregion Nettoyage du releaseName pour construire title
	
	return extractedDatas.normalize();
};

/**
 * @param {RlzData} rlzData Objet de donnée à enrichir
 * @param {MediaNFO} nfoJson NFO parsé
 * @returns {RlzData}
 */
var mergeMediaNFOData = function(rlzData, nfoJson) {
  var v = nfoJson.getFirstNamedSection("Video");
  
  rlzData.nfo = nfoJson;
  rlzData.video.framerate = v["FrameRate"]; // Ajout pour PAL/NTSC
  rlzData.video.height = v["Height"];
  rlzData.video.codec = v["CodecID"];
  if (v["BitDepth"]==10) rlzData.video.codec="10bit";
  rlzData.video.format = (v["Height"]>1020)?"1080p" //On utilise les donées NFO si c'est possible
	:(v["Height"]>680)?"720p"
	:(v["Height"]>500)?"544p"
	:(v["Height"]>400)?"480p"
	:(v["Height"]>320)?"360p":rlzData.video.format;
  
  //TODO: Extraction des infos audio/sous-titre
  //var audios = getNamedSections(nfoJson, "Audio");
  
  return rlzData.normalize();
};
// #endregion Déclaration des mergeurs de données externes

/**Méthode qui applique les données du NFO au formulaire
 * d'upload.
 * @param {RlzData} rlzData Données disponible sur la release
 */
var applyOnUploadPage = function(rlzData) {
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
  
  document.getElementById("name_text").value = rlzData.general.releaseName;
  
  if (rlzData.general.serie) {
    var seSelect = document.getElementsByName("term[45][]")[0];
    getOptByText(seSelect, rlzData.general.serie.season).selected = true;
    
    var epSelect = document.getElementsByName("term[46][]")[0];
    getOptByText(epSelect, rlzData.general.serie.episode).selected = true;
  }
  
  var frmtSelect = document.getElementsByName("term[8][]")[0];
  var fps = rlzData.video.framerate;
  getOptByText(frmtSelect, (fps==25 || fps==50)?/^PAL/:/^NTSC/).selected = true;
  
  // #region Traitement des Langues
  var langSelect = document.getElementsByName("term[17][]")[0];
  switch (rlzData.langs.tag) {
  case "vo": 
  case "vosten":
	  getOptByText(langSelect, /Anglais/i).selected = true;
	  break;
  default : getOptByText(langSelect, new RegExp(rlzData.langs.tag, "i")).selected = true;
  }
  // #endregion
  
  // #region Traitement du champ Qualité
  var qualSelect = document.getElementsByName("term[7][]")[0];
  var vOrigin = rlzData.general.originalSource;
  var vCodec = rlzData.video.codec;
  var vFormat = rlzData.video.format;
  switch (vOrigin) {
  case "bluray": 
  case "webdl": 
	  switch (vCodec) {
	  case "h265":
	  case "h264":
	  case "10bit":
		  // blueray.(720p|1080p).(h265|h264|10bit)
		  if (vFormat=="720p") getOptByText(qualSelect, /720/).selected = true;
		  if (vFormat=="1080p") getOptByText(qualSelect, /1080/).selected = true;
		  else getOptByText(qualSelect, /bdrip/i).selected = true;
		  break;
	  default: getOptByText(qualSelect, /bdrip/i).selected = true;
	  }
	  break;
	
  case "hdtv":
	  switch (vCodec) {
	  case "h265":
	  case "h264":
	  case "10bit":
		  // hdtv.(720p|1080p).(h265|h264|10bit)
		  if (vFormat.match(/(720|1080)p/)) getOptByText(qualSelect, /TVripHD/i).selected = true;
		  else getOptByText(qualSelect, /TVrip/i).selected = true;
		  break;
	  default: getOptByText(qualSelect, /TVrip/i).selected = true;
	  }
	  break;

  case "sdtv": getOptByText(qualSelect, /TVrip/i).selected = true; break;
	  
  default: getOptByText(qualSelect, new RegExp(vOrigin,"i")).selected = true;
  }
  // #endregion Qualité
  
  // #region Traitement des genres
  var genres = rlzData.general.genres;
  var genreInputs =document.querySelectorAll("input[type='checkbox'][name='term\[2\]\[\]']");
  var checkGenreBox = function(genreName) {
	  for (var i=0; i<genreInputs.length; i++) {
		  if (genreInputs[i].parentElement.textContent.match(genreName)) {
			  genreInputs[i].checked=true;
			  return true;
		  }
	  }
	  console.warn("Genre introuvable: "+genreName);
	  return false;
  };
  
  for (var i=0; i<genres.length; i++) checkGenreBox(genres[i]);
  // #endregion
  
  // #region Génération de la prez à partir du template
  var descrInput = document.getElementById("descr");
  var template = descrInput.textContent;
  window.addEventListener('message', function(event) {
	  var command = event.data.command;
	  switch(command) {
	    case 'response-fill_template':
	      descrInput.textContent = event.data.result;
	      window.removeEventListener(arguments.callee);
	      break;
	  }
	});
  window.postMessage({
	  command	:"query-fill_template",
	  'template':template,
	  context	: rlzData
  }, "*");
  
  // #endregion
  
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
var descInput = document.getElementById("descr");
var urlTemplate = chrome.extension.getURL("default-template.txt");
var xhr = new XMLHttpRequest();
xhr.open("GET", urlTemplate, true);
xhr.onload = function() {
	var sTemplate = xhr.responseText;
	descInput.textContent = sTemplate;
};
xhr.send();


var hbs = document.createElement("script");
hbs.src = chrome.extension.getURL("handlebars.js");
document.body.appendChild(hbs);


var nfoInput = document.getElementsByName("nfo")[0];
nfoInput.onchange = function(e) {
	var nfoFile = nfoInput.files[0];
	var reader = new FileReader();
	reader.onload = function(e) {
		var rlzData = new RlzData();
		var nfoJson = new MediaNFO(reader.result); // On parse le NFO
		var rlzName = nfoJson.getFirstNamedSection("General")["CompleteName"]; // On extrait le nom de release (qui contient beaucoup d'infos)
		mergeDataIntoReleaseName(rlzData, rlzName); // On extrait les données du nom
		mergeMediaNFOData(rlzData, nfoJson); // On extrait les données du NFO
		var xhr = mdbproxy.allocine.build(
    		rlzData, 
    		function(rlzData) {
    			console.log(rlzData);
    			applyOnUploadPage(rlzData);
    		},
    		console.error);
		xhr.send();
  };
  reader.readAsText(nfoFile);
};

})();