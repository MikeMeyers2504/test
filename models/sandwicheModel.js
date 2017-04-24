var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var sandwicheModel = new Schema({
	email: {
		type: String
	},
	sortBread: {
		type: String
	},
	bread: {
		type: String
	},
	amount: {
		type: String
	},
	totalPrice: {
		type: String
	},
	sauceOne: {
		type: String
	},
	sauceTwo: {
		type: String
	},
	vegetables: {
		type: Boolean
	}
});

module.exports=mongoose.model('sandwiche', sandwicheModel);