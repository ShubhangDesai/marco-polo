var express = require('express');
var request = require('request')
var craigslist = require('./craigslist');

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
			let sender = event.sender.id;
			let recipient = event.recipient.id;
			console.log('event', event);
			if (event.message && event.message.text) {
				request({
			    url: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/16b92656-8832-4d56-92ea-15f72fe69b3b',
			    qs: {
			      'subscription-key': '6c099f46b90c4ab8b85b31fde3e7a756',
			      'verbose': 'true',
			      'q': event.message.text
			    },
			    method: 'GET'
			  }, function(error, response, body) {
			    body = JSON.parse(body)
			    //console.log('ms body', body);
					var intent = body.topScoringIntent.intent;
					if (intent === 'Shop'){
						var product = body.entities[0].entity;
						var obj = {
							category : "sss",
						    maxAsk : 500,
						    minAsk : 100,
						    city : "Seattle",
						    query : product
						}
						sendTextMessage(sender, recipient, "Okay! Give me a sec while I look for a " + product);
						console.log('sender text', sender);
						craigslist.getListings(obj, function(res){
							console.log('sender card', sender);
							sendListingCardsMessage(sender, recipient, res);
						});
					} else {
						sendTextMessage(sender, recipient, "Text received, echo: " + event.message.text.substring(0, 200));
					}
			  });
			}
			if (event.postback) {
				if(event.postback.type == "buy"){
					sendTextMessage(sender, "Okay! Here's the reply URL - " + event.postback.replyUrl + ". You need to click it to get the seller's number.");
					sendTextMessage(sender, "If you'd like I can negotiate the price on your behalf. Would you like me to do that?");
				}
				//let text = JSON.stringify(event.postback)
				//sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			}
		}
		res.sendStatus(200)
	}
}

function sendTextMessage(sender, recipient, text) {
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

function sendListingCardsMessage(sender, recipient, listings) {
	let elements = [];

	listings.forEach((listing) => {
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
			    "payload": {
			    	"type": "buy",
			    	"pid": listing.pid,
			    	"replyUrl": listing.replyUrl
			    },
		    }],
		};

		if(listing.image)
			element.image_url = listing.image[0];

		elements.push(element);
	});

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
		    recipient: {id:recipient},
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
