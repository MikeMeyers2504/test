var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcrypt');

var userController = function(User){
	var post = function(req, res){
		var finded = false;
		console.log(req.body.email);
		collUsers.find({"email": req.body.email}).toArray(function(err, user){
			if (user.length != []) {
				finded = true;
				console.log(user);
			} else{
				finded = false;
				console.log(user);
			}
			console.log(finded);
			if (finded == false) {
				var user = new User(req.body);
				console.log(user.password);
				bcrypt.genSalt(10, function(err, salt){
					bcrypt.hash(user.password, salt, function(err, hashP){
							user.password = hashP;
						bcrypt.hash(user.secretOne, salt, function(err, hashO){
							user.secretOne = hashO;
							bcrypt.hash(user.secretTwo, salt, function(err, hashT){
								user.secretTwo = hashT;
								user.salt = salt;
								console.log(salt);
								collUsers.save(user);
								console.log('saved');
							});
						});
					});
				});
				// res.status(201).send(user);
				res.send({success: true, message: 'Account has added!'});
			} else{
				res.send({success: false, message: 'The account you are creating already exists, please use an other email account.'});
			}
		});		
	}

	var put = function(req, res){
		var email = req.body.email;
		var secretOne = req.body.secretOne;
		var secretTwo = req.body.secretTwo;
		var password = req.body.password;
		var salt;
		collUsers.find({"email": email}).toArray(function(err, user){
			if (user == undefined) {
				res.send('Nothing found');
			}	
			else if (user.length == []) {
				res.send({success: false, message: 'There is no user with this email'});
			}
			else {
				salt = user[0].salt;
				bcrypt.compare(secretOne, user[0].secretOne, function(err, cryptedOne){
					if (cryptedOne) {
						console.log('Answer 1 hashes matches');
						bcrypt.compare(secretTwo, user[0].secretTwo, function(err, cryptedTwo){
							if (cryptedTwo) {
								console.log('Answer 2 hashes matches');
								bcrypt.hash(password, salt, function(err, hash){
									if (hash != undefined) {
										user[0].password = hash;
										collUsers.save(user[0]);
										console.log(user);
										console.log('Password of the user has been changed');
										res.send({success: true, message: 'Password of the user has been changed'});
									} else {
										console.log(err);
									}
								});
							} else {
								res.send({success: false, message: 'Answer 2 does not match'});
							}
						})
					} else{
						res.send({success: false, message: 'Answer 1 does not match'});
					}
				});
			}
		});
	}

	var get = function(req, res){
		var query = req.query;
		collUsers.find(query).toArray(function(err, users){
			if (err) {
				res.status(500).send(err);
			}
			else {
    			var returnUsers = [];
    			users.forEach(function(element){
    				var newUser = element;
    				newUser.links = {};
    				newUser.links.this = 'http://' + req.headers.host + '/api/users/' + newUser._id;
    				returnUsers.push(newUser);
    			});
    			res.send(returnUsers);
			}
			// else {
   //  			console.log("retrieved records:");
   //  			console.log(users);	
   //  			res.send(users);
   //  		}
		});
	}
	var getId = function(req, res){
		var id = req.params.id;
		console.log(id);
		var o_id = new ObjectId(id);
		console.log(o_id);
		collUsers.find(o_id).toArray(function(err, user){
			if (err) {
				res.status(500).send(err);
			}
			else {
    			console.log("retrieved record:");
    			console.log(user);
    			res.send(user);
    		}
		});
	}
	var putId = function(req, res){
		var user = new User(req.body);
		collUsers.save(user);
		res.status(201).send(user);
	}
	var deleteId = function(req, res){ 
    	var id = req.params.id;
    	collUsers.remove({_id  : ObjectId(id)},
    	function(err, result){
    		if (err) {res.status(500).send(err);}
    		else{
    			res.status(204).send('Deleted');
    		};
    	});
	}

	return {
		post: post,
		put: put,
		get: get,
		getId: getId,
		putId: putId,
		deleteId: deleteId
	}
}

module.exports = userController;