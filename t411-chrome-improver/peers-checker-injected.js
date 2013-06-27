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
						console.log("YAAAH");
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
						var rows = htmle.querySelectorAll('tr');
						//Ajout ratio
						for (var itRow=1; itRow<rows.length; itRow++) {
							var row = rows[itRow];
							var down = getBytes(row.querySelectorAll('td')[3].textContent);
							var up = getBytes(row.querySelectorAll('td')[4].textContent);
							var rCell = document.createElement('td');
							rCell.textContent = (up/down).toFixed(2);
							row.appendChild(rCell);
						}
						
					}
				});
	};
// #endregion