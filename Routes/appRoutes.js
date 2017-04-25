var express = require('express'),
	mongodb = require('mongodb'),
	bodyParser = require('body-parser'),
	ObjectId = require('mongodb').ObjectId,
	jwt = require('jsonwebtoken'),
	schedule = require('node-schedule');
	bcrypt = require('bcrypt');

var MONGODB_URI = 'mongodb://Beeple:t4J&fS3k@ds163679.mlab.com:63679/beeple';

//connectie met database en de collecties toewijzen 
mongodb.MongoClient.connect(MONGODB_URI, function(err, database){
	if (err) {throw err};

	db = database;
	collUsers = db.collection('Users');
	collCheckins = db.collection('Checkins');
	collCheckouts = db.collection('Checkouts');
	collEvents = db.collection('Events');
	collMeetingRooms = db.collection('MeetingRooms');
	collSandwiches = db.collection('Sandwiches');
});


// var index = 0;
// var indexTwo;
// var arrayAll = [];

// schedule.scheduleJob('0 */59 */23 * * 1-5', () => {
// 	var array = [];
// 	var responsible;
// 	var responsibleSetFalse;
// 	collUsers.find().toArray(function(err, users){
// 		users.forEach(function(value){
//   			array.push(value.email);
//   			value.responsible = false;
//   			collUsers.save(value);
// 		});
// 		console.log(array);
// 		responsible = array[index];
// 		if (index > 0) {
// 			indexTwo = index -1;
// 		}else if (indexTwo = array.length-1) {
// 			index = 0;
// 		}else {
// 			index = 0;
// 		}
// 		responsibleSetFalse = array[indexTwo];
// 		console.log("true: " + responsible);
// 		console.log("false: " + responsibleSetFalse);
// 		console.log("false: " + indexTwo);
// 		console.log("true: " + index);
// 		console.log(new Date())
// 		if (index < array.length-1) {
// 			index += 1;
// 		}else {
// 			index = 0;
// 		}
// 		collUsers.find({"email": responsible}).toArray(function(err, user){
// 			user[0].responsible = true;
// 			collUsers.save(user[0]);
// 		});
// 		collUsers.find({"email": responsibleSetFalse}).toArray(function(err, user){
// 			user[0].responsible = false;
// 			collUsers.save(user[0]);
// 		});
// 		array = [];
// 	});
// });


var routes = function(Checkin, Checkout, Event, User, Sandwiche, Room, secret){
	var appRouter = express.Router();
	var checkinController = require('../controllers/checkinController.js')(Checkin);
	var userController = require('../controllers/userController.js')(User);
	var eventController = require('../controllers/eventController.js')(Event);
	var checkoutController = require('../controllers/checkoutController.js')(Checkout);
	var roomController = require('../controllers/roomController.js')(Room);
	var sandwicheController = require('../controllers/sandwicheController.js')(Sandwiche);

appRouter.route('/authenticate')
	.post(function(req, res){
		var responsibleBool;
		var email = req.body.email;
		var password = req.body.password;
		collUsers.find({"email": email}).toArray(function(err, user){
			if (user == undefined) {
				res.send('Nothing found');
				console.log(user);
			}	
			else if (user.length == []) {
				res.send({success: false, message: 'Authentication failed, user not found.'});
			}
			else {
				console.log('Found it');
				/*console.log(user[0].password);
				console.log("NNNNNNNNNNNNNN");
				console.log(password);
				console.log("NNNNNNNNNNNNNN");*/
				bcrypt.compare(password, user[0].password, function(err, crypted){
					responsibleBool = user[0].responsible;
					console.log(responsibleBool);
					if (crypted) {
						console.log('Password hashes matches');
						console.log(password);
						console.log(user[0].password);
						var token = jwt.sign(user[0], secret, {
							expiresIn: 60*60*24 //24 hours
						});
						res.send({success: true, message: 'Password matches, enjoy the token', token: token, responsible: responsibleBool});
					} else{
						res.send({success: false, message: 'Authentication failed, password is not right.'});
					}
				});
			}
		});
	});

appRouter.route('/users')
	.post(userController.post)
	.put(userController.put);

appRouter.use(function(req, res, next){
	var token = req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, secret, function(err, decoded){
			if (err) {
				res.send({success: false, message: 'Failed to authenticate the token'});
			} else{
				req.decoded = decoded;
				next();
			}
		});
	} else{
		res.status(403).send({success: false, message: 'No token found, please add a token'});
	}
});

appRouter.route('/checkins')
	.post(checkinController.post)
	.get(checkinController.get);

appRouter.route('/checkins/:id')
	.put(checkinController.putId)
	.delete(checkinController.deleteId)
	.get(checkinController.getId);

appRouter.route('/users')
	// .post(userController.post)
	.get(userController.get);

appRouter.route('/users/:id')
	.put(userController.putId)
	.delete(userController.deleteId)
	.get(userController.getId);

appRouter.route('/events')
	.post(eventController.post)
	.get(eventController.get);

appRouter.route('/events/:id')
	.put(eventController.putId)
	.delete(eventController.deleteId)
	.patch(eventController.patchId)
	.get(eventController.getId);

appRouter.route('/checkouts')
	.post(checkoutController.post)
	.get(checkoutController.get);

appRouter.route('/checkouts/:id')
	.put(checkoutController.putId)
	.delete(checkoutController.deleteId)
	.get(checkoutController.getId);

appRouter.route('/rooms')
	.post(roomController.post)
	.get(roomController.get);

appRouter.route('/rooms/:id')
	.put(roomController.putId)
	.delete(roomController.deleteId)
	.patch(roomController.patchId)
	.get(roomController.getId);

appRouter.route('/sandwiches')
	.post(sandwicheController.post)
	.delete(sandwicheController.deleteAll)
	.get(sandwicheController.get);

appRouter.route('/sandwiches/:id')
	.put(sandwicheController.putId)
	.get(sandwicheController.getId)
	.delete(sandwicheController.deleteId)
	.patch(sandwicheController.patchId);
return appRouter;
};

module.exports = routes;