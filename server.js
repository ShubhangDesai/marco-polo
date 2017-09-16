'use strict';

var express = require('express');
var portno = 8000;
var app = express();
app.use(express.static(__dirname));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.get('/', function (request, response) {
    console.log('Test');
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

var server = app.listen(portno, function () {
  console.log('Listening at http://localhost:' + portno);
});
