var ObjectId = require('mongodb').ObjectId;

var checkoutController = function(Checkout){
	var post = function(req, res){
		var checkout = new Checkout(req.body);
		console.log(checkout);
		collCheckouts.save(checkout);
		//res.status(201).send(checkout);
		res.send({success: true});
	}
	var get = function(req, res){
		var query = req.query;
		collCheckouts.find(query).toArray(function(err, checkouts){
			if (err) {
				res.status(500).send(err);
			}
			else {
    			var returnCheckouts = [];
    			checkouts.forEach(function(element){
    				var newCheckout = element;
    				newCheckout.links = {};
    				newCheckout.links.this = 'http://' + req.headers.host + '/api/checkouts/' + newCheckout._id;
    				returnCheckouts.push(newCheckout);
    			});
    			res.send(returnCheckouts);
			}
			// else {
   //  			console.log("retrieved records:");
   //  			console.log(checkouts);	
   //  			res.send(checkouts);
   //  		}
		});
	}
	var putId = function(req, res){
		var checkout = new Checkout(req.body);
		collCheckouts.save(checkout);
		res.status(201).send(checkout);
	}
	var getId = function(req, res){
		var id = req.params.id;
		console.log(id);
		var o_id = new ObjectId(id);
		console.log(o_id);
		collCheckouts.find(o_id).toArray(function(err, checkout){
			if (err) {
				res.status(500).send(err);
			}
			else {
    			console.log("retrieved record:");
    			console.log(checkout);
    			res.send(checkout);
    		}
		});
	}
	var deleteId = function(req, res){ 
    	var id = req.params.id;
    	collCheckouts.remove({_id  : ObjectId(id)},
    	function(err, result){
    		if (err) {res.status(500).send(err);}
    		else{
    			res.status(204).send('Deleted');
    		};
    	});
	}

	return {
		post: post,
		get: get,
		getId: getId,
		putId: putId,
		deleteId: deleteId
	}
}

module.exports = checkoutController;