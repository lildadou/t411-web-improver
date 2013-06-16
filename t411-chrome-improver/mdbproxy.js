// Author: http://luwes.co/populate-tiny-javascript-template-function/
String.prototype.populate = function(obj, funcs) {
	return this.replace(/\{\{\s*([^|\s}]+)\|?([^\s}]*)\s*\}\}/g, function(match, key, mods) {
		var str = obj[key];
		if (typeof str !== "undefined") {
			if (funcs && mods) {
				var arr = mods.split('|');
				for (var i = 0; i < arr.length; i++) {
					var mod = arr[i].split(':')[0];
					var par = arr[i].split(':')[1];
					var args = par ? par.split(',') : [];
					args.unshift(str);
					if (typeof funcs[mod] === "function") {
						str = funcs[mod].apply(str, args);
					}
				}
			}
			return str;
		} else {
			return match;
		}
  });
};



/* CryptoJS v3.1.2
 * code.google.com/p/crypto-js
 * (c) 2009-2013 by Jeff Mott. All rights reserved.
 * code.google.com/p/crypto-js/wiki/License
 * 
 * rollup sha1
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();


/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
component enc-base64-min
*/
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();


/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};



/**
 * @param {Array} map
 * @param {String} map[].key
 * @param {String} map[].value
 */
var http_build_query = function(map) {
	var keyValSep = '=';
	var paramSep = '&';
	var result = "";
	for (var i=0; i<map.length; i++) {
		var p = map[i];
		result += p.key+keyValSep+p.value+paramSep;
	}
	return encodeURI(result.substring(0, result.length-1));
};




mdbproxy = {
	toGetParams	: function(o) {
		var result = "?";
		for (var aParamName in o) result += aParamName+'='+o[aParamName]+'&';
		return result.substring(0, result.length-1);
	},
		
	imdbapi	: { // API fourni par http://imdbapi.org/
		translations: {
			'Action'	: "Action",
			'Adventure'	: "Aventure",
			'Animation'	: "Animation",
			'Biography'	: "Biopic",
			'Comedy'	: "Comédie",
			'Crime'		: "Policier",
			'Documentary': "Documentaire",
			'Drama'		: "Drame",
			'Family'	: "Famille",
			'Fantasy'	: "Fantastique",
			'Film-Noir'	: "Film noir",
			'History'	: "Historique",
			'Horror'	: "Horreur",
			'Music'		: "Musical",
			'Musical'	: "Musical",
			'Mystery'	: null,
			'Romance'	: "Romance",
			'Sci-Fi'	: "Science fiction",
			'Short'		: null,
			'Sport'		: "Sports",
			'Thriller'	: "Thriller",
			'War'		: "Guerre",
			'Western'	: "Western"
		},
		url_api		: 'http://imdbapi.org/',
		method		: 'GET',
		
		/**
		 * @param {RlzData} rlzData
		 * @param {Function} [onLoad]
		 * @param {Function} [onError]
		 * @returns {XMLHttpRequest}
		 */
		build	: function(rlzData, onLoad, onError) {
			var values = {
				outputFormat	: 'JSON',
				plot			: 'full',
				lang			: 'fr-FR',
				limit			: 1,
				title			: rlzData.general.title
			};
			var url=mdbproxy.imdbapi.url_api+mdbproxy.toGetParams(values);
			var result = new XMLHttpRequest();
			result.open('GET', url, true);
			result.onerror = onError;
			result.onload = function() {
				var imdbResp = JSON.parse(result.responseText)[0];
				rlzData.imdbResp = imdbResp;
				
				rlzData.general.title			= imdbResp.title;
				rlzData.general.year			= imdbResp.year;
				rlzData.general.plot			= imdbResp.plot;
				rlzData.general.poster			= imdbResp.poster;
				rlzData.general.rating			= imdbResp.rating;
				rlzData.general.rating_count	= imdbResp.rating_count;
				var orgGenres = imdbResp.genres;
				var newGenres = rlzData.general.genres = [];
				var trans = mdbproxy.imdbapi.translations;
				for (var i=0; i<orgGenres.length; i++) 
					if (trans[orgGenres[i]]) newGenres.push(trans[orgGenres[i]]);
					else console.warn("Genre inconnu: ", orgGenres[i]);
					
				if (onLoad) onLoad(rlzData);
			};
			
			return result;
		}
	}
};

mdbproxy.allocine = {
	partner_key		: '100043982026',
	secret_key		: '29d185d98c984a359e6e6f26a0474269',
	url_api			: 'http://api.allocine.fr/rest/v3/',
	user_agent		: 'Dalvik/1.6.0 (Linux; U; Android 4.2.2; Nexus 4 Build/JDQ39E)',
	
	build_url		: function(method, opts, partner_key, secret_key) {
		var id		= partner_key||mdbproxy.allocine.partner_key;
		var params	= [{key:'partner',	value: id}].concat(opts);
		var pass	= secret_key||mdbproxy.allocine.secret_key;
		var seed	= (new Date()).format("yyyymmdd");
		var sig		= 
		encodeURIComponent(
			CryptoJS.SHA1(
				pass+http_build_query(params)+"&sed="+seed
			).toString(CryptoJS.enc.Base64));
		
		var queryUrl= mdbproxy.allocine.url_api+method
			+'?'+http_build_query(params)
			+"&sed="+seed
			+"&sig="+sig;
		return queryUrl;
	},
	
	build			: function(rlzData, onLoad, onError) {
		// On doit commencer par récupérer l'ID de l'oeuvre avec un search
		var istv = rlzData.general.serie;
		var searchParams = [
	       	{key:'q',		value: rlzData.general.title},
	       	{key:'format',	value: 'json'},
	       	{key:'filter',	value: (istv)?'tvseries':'movie'},
	       	{key:'count',	value: '1'}
        ];
		var searchRequest = new XMLHttpRequest();
		var searchURL = mdbproxy.allocine.build_url('search', searchParams);
		searchRequest.open('GET', searchURL, true);
		searchRequest.onerror = onError;
		
		searchRequest.onload = function() {
			// On doit extraire l'ID de l'oeuvre
			var searchResults	= JSON.parse(searchRequest.responseText);
			var rlzAllocineCode	= searchResults.feed[(istv)?'tvseries':'movie'][0].code;
			var getParams = [
 		       	{key:'code',	value: rlzAllocineCode},
		       	{key:'profile',	value: 'large'},
		       	{key:'mediafmt',value: 'mp4-hip'},
		       	{key:'format',	value: 'json'}
	        ];
			
			var getRequest = new XMLHttpRequest();
			getRequest.open('GET', mdbproxy.allocine.build_url((istv)?'tvseries':'movie', getParams), true);
			getRequest.onerror = onError;
			getRequest.onload = function() {
				var getResults = JSON.parse(getRequest.responseText)[(istv)?'tvseries':'movie'];
				rlzData.allocine = getResults;
				console.log(getResults);
				
				// #region Enrichissemnt du RlzData
				rlzData.general.title			= getResults.title||getResults.originalTitle||rlzData.general.title;
				rlzData.general.originalTitle	= getResults.originalTitle||rlzData.general.title;
				rlzData.general.year			= getResults.yearStart||getResults.productionYear;
				rlzData.general.plot			= getResults.synopsis;
				rlzData.general.poster			= (getResults.poster)?getResults.poster.href:rlzData.general.poster;
				rlzData.general.rating			= getResults.statistics.userRating;
				rlzData.general.rating_count	= getResults.statistics.userRatingCount;
				
				if (istv) {
					rlzData.general.serie.episodeCount	= getResults.episodeCount;
					rlzData.general.serie.seasonCount	= getResults.seasonCount;
					rlzData.general.serie.episodeCount	= getResults.episodeCount;
					for (var i=0; i<getResults.season.length; i++) {
						var s = getResults.season[i];
						if (s.seasonNumber == rlzData.general.serie.season) {
							rlzData.general.serie.year = s.yearStart;
							break;
						}
					}
				}
				// #endregion
				
				if (onLoad) onLoad(rlzData);
			};
			getRequest.send();
		};
		
		return searchRequest;
	}
};

