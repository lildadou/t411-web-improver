/**
 * 
 */
function initializeView(settings) {
	var inputs = document.querySelectorAll("input");
	for (var i=0; i < inputs.length; i++) {
		var input		= inputs[i];
		var dataPath	= input.id;
		var dataValue	= dojo.getObject(dataPath, false, settings);
		
		switch (input.type) {
		case 'checkbox':	input.checked	= dataValue; break;
		case 'number':		input.value		= dataValue; break;
		default: console.warn('settings_ctrl.initializeView: Le type de l\'input %s n\'est pas pris en charge.', input.id);
		}
	}
}

getSettings(initializeView);