(function() {
var ajax = function(url, params, onDone, onFail) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	//JQuery simulation
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");

	xhr.onreadystatechange = function() {//Call a function when the state changes.
		if(xhr.readyState == 4)
			if (xhr.status == 200) onDone();
			else onFail();
	};
	xhr.send(params);
};
	
// Fonction de signalement de un torrent
var sendSignal = function(tId, signalMsg) {
	ajax("/torrents/report/?id="+tId, "type=1&reason="+signalMsg,
			(function(i){ return function() {console.log(i," signalé")} })(tId)),
			(function(i){ return function() {console.error(i,"PAS signalé")} })(tId);
};

// Fonction de signalement de un torrent par commentaire
var sendCommentaire = function(tId, signalMsg) {
	ajax("/torrents/comments/", "id="+tId+"&comment="+signalMsg,
			(function(i){ return function() {console.log(i," cmt posté")} })(tId)),
			(function(i){ return function() {console.error(i," cmt PAS posté")} })(tId);
};

// Fonction de signalement de un torrent par commentaire
var vote = function(tId, vote) {
	ajax("/torrents/vote/?vote="+vote+"&id="+tId, "",
			(function(i){ return function() {console.log(i," vote prez")} })(tId)),
			(function(i){ return function() {console.error(i," PAS vote prez")} })(tId);
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
			var tId = /\d+$/.exec(row.querySelector("a.ajax").href)[0];
			if (signalMessageCheck.checked) sendSignal(tId, signalMsg);
			if (commentMessageCheck.checked) sendCommentaire(tId, commentMsg);
			if (voteCheck.checked) vote(tId, "prez");
		}
	}
};
// #endregion Ajout formulaire signaler

})();