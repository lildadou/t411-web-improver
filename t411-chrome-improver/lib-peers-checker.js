// Author: http://clauswitt.com/simple-statistics-in-javascript.html
function Stats(arr) {
	var self = this; 
	var theArray = arr || []; 
	
	//http://en.wikipedia.org/wiki/Mean#Arithmetic_mean_.28AM.29
	self.getArithmeticMean = function() {
	    var sum = 0, length = theArray.length; 
	    for(var i=0;i<length;i++) {
	    	var val = theArray[i];
	    	if (Number.isFinite(val)) sum += val;
	    	else length--;
	    }
	    return sum/length; 
	};
	
	//http://en.wikipedia.org/wiki/Mean#Geometric_mean_.28GM.29
	self.getGeometricMean = function() {
	    var product = 1, length = theArray.length; 
	    for(var i=0;i<length;i++) {
	    	var val = theArray[i];
	    	if (Number.isFinite(val)) product = product * val;
	    	else length--;
	    }
        return Math.pow(product,(1/length));
	};
	
	//http://en.wikipedia.org/wiki/Mean#Harmonic_mean_.28HM.29
	self.getHarmonicMean = function() {
	    var sum = 0, length = theArray.length; 
	    for(var i=0;i<length;i++) {
	    	var val = theArray[i];
	    	if (Number.isFinite(val)) sum += (1/val);
	        else length--;
	    }
	    return length/sum;
	};
	
	//http://en.wikipedia.org/wiki/Standard_deviation
	self.getStandardDeviation = function() {
	    var arithmeticMean = this.getArithmeticMean(); 
        var sum = 0, length = theArray.length; 
	    for(var i=0;i<length;i++) {
	    	var val = theArray[i];
	    	if (Number.isFinite(val)) sum += Math.pow(val-arithmeticMean, 2);
	        else length--;
	    }
	    return Math.pow(sum/length, 0.5);
	};
	
	//http://en.wikipedia.org/wiki/Median
	self.getMedian = function() {
	    var length = theArray.length; 
	    var middleValueId = Math.floor(length/2);
	    var arr = theArray.sort(function(a, b){return a-b;});
	    return arr[middleValueId];
	};
	
	self.setArray = function(arr) {
		theArray = arr; 
		return self; 
	};
	
	self.getArray = function() {
		return theArray; 
	};
	
	return self; 
};
// #endregion

var getBytes = function(text) {
	var re = /(\d+(\.\d+)?) ([MGT])?B/;
	var vol = Number(re.exec(text)[1]);
	var mult = re.exec(text)[3];
	switch(mult) {
		case undefined: mult=1; break;
		case 'M': mult=1024; break;
		case 'G': mult=1024*1024; break;
		case 'T': mult=1024*1024*1024; break;
	}
	return vol*mult;
};

var toHumanBytes = function(b) {
	if (b<1024) return b+" B";
	else if (b<1024*1024) return (b/1024).toFixed(2)+" MB";
	else if (b<1024*1024*1024) return (b/(1024*1024)).toFixed(2)+" GB";
	else return (b/(1024*1024*1024)).toFixed(2)+" TB";
};

var extractPeersInfo = function(html) {
	var htmle = html;
	if (typeof html ==="string") {
		htmle = document.createElement("div");
		htmle.innerHTML = html;
	}
	
	var rows = htmle.querySelectorAll('tr');
	var allDown=[], allUp=[], allRatio=[];
	for (var itRow=1; itRow<rows.length; itRow++) {
		var row = rows[itRow];
		var down = getBytes(row.querySelectorAll('td')[3].textContent);
		var up = getBytes(row.querySelectorAll('td')[4].textContent);
		allDown.push(down);
		allUp.push(up);
		allRatio.push(up/down);
	}
	allDown.stats = new Stats(allDown.slice(0));
	allDown.mean = allDown.stats.getArithmeticMean();
	allDown.ecart =allDown.stats.getStandardDeviation();
	allDown.median=allDown.stats.getMedian();
	allUp.stats = new Stats(allUp.slice(0));
	allUp.mean = allUp.stats.getArithmeticMean();
	allUp.ecart =allUp.stats.getStandardDeviation();
	allUp.median=allUp.stats.getMedian();
	allRatio.stats = new Stats(allRatio.slice(0));
	allRatio.mean = allRatio.stats.getArithmeticMean();
	allRatio.ecart =allRatio.stats.getStandardDeviation();
	allRatio.median=allRatio.stats.getMedian();
	allRatio.plusUnEcart = allRatio.mean + allRatio.ecart;
	allRatio.plusDeuxEcarts = allRatio.mean + 2*allRatio.ecart;
	
	return {down:allDown, up:allUp, ratio:allRatio};
};

/**Retourne un tableau contenant tout les Torrent Id present dans le
 * tableau de resultat
 * @param {Array} rows Les lignes à analyser
 * var allTorrents= document.querySelectorAll("table.results>tbody>tr");
 */
function getAllTorrentId(rows) {
	var result = [];
	for (var i=0; i<rows.length; i++) {
		var nfoLink = rows[i].querySelector("a.nfo");
		var tId = /\d+$/.exec(nfoLink.href)[0];
		result.push(tId);
	}
	return result;
}

