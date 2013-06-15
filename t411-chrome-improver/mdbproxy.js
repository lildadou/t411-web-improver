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
		url		: 'http://imdbapi.org/',
		method	: 'GET',
		
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
			var url='http://imdbapi.org/'+mdbproxy.toGetParams(values);
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