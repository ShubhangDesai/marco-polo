'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fb = require('./routes/fb');

var portno = 8000;
var app = express();
var accountSid = 'ACf70f438d634576ed3c82882596df73ff';
var authToken = '1084d124870aa80d68f4e31f2205fd52';
var obj = [];
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

app.use(express.static(__dirname));
app.set('port', (process.env.PORT || portno))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function (request, response) {
    console.log('Test');
	response.send('Hello world, I am a chat bot');
});

app.post('/getListings', function(request, response){
	var craigslist = require('node-craigslist'),
 	client = new craigslist.Client({
    	city : request.body.city
  	});
  	var options = {
    	hasPic : true,
    	bundleDuplicates : true,
    	category : 'sss',
    	offset : 5
  	};
 	
  	if(request.body.hasOwnProperty('category')){
  		options['category'] = request.body.category;
  	}
  	if(request.body.hasOwnProperty('maxAsk')){
  		options['maxAsk'] = request.body.maxAsk;
  	}
  	if(request.body.hasOwnProperty('minAsk')){
  		options['minAsk'] = request.body.minAsk;
  	}
  	if(request.body.hasOwnProperty('offset')){
  		options['offset'] = request.body.offset;
  	}

  	//console.log(options);
  	var resObject = [];
	client
  	.search(options, request.body.query)
  	.then((listings) => {
  		for(var i=0; i<listings.length && i<5; i++){
  			resObject.push(listings[i]);
  		}
    	// filtered listings (by price)
	   	listings.forEach((listing) => console.log(listing));
	   	response.send(resObject);
  	})
  	.catch((err) => {
    	console.error(err);
  	});
});

// for Facebook verification
app.get('/webhook/', fb.webhook);

// to post data
app.post('/webhook/', fb.webhook);

app.post('/sms', function(req, res) {
    var twiml = new twilio.TwimlResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

var server = app.listen(app.get('port'), function () {
  console.log('Listening at http://localhost:' + app.get('port'));
  initTwilio(obj);
});


var sellerText = 'I am selling a sofa';
var initTwilio = function(obj) {
  	client.messages.create({
    	body: sellerText,
      	to: '+17657750687',
      	from: '+12727703870'
  	}, function(err, message) {
        console.log(' error is: ' + err);
      	console.log(' Testing gives: ' + message);
});

}
