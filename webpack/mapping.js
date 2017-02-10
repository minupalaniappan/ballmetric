import _ from 'underscore';

export var FetchTagObject = function (values) {
	/* handle shot */ 
	var objToReturn;
	switch (true) {
		case (_.contains(values, 'Layup') || _.contains(values, 'Dunk')):
			objToReturn = classifyAthletic(values)
			break;
		case (_.contains(values, 'Shot') || _.contains(values, 'Jump')):
			objToReturn = classifyShot(values)
			break;
		case _.contains(values, 'REB') || _.contains(values, 'REBOUND') || _.contains(values, 'Rebound'):
			objToReturn = classifyRebound(values)
			break;
		case _.contains(values, 'AST') || _.contains(values, 'ASSIST') || _.contains(values, 'Assist'):
			objToReturn = classifyAssist(values)
			break;
		case _.contains(values, 'TO') || _.contains(values, 'TURNOVER') || _.contains(values, 'Turnover'):
			objToReturn = classifyTurnover(values)
			break;
		case _.contains(values, 'BLO') || _.contains(values, 'BLOCK') || _.contains(values, 'Block'):
			objToReturn = classifyBlock(values)
			break;
		case _.contains(values, 'STL') || _.contains(values, 'STEAL') || _.contains(values, 'Steal'):
			objToReturn = classifySteal(values)
			break;
		case _.contains(values, 'FOUL') || _.contains(values, 'P.FOUL'):
			objToReturn = classifyFoul(values)
			break;
		case _.contains(values, 'SUB') || _.contains(values, 'SUBSITUTION') || _.contains(values, 'Steal'):
			objToReturn = classifySubstitution(values)
			break;
		case _.contains(values, 'Tip'):
			objToReturn = classifyTip(values)
			break;
		default: 
			return null; 
	}

	return (objToReturn);	
}

var classifyFoul = function (values) {
	var category = {
		type: 'posession', 
		form: 'foul', 
		style: ""
	} 
	return (category);
}

var classifyAthletic = function () {
	var category = {
		type: 'athletic', 
		form: "", 
		style: ""
	} 

	return category;
}

var classifySubstitution = function (values) {
	var category = {
		type: 'posession', 
		form: 'sub', 
		style: ""
	} 
	return (category);
}

var classifySteal = function (values) {
	var category = {
		type: 'defense', 
		form: 'steal', 
		style: ""
	} 
	return (category);
}

var classifyRebound = function (values) {
	var category = {
		type: 'possesion', 
		form: 'rebound', 
		style: ""
	} 
	return (category);
}

var classifyAssist = function (values) {
	var category = {
		type: 'offense', 
		form: 'dime', 
		style: ""
	} 
	return (category);
}	

var classifyBlock = function (values) {
	var category = {
		type: 'defense', 
		form: 'block', 
		style: ""
	} 
	return (category);
}

var classifyTurnover = function (values) {
	var styles = values.filter((elem) => { 
		switch (elem) {
			case "Bad": 
				return ("Bad Pass Turnover");
			default: 
				return ("Unknown Turnover");
		}
	})[0];
	var category = {
		type: 'possesion', 
		form: 'error', 
		style: styles
	} 
	return (category);
}

var classifyShot = function (values) {
	var distance = values.filter((elem) => { return (elem.length < 3) });
	var styles = values.filter((elem) => { 
		switch (elem) {
			case "Back": 
				return ("Step back");
			case "Pull-up":
				return ("Pullin' up"); 
			case "Running": 
				return ("Floater");
			default: 
				return ("Fade away");
		}
	})[0];
	var category = {
		type: 'offense', 
		form: 'sniper', 
		distance: parseInt(distance),
		range: determineDistance(parseInt(distance)), 
		made: _.contains(values, 'MISS'), 
		style: styles
	} 

	return (category);
}

var determineDistance = function (range) {
	switch (true) {
		case (0 < range && range < 5):
			return ("Interior");
			break;
		case (range > 4 && range < 25):
			return ("Mid-range"); 
			break;
		default:
			return ("Long-distance");
			break;
	}
}

