/**
 * 
 */
var currentSettings = null;
function initializeView(settings) {
	currentSettings = settings;
	var inputs = document.querySelectorAll("input");
	for (var i=0; i < inputs.length; i++) {
		var input		= inputs[i];
		var dataPath	= input.id;
		var dataValue	= dojo.getObject(dataPath, false, settings);
		
		switch (input.type) {
		case 'checkbox':	input.checked	= dataValue; break;
		case 'text':
		case 'number':		input.value		= dataValue; break;
		default: console.warn('settings_ctrl.initializeView: Le type de l\'input %s n\'est pas pris en charge.', input.id);
		}
		
		input.addEventListener('change', optionChangeListener);
	}
}

function optionChangeListener(event) {
	var srcElement = event.srcElement;
	var optId = srcElement.id;
	getSettings(function(settings) {
		switch(event.srcElement.type) {
		case 'checkbox':	
			dojo.set(optId, false, currentSettings, srcElement.checked); break;
		default:
			dojo.set(optId, false, currentSettings, srcElement.value);
		}
		
		saveSettings(currentSettings, function(e) {console.log('Configuration enregistrée');});
	});
}

getSettings(initializeView);