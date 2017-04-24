var ObjectId = require('mongodb').ObjectId;
var stringify = require('safe-json-stringify');

var checkinController = function(Checkin){
	var post = function(req, res){
		var checkin = new Checkin(req.body);
		console.log(checkin);
		collCheckins.save(checkin);
		//res.status(201).send(checkin);
		res.send({success: true});
	}
	var get = function(req, res){
		var query = req.query;
		collCheckins.find(query).toArray(function(err, checkins){
			if (err) {
				res.status(500).send(err);
			}
			else {	
    			var returnCheckins = [];
    			checkins.forEach(function(element, index, array){
    				var newCheckin = element;
    				newCheckin.links = {};
    				newCheckin.links.this = 'http://' + req.headers.host + '/api/checkins/' + newCheckin._id;
    				returnCheckins.push(newCheckin);
    			});
    			res.send(returnCheckins);
			}
			// else {
			// 	console.log("retrieved records:");
   			//  console.log(checkins);	
   			//  res.send(checkins);
			// }
		});
	}
	var getId = function(req, res){
		var id = req.params.id;
		console.log(id);
		var o_id = new ObjectId(id);
		console.log(o_id);
		collCheckins.find(o_id).toArray(function(err, checkin){
			if (err) {
				res.status(500).send(err);
			}
    		else {
    			console.log("retrieved record:");
    			console.log(checkin);
    			res.send(checkin);
    		}
		});
	}

	var putId = function(req, res){
		var checkin = new Checkin(req.body);
		collCheckins.save(checkin);
		res.status(201).send(checkin);
	}
	var deleteId = function(req, res){ 
    	var id = req.params.id;
    	collCheckins.remove({_id  : ObjectId(id)},
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

module.exports = checkinController;