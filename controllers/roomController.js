var ObjectId = require('mongodb').ObjectId;

var roomController = function(Room){
	var post = function(req, res){
		var room = new Room(req.body);
		console.log(room);
		collMeetingRooms.save(room);
		//res.status(201).send(room);
		res.send({success: true});
	}
	var get = function(req, res){
		var query = req.query;
		collMeetingRooms.find(query).toArray(function(err, rooms){
			if (err) {
				res.status(500).send(err);
			}
			else {
    			var returnRooms = [];
    			rooms.forEach(function(element){
    				var newRoom = element;
    				newRoom.links = {};
    				newRoom.links.this = 'http://' + req.headers.host + '/api/rooms/' + newRoom._id;
    				returnRooms.push(newRoom);
    			});
    			res.send(returnRooms);
			}
			// else {
   //  			console.log("retrieved records:");
   //  			console.log(rooms);	
   //  			res.send(rooms);
   //  		}
		});
	}
	var getId = function(req, res){
		var id = req.params.id;
		console.log(id);
		var o_id = new ObjectId(id);
		console.log(o_id);
		collMeetingRooms.find(o_id).toArray(function(err, room){
			if (err) {
				res.status(500).send(err);
			}
			else {
    			console.log("retrieved record:");
    			console.log(room);
    			res.send(room);
    		}
		});
	}
	var putId = function(req, res){
		var room = new Room(req.body);
		collMeetingRooms.save(room);
		res.status(201).send(room);
	}
	var patchId = function(req, res){
		var updateObject = req.body; 
    	var id = req.params.id;
    	collMeetingRooms.update({_id  : ObjectId(id)}, {$set: updateObject},
    	function(err, result){
    		if (err) {throw err;res.status(500).send(err);}
    		else{
    			res.send(result);
    		};
    	});
	}
	var deleteId = function(req, res){ 
    	var id = req.params.id;
    	collMeetingRooms.remove({_id  : ObjectId(id)},
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
		deleteId: deleteId,
		patchId: patchId
	}
}

module.exports = roomController;