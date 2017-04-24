var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var roomModel = new Schema({
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
	extras: {
		type: String
	},
	room: {
		type: String
	},
	persons: {
		type: []
	}
});

module.exports=mongoose.model('room', roomModel);