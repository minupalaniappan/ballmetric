import _ from 'underscore';

export var FetchTagObject = function (values) {
	/* handle shot */ 
	var tag; 
	var made = null;
	switch (true) {
		case (_.intersection(['Jump', 'Shot'], values).length === 2): 
			switch (true) {
				case _.contains('3PT'):
					tag = "3PT Jumpshot";
					break;
				case _.contains(values, 'Pull-Up'):
					tag = "Pull-up Jumpshot";
					break;
				case _.contains(values, 'Back'):
					tag = "Stepback Jumpshot";
					break;
				case _.contains(values, 'Turnaround'):
					tag = "Turnaround Jumpshot";
					break;
				default:
					break;
			}
			break;
		case _.contains(values, 'Hook'):
			tag = "Hook shot";
			break;
		case _.contains(values, 'Fadeaway'):
			tag = "Fadeaway Jumpshot";
			break;
		case _.contains(values, 'Floating'):
			tag = "Floater"
			break;
		case _.contains(values, 'Shot') ||  _.contains(values, 'Jump'):
			tag = "Shot"
			break;
		case _.contains(values, 'REBOUND') || _.contains(values, 'REB'):
			tag = "Rebound"
			break;
		case _.contains(values, 'STEAL') || _.contains(values, 'STL'):
			tag = "Steal";
			break;
		case (_.contains(values, 'TURNOVER') || 
			  _.contains(values, 'TO') ||
			  _.contains(values, 'Traveling') || 
			  _.contains(values, 'Bad')):
			tag = "Turnover";
			break;
		case _.contains(values, 'DUNK') || _.contains(values, 'Dunk'):
			tag = "Dunk"
			break;
		case _.contains(values, 'ASSIST') || _.contains(values, 'AST'):
			tag = "Assist";
			break;
		case _.contains(values, 'Driving') || _.contains(values, 'Running') || _.contains(values, 'Layup'):
			tag = "Layup";
			break;
		case _.contains(values, 'FT') || _.contains(values, 'Free Throw'):
			tag = "Free Throw";
			break;
		case _.contains(values, 'BLOCK') || _.contains(values, 'BLO'):
			tag = "Block";
			break;
		case _.contains(values, 'P.FOUL') || _.contains(values, 'FOUL'):
			tag = "Foul"
			break;
		default:
			break;
	}
	if (tag === undefined) {
		tag = "Midrange jumper"
	}
	if (_.contains(values, 'MISS')) {
		made = false;
	} else if (tag != "Block" && tag != "Steal" && tag != "Assist" && tag != "Turnover" && tag != "Rebound") {
		made = true;
	}
	console.log(values);
	if (tag === null) {
		console.log(values);
	}
	return ({
		value: tag,
		made: made
	});
}

