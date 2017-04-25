var express = require('express'),
	mongoose = require('mongoose'),
	mongodb = require('mongodb'),
	mongojs = require('mongojs'),
	ObjectId = require('mongodb').ObjectId,
	bodyParser = require('body-parser');

//models
var Checkin = require('./models/checkinModel');
var Checkout = require('./models/checkoutModel');
var Event = require('./models/eventModel');
var User = require('./models/userModel');
var Room = require('./models/roomModel');
var Sandwiche = require('./models/sandwicheModel');

var config = require('./config.js');

var app = express();

var port = process.env.port || 8000;

app.set('superSecret', config.secret);
var secret = app.get('superSecret');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

appRouter = require('./Routes/appRoutes')(Checkin, Checkout, Event, User, Sandwiche, Room, secret);

//var appRouter = express.Router();

app.use('/api', appRouter);

app.listen(port, function(){
	console.log('Gulp is running my app on port: ' + port);
});

// Https nog toevoegen wanneer de server online staat in plaats van localhost
// zie deze link https://www.hacksparrow.com/node-js-https-ssl-certificate.html om het te doen aan de hand van een ssl