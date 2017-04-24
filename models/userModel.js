var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userModel = new Schema({
	lastName: {
		type: String
	},
	firstName: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	languages: {
		type: []
	},
	salt: {
		type: String
	},
	secretOne: {
		type: String
	},
	secretTwo: {
		type: String
	},
	responsible: {
		type: Boolean
	}
});

module.exports=mongoose.model('user', userModel);