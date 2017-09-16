'use strict';

const token = process.env.FB_PAGE_ACCESS_TOKEN;

var express = require('express');
var bodyParser = require('body-parser')
var request = require('request')
var portno = 8000;
var app = express();
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
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		//res.send(req.query['hub.challenge'])
		let messaging_events = req.body.entry[0].messaging
	    for (let i = 0; i < messaging_events.length; i++) {
		    let event = req.body.entry[0].messaging[i]
		    let sender = event.sender.id
		    if (event.message && event.message.text) {
			    let text = event.message.text
			    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		    }
	    }
	    res.sendStatus(200)
	}
	res.send('Error, wrong token')
})

var server = app.listen(app.get('port'), function () {
  console.log('Listening at http://localhost:' + app.get('port'));
});
