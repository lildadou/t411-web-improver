// Author: Daniel L. (aka lildadou)
(function() {
var nfoInput = document.getElementsByName("nfo")[0];

var getNamedSections = function(nfoJson, sectionName) {
  var result=[];
  for (var i=0; i<nfoJson.length; i++) if (nfoJson[i].sectionName==sectionName) result.push(nfoJson[i]);
  return result;
};

/* Convertie un NFO brut (une String) en tableau. Chaque case 
 * du tableau contient une section (General, Video, Text, ...)
 * sous forme JSON.
*/
var nfo2json = function(nfoText) {
  var lines = nfoText.split('\n');
  var sectionRegex = /^\w+$/;
  var entrieRegex =  /^(\w+([\s\(\)\/\*]{1,2}\w+)*[\(\)\/\*]?)\s*: (.+)$/;
  var result = []; var currentSection={};
  for (var i=0; i<lines.length; i++) {
    var l = lines[i];
    var sectionName = sectionRegex.exec(l);
    var entrie = entrieRegex.exec(l);
    if (sectionName != null) { // Nouvelle section
      currentSection = {};
      currentSection.sectionName = sectionName[0];
      result.push(currentSection);
    } else if (entrie != null) { // Nouvelle entrée
      currentSection[entrie[1]] = entrie[3];
    }
  }
  
  // Conversion des numéraires
  var s = getNamedSections(result, "Video");
  for (var i=0; i<s.length; i++) {
    s[i]["Width"] = Number(/(\d+(\s\d+)*)/.exec(s[i]["Height"])[1].replace(" ",""));
    s[i]["Height"] = Number(/(\d+(\s\d+)*)/.exec(s[i]["Height"])[1].replace(" ",""));
    s[i]["Frame rate"] = Number(/(\d+(\.\d+)*)/.exec(s[i]["Frame rate"])[1]);
    s[i]["Bits/(Pixel*Frame)"] = Number(/(\d+(\.\d+)*)/.exec(s[i]["Bits/(Pixel*Frame)"])[1]);
  }
  
  return result;
};

var getFirstNamedSection = function(nfoJson, sectionName) {
  for (var i=0; i<nfoJson.length; i++) if (nfoJson[i].sectionName==sectionName) return nfoJson[i];
  return null;
};


var nfoJsonDecoder = function(nfoJson) {
  var result = {};
  var g = getFirstNamedSection(nfoJson, "General");
  var v = getFirstNamedSection(nfoJson, "Video");
  //var a = getFirstNamedSection(nfoJson, "Audio");
  //var s = getFirstNamedSection(nfoJson, "Text");
  var fName = /^(\.\/)?(.*)$/.exec(g["Complete name"])[2];
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
  result.isPAL = ((v["Frame rate"]==25) || (v["Frame rate"]==50));

  // Langue
  result.lang = 
    (/[. -]VOSTFR[. -]/i.exec(fName))?"VOSTFR":
    (/[. -](VFF|TrueFrench)[. -]/i.exec(fName))?"VFF":
    (/[. -](VFQ|VF|French)[. -]/i.exec(fName))?"VFQ":
    (/[. -]VO[. -]/i.exec(fName))?"Anglais":
    (/[. -]multi[. -]/i.exec(fName))?"Multi":null;
  
  // qualité
  result.quality = null;
  var isHDFormat = (v["Height"] > 680);
  if (isHDFormat) {
    var bpf = v["Bits/(Pixel*Frame)"];
    result.quality = (bpf>0.26)?((v["Height"] > 1020)?"HDrip 1080":"HDrip 720"):"Mkv h.264";
  }
  
  if (/[. -](WEB|WEB-DL|WEBDL|WEBRIP|WEB-RIP)[. -]/i.exec(fName)) result.quality = "WEBrip";
  if (/[. -]HDTV[. -]/i.exec(fName)) result.quality = isHDFormat?"HDTV":"TVrip";
  if (/[. -]dvdrip[. -]/i.exec(fName)) result.quality = "DVDrip";
  
  return result;
};

var applyOnUploadPage = function(nfo) {
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

nfoInput.onchange = function(e) {
  var nfoFile = nfoInput.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    window.nfoJson = nfo2json(reader.result);
    window.nfo = nfoJsonDecoder(window.nfoJson);
    applyOnUploadPage(nfo);
  };
  reader.readAsText(nfoFile);
};
})();