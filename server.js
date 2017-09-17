'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fb = require('./routes/fb');
var craigslist = require('./routes/craigslist');
var twil = require('./twilio');

var portno = 8080;
var app = express();
var accountSid = 'ACf70f438d634576ed3c82882596df73ff';
var authToken = '1084d124870aa80d68f4e31f2205fd52';
var obj = [];
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

app.use(express.static(__dirname));
app.set('port', (process.env.PORT || portno));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function (request, response) {
    console.log('Test');
	response.send('Hello world, I am a chat bot');
});

// for Facebook verification
app.get('/webhook/', fb.webhook);

// to post data
app.post('/webhook/', fb.webhook);

app.get('/list', function(request, response){
	var obj = {
	category : "sss",
    maxAsk : 500,
    minAsk : 100,
    city : "Seattle",
    query : "IPhone"
	}

	craigslist.getListings(obj, function(res){
		response.send(res);
	});
});

app.post('/sms', function(req, res)
{
    var twiml = new twilio.TwimlResponse();
    twiml.message('Response: '+req.body.Body);
    console.log(req.body.Body);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

var server = app.listen(app.get('port'), function () {
  console.log('Listening at http://localhost:' + app.get('port'));
  twil.sendMessage("hi","+12027510701");
});