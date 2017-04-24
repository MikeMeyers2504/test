var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var checkinModel = new Schema({
	email: {
		type: String
	},
	date: {
		type: String
	},
	time: {
		type: String
	}
});

module.exports=mongoose.model('checkin', checkinModel);