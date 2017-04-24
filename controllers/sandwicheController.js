var ObjectId = require('mongodb').ObjectId;

var sandwicheController = function(Sandwiche){
	var post = function(req, res){
		var sandwiche = new Sandwiche(req.body);
		console.log(sandwiche);
		collSandwiches.save(sandwiche);
		//res.status(201).send(sandwiche);
		res.send({success: true});
	}
	var deleteAll = function(req, res){
		collSandwiches.remove();
		if (res.status(200)) {
			res.send({success: true});
		}else {
			res.send({success: false});
		}
		//res.send({success: true});
    	/*collSandwiches.remove({},
    	function(err, result){
    		if (err) {res.status(500).send(err);}
    		else{
    			//res.status(204).send('Deleted all the documents of the collection');
    			res.send({success: true});
    		};
    	});*/
	}
	var get = function(req, res){
		var query = req.query;
		collSandwiches.find(query).toArray(function(err, sandwiches){
			if (err) {
				res.status(500).send(err);
			}
			else {
    			var returnSandwiches = [];
    			sandwiches.forEach(function(element){
    				var newSandwiche = element;
    				newSandwiche.links = {};
    				newSandwiche.links.this = 'http://' + req.headers.host + '/api/sandwiches/' + newSandwiche._id;
    				returnSandwiches.push(newSandwiche);
    			});
    			res.send(returnSandwiches);
			}
			// else {
   //  			console.log("retrieved records:");
   //  			console.log(sandwiches);	
   //  			res.send(sandwiches);
   //  		}
		});
	}
	var putId = function(req, res){
		var sandwiche = new Sandwiche(req.body);
		collSandwiches.save(sandwiche);	//.save kan een probleem geven me de app omdat je het id mee moet geven in de body tenzij ik het id in de app kan opvragen kan het zijn dat het wel in orde is, moest het toch zo zijn, dan gebruik maken van .update -> nog is checken hoe dat juist in elkaar zit met https://docs.mongodb.com/manual/reference/method/db.collection.update/
		res.status(201).send(sandwiche);
	}
	var patchId = function(req, res){
		var updateObject = req.body; 
    	var id = req.params.id;
    	collSandwiches.update({_id  : ObjectId(id)}, {$set: updateObject},
    	function(err, result){
    		if (err) {throw err;res.status(500).send(err);}
    		else{
    			res.send(result);
    		};
    	});
	}
	var deleteId = function(req, res){ 
    	var id = req.params.id;
    	collSandwiches.remove({_id  : ObjectId(id)},
    	function(err, result){
    		if (err) {res.status(500).send(err);}
    		else{
    			res.status(204).send('Deleted');
    		};
    	});
	}
	var getId = function(req, res){
		var id = req.params.id;
		console.log(id);
		var o_id = new ObjectId(id);
		console.log(o_id);
		collSandwiches.find(o_id).toArray(function(err, sandwiche){
			if (err) {
				res.status(500).send(err);
			}
			else {
    			console.log("retrieved record:");
    			console.log(sandwiche);
    			res.send(sandwiche);
    		}
		});
	}

	return {
		post: post,
		get: get,
		deleteAll: deleteAll,
		getId: getId,
		putId: putId,
		patchId: patchId,
		deleteId: deleteId
	}
}

module.exports = sandwicheController;