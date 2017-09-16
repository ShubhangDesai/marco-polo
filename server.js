'use strict';


var express = require('express');
var bodyParser = require('body-parser')
var request = require('request')
var portno = 8000;
var app = express();

var fb = require('./routes/fb');

app.use(express.static(__dirname));
app.set('port', (process.env.PORT || portno))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.get('/', function (request, response) {
    console.log('Test');
	response.send('Hello world, I am a chat bot');
});

// for Facebook verification
app.get('/webhook/', fb.webhook);

// to post data
app.post('/webhook/', fb.webhook);



var server = app.listen(app.get('port'), function () {
  console.log('Listening at http://localhost:' + app.get('port'));
});
