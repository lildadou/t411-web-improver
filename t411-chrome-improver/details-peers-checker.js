// Pour faire du traitement sur les données DL/UL des peers
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
						var inner = $('#info').find('.inner');
						inner.html(data.response);
						var htmle = inner[0];
						
						//Extraction des données
						var stats = extractPeersInfo(htmle);
						var allDown=stats.down, allUp=stats.up, allRatio=stats.ratio;
						
						// #region Injection HTML
						// Ajout entête
						var head = htmle.querySelector('tbody>tr');
						var colHead = document.createElement('th');
						colHead.width = '80px';
						colHead.textContent = 'Ratio';
						head.appendChild(colHead);
						
						// Injection ratio locaux
						var rows = htmle.querySelectorAll('tr');
						for (var itRow=1; itRow<rows.length; itRow++) {
							var row = rows[itRow];
							var ratio = allRatio[itRow-1];
							var rCell = document.createElement('td');
							rCell.textContent = (ratio).toFixed(2);
							if (ratio<allRatio.plusUnEcart) rCell.classList.toggle("up");
							else if (ratio>allRatio.plusDeuxEcarts) rCell.classList.toggle("down");
							row.appendChild(rCell);
						}
						
						// Injection stats descriptives
						var meanRow = document.createElement("tr");
						var medianRow = document.createElement("tr");
						var ecartRow = document.createElement("tr");
						meanRow.innerHTML = '<td colspan="3" align="right">Moyenne</td><td>'+toHumanBytes(allDown.mean)+'</td><td>'+toHumanBytes(allUp.mean)+'</td><td>'+allRatio.mean.toFixed(4)+'</td>';
						medianRow.innerHTML = '<td colspan="3" align="right">M&eacutediane</td><td>'+toHumanBytes(allDown.median)+'</td><td>'+toHumanBytes(allUp.median)+'</td><td>'+allRatio.median.toFixed(4)+'</td>';
						ecartRow.innerHTML = '<td colspan="3" align="right">Ecart type</td><td>'+toHumanBytes(allDown.ecart)+'</td><td>'+toHumanBytes(allUp.ecart)+'</td><td>'+allRatio.ecart.toFixed(4)+'</td>';
						var tbody = htmle.querySelector('tbody');
						tbody.appendChild(meanRow);
						tbody.appendChild(medianRow);
						tbody.appendChild(ecartRow);
						// #endregion
					}
				});
	};
// #endregion