var express = require('express');
var request = require('request')
var craigslist = require('./routes/craigslist');

const token = process.env.FB_PAGE_ACCESS_TOKEN;

exports.webhook = function(req, res) {
	if (req.method == 'GET'){
		if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
			res.send(req.query['hub.challenge'])
		}
		res.send('Error, wrong token')
	} else if(req.method == 'POST'){
		let messaging_events = req.body.entry[0].messaging
		for (let i = 0; i < messaging_events.length; i++) {
			let event = req.body.entry[0].messaging[i]
			let sender = event.sender.id
			console.log('event.message', event.message);

			//If it's text
			if(event.message && event.message.text) {
				let text = event.message.text

				if (text === 'Generic'){ 
					console.log("welcome to chatbot")
					var obj = {
						category : "sss",
					    maxAsk : 500,
					    minAsk : 100,
					    city : "Seattle",
					    query : "IPhone"
					}
					craigslist.getListings(obj, function(res){
						sendListingCardsMessage(sender, res);
					});
					//sendGenericMessage(sender)
					continue
				} else {

					sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
				}
			} 
			if (event.postback) {
				let text = JSON.stringify(event.postback)
				sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
				continue
			}
		}
		res.sendStatus(200)
	}
}

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendListingCardsMessage(sender, listings) {
	let elements = [];

	for(let listing: listings){
		let element = {
			"title": listing.title,
		    "subtitle": listing.description,
		    "buttons": [{
			    "type": "web_url",
			    "url": listing.url,
			    "title": "Listing URL"
		    }, {
			    "type": "postback",
			    "title": "Buy",
			    "payload": "Payload for first element in a generic bubble",
		    }],
		};

		if(listing.image)
			element.image_url = image[0];

		elements.push(element);
	}

    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": elements
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}