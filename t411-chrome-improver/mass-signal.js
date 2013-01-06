(function() {
// Fonction de signalement de un torrent
var sendSignal = function(tId, signalMsg) {
	$.ajax({
		type: "POST",
		url: "/torrents/report/?id="+tId,
		data: { type:1, reason: signalMsg }
	}).done((function(i){ return function() {console.log(i," signalé")} })(tId))
	.fail((function(i){ return function() {console.error(i,"PAS signalé")} })(tId));
};

// Fonction de signalement de un torrent par commentaire
var sendCommentaire = function(tId, signalMsg) {
	$.ajax({
		type: "POST",
			url: "/torrents/comments/",
			data: { id:tId, comment: signalMsg }
		}).done((function(i){ return function() {console.log(i," msg posté")} })(tId))
		.fail((function(i){ return function() {console.error(i," msg PAS posté")} })(tId));
};

// Fonction de signalement de un torrent par commentaire
var vote = function(tId, vote) {
	$.ajax({
		type: "POST",
		url: "/torrents/vote/?vote="+vote+"&id="+tId
		}).done((function(i){ return function() {console.log(i," vote prez")} })(tId))
		.fail((function(i){ return function() {console.error(i," PAS vote prez")} })(tId));
};


// Ajout checkbox ALL
var headRow = document.querySelector("table.results>thead>tr");
var selectAll = document.createElement("th");
var checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.onchange = function() {
	var c = document.querySelectorAll("table.results>tbody input[type=checkbox]");
	for (i=0; i<c.length; i++) c[i].checked=checkbox.checked;
};
selectAll.appendChild(checkbox);
headRow.insertBefore(selectAll, headRow.children[0]);

// Ajout checkbox individuelle
var allTorrents= document.querySelectorAll("table.results>tbody>tr");
for (var i=0; i<allTorrents.length; i++) {
	var cas = document.createElement("td");
	var cb = document.createElement("input");
	cb.type = "checkbox";
	cas.appendChild(cb);
	allTorrents[i].insertBefore(cas, allTorrents[i].children[0]);
}

// #region Ajout formulaire signaler
var form = document.querySelector("table.results").parentElement;

// Partie signalement aux modérateurs
var divSignal = document.createElement("div");
var signalMessageCheck = document.createElement("input");
signalMessageCheck.type = "checkbox";
signalMessageCheck.checked = true;
var label = document.createElement("label");
label.textContent = "Message aux modérateurs: ";
var signalMessageArea = document.createElement("input");
signalMessageArea.type="text";
signalMessageArea.style.width="50%";
signalMessageArea.value="Mauvaise catégorie.\nClassé HDRip au lieu de TVrip HD (HDTV).";
divSignal.appendChild(signalMessageCheck);
divSignal.appendChild(label);
divSignal.appendChild(signalMessageArea);
form.appendChild(divSignal);

// Partie signalement par commentaire
var divMsg = document.createElement("div");
var commentMessageCheck = document.createElement("input");
commentMessageCheck.type = "checkbox";
commentMessageCheck.checked = true;
var label = document.createElement("label");
label.textContent = "Message aux uploaders: ";
var commentMessageArea = document.createElement("input");
commentMessageArea.type="text";
commentMessageArea.style.width="50%";
commentMessageArea.value="Votre titre contient HDTV mais votre post n'est pas classé dans cette catégorie (ni dans TVrip). Pour ces raisons je préviens la modération et je vote mauvaise prez.";
divMsg.appendChild(commentMessageCheck);
divMsg.appendChild(label);
divMsg.appendChild(commentMessageArea);
form.appendChild(divMsg);

// Partie vote
var divMsg = document.createElement("div");
var voteCheck = document.createElement("input");
voteCheck.type = "checkbox";
var label = document.createElement("label");
label.textContent = "Voter Mauvaise Prez";
divMsg.appendChild(voteCheck);
divMsg.appendChild(label);
form.appendChild(divMsg);


var sendButton = document.createElement("input");
sendButton.type="submit";
sendButton.classList.add("btn");
sendButton.classList.add("alignright");
sendButton.value="Signaler";
form.appendChild(sendButton);

// Fonction de recap avant envoi
sendButton.onclick = function() {
	var allTorrents= document.querySelectorAll("table.results>tbody>tr");
	var signalMsg = signalMessageArea.value;
	var commentMsg = commentMessageArea.value;
	for (var i=0; i<allTorrents.length; i++) {
		var row = allTorrents[i];
		if (row.querySelector("input").checked) {
			var tId = /\d+$/.exec(row.querySelector("a.nfo").href)[0];
			if (signalMessageCheck.checked) sendSignal(tId, signalMsg);
			if (commentMessageCheck.checked) sendCommentaire(tId, commentMsg);
			if (voteCheck.checked) vote(tId, "prez");
		}
	}
};
// #endregion Ajout formulaire signaler

})();