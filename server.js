'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fb = require('./routes/fb');
var craigslist = require('./routes/craigslist');

var portno = 8000;
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

//get listings from craigslist
app.post('/getListings', craigslist.getListings);

app.post('/sms', function(req, res)
{
    console.log('This is the res ' + res.body);
    console.log('This is the req' + req.body);
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

/*ttp.createServer(function(request, response){
  app.post('/sms', function(req, res)
  {
              var userResponse = res.body();
              console.log(userResponse);
              var twiml = new twilio.TwimlResponse();
              //var userResponse = twiml.body();
              twiml.message('The Robots are coming! Head for the hills!');
              res.writeHead(200, {'Content-Type': 'text/xml'});
              res.end(twiml.toString());
            });

        http.createServer(app).listen(8000, function () {
          console.log("Express server listening on port 8000");
        });
}).listen(portno) */
