// Pour faire du traitement sur les données DL/UL des peers
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
	}
	
	//http://en.wikipedia.org/wiki/Mean#Harmonic_mean_.28HM.29
	self.getHarmonicMean = function() {
	    var sum = 0, length = theArray.length; 
	    for(var i=0;i<length;i++) {
	    	var val = theArray[i];
	    	if (Number.isFinite(val)) sum += (1/val);
	        else length--;
	    }
	    return length/sum;
	}
	
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
	}
	
	//http://en.wikipedia.org/wiki/Median
	self.getMedian = function() {
	    var length = theArray.length; 
	    var middleValueId = Math.floor(length/2);
	    var arr = theArray.sort(function(a, b){return a-b;});
	    return arr[middleValueId];
	}
	
	self.setArray = function(arr) {
		theArray = arr; 
		return self; 
	}
	
	self.getArray = function() {
		return theArray; 
	}
	
	return self; 
};
// #endregion

// #region Original:https://www.t411.me/themes/blue/js/theme.min.js
$("a.ajax[href^='/torrents/peers-list/']").overlay().onBeforeLoad=
	function() {
		var href = this.getTrigger().attr('href');
		$('#info')
				.find('.inner')
				.html('<span class=\"loading\">Loading...</span>');
		$.ajax({
					url : href,
					dataType : 'json',
					success : function(data) {
						//if (data.status == 'OK') $('#info').find('.inner').html(data.response);
						//else $('#info').find('.inner').html(data.response);
						var inner = $('#info').find('.inner');
						inner.html(data.response);
						var htmle = inner[0];
						// Ajout entête
						var head = htmle.querySelector('tbody>tr');
						var colHead = document.createElement('th');
						colHead.width = '80px';
						colHead.textContent = 'Ratio';
						head.appendChild(colHead);
						
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
						var rows = htmle.querySelectorAll('tr');
						var allDown=[], allUp=[], allRatio=[];
						//Extraction des données
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
						console.log(allRatio);
						
						// Injection
						for (var itRow=1; itRow<rows.length; itRow++) {
							var row = rows[itRow];
							var ratio = allRatio[itRow-1];
							var rCell = document.createElement('td');
							rCell.textContent = (ratio).toFixed(2);
							if (ratio<allRatio.plusUnEcart) rCell.classList.toggle("up");
							else if (ratio>allRatio.plusDeuxEcarts) rCell.classList.toggle("down");
							row.appendChild(rCell);
						}
						
						var meanRow = document.createElement("tr");
						var medianRow = document.createElement("tr");
						var ecartRow = document.createElement("tr");
						meanRow.innerHTML = '<td colspan="3" align="right">Moyenne</td><td>'+toHumanBytes(allDown.mean)+'</td><td>'+toHumanBytes(allUp.mean)+'</td><td>'+allRatio.mean.toFixed(4)+'</td>';
						medianRow.innerHTML = '<td colspan="3" align="right">M&eacutediane</td><td>'+toHumanBytes(allDown.median)+'</td><td>'+toHumanBytes(allUp.median)+'</td><td>'+allRatio.median.toFixed(4)+'</td>';
						ecartRow.innerHTML = '<td colspan="3" align="right">Ecart type</td><td>'+allDown.ecart.toFixed(2)+'</td><td>'+allUp.ecart.toFixed(2)+'</td><td>'+allRatio.ecart.toFixed(4)+'</td>';
						var tbody = htmle.querySelector('tbody');
						tbody.appendChild(meanRow);
						tbody.appendChild(medianRow);
						tbody.appendChild(ecartRow);
					}
				});
	};
// #endregion