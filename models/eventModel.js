var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var eventModel = new Schema({
	email: {
		type: String
	},
	date: {
		type: String
	},
	start: {
		type: String
	},
	end: {
		type: String
	},
	sortEvent: {
		type: String
	},
	invites: {
		type: []
	},
	where: {
		type: String
	},
	requirements: {
		type: String
	},
	transport: {
		type: Boolean,
		default: false
	},
	foodEnDrinks: {
		type: Boolean,
		default: false
	},
	name: {
		type: String
	}
});

module.exports=mongoose.model('event', eventModel);