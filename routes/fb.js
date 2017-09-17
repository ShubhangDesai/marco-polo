var express = require('express');
var request = require('request')
var craigslist = require('./craigslist');

const token = process.env.FB_PAGE_ACCESS_TOKEN;

var orders = {};

exports.webhook = function(req, res) {
	if (req.method == 'GET') {
		if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
			res.send(req.query['hub.challenge'])
		}
		res.send('Error, wrong token')
	} else if (req.method == 'POST') {
		let messaging_events = req.body.entry[0].messaging
		if (messaging_events) {
			for (let i = 0; i < messaging_events.length; i++) {
				let event = req.body.entry[0].messaging[i]
				let sender = event.sender.id
				console.log('event', event);
				if (event.message && event.message.text) {
					console.log('sender', orders[sender]);
					if(orders[sender] != undefined) 
						console.log(orders[sender].number)
					if (orders[sender] != undefined && orders[sender].number == true) {
						console.log("PHONE NUMBER!!!!!", event.message.text);
						delete orders[sender];
						continue;
					} else {

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
							console.log('ms body', body);
							var intent = body.topScoringIntent.intent;
							if (intent === 'Shop') {
								var product = body.entities[0].entity;
								orders[sender] = { product: product };
								sendTextMessage(sender, "Okay! I'll try to find you a " + product + ". \
																				What is the minimum price you're willing to pay for it?");


							} else if (intent === 'GivePrice') {
								var price = body.entities[0].entity;
								if (orders[sender].min != undefined) {
									orders[sender].max = price;
									var product = orders[sender].product;
									var min = orders[sender].min;

									var obj = {
										category: "sss",
										maxAsk: price,
										minAsk: min,
										city: "Seattle",
										query: product
									}
									sendTextMessage(sender, "Okay! Give me a sec while I look for a " + product);
									craigslist.getListings(obj, function(res) {
										console.log('res after getListings', res);
										sendListingCardsMessage(sender, res);
									});
								} else {
									orders[sender].min = price;
									sendTextMessage(sender, "And a maximum?");
								}
							}
						});
					}
				}

				if (event.postback || (event.message && event.message.quick_reply)) {
					console.log("inside 0");

					payload = event.postback ? JSON.parse(event.postback.payload) : JSON.parse(event.message.quick_reply.payload);
					if (payload.type === "buy") {
						console.log("inside buy postback");
						sendTextMessage(sender, "Okay! Here's the reply URL - " + payload.replyUrl + ". You need to click it to get the seller's number.");
						setTimeout(function() {
							sendQuickMessage(sender, "You can contact the seller directly or if you'd like I can negotiate the price on your behalf. Would you like me to do that?");
						}, 2000);
					} else if (payload.type === "negotiate") {
						console.log("inside negotiate");

						if (payload.answer == 1) {
							sendTextMessage(sender, "Please give me the phone number of the seller you got from the previous step.");
							orders[sender].number = true;
							console.log(orders[sender].number, "inside payload")

							// sendTextMessage(sender, "Of course! I'll reach out to them and get back to you with an offer ASAP. :)");
						} else {
							sendTextMessage(sender, "Sure, I'll let you contact them! Hope you enjoy your " + orders[sender].product + "!! ^_^");
							delete orders[sender];
						}
					}
				}
			}
		}
		res.sendStatus(200)
	}
}

function sendQuickMessage(sender, text) {
	let messageData = {
		text: text,
		quick_replies: [{
				content_type: "text",
				title: "Yes",
				payload: JSON.stringify({
					"type": "negotiate",
					"answer": 1
				})
			},
			{
				content_type: "text",
				title: "No",
				payload: JSON.stringify({
					"type": "negotiate",
					"answer": 0
				})
			}
		]
	}


	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: token },
		method: 'POST',
		json: {
			recipient: { id: sender },
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

function sendTextMessage(sender, text) {
	let messageData = { text: text }

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: token },
		method: 'POST',
		json: {
			recipient: { id: sender },
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
				"payload": JSON.stringify({
					"type": "buy",
					"pid": listing.pid,
					"replyUrl": listing.replyUrl
				})
			}],
		};

		if (listing.image)
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
		qs: { access_token: token },
		method: 'POST',
		json: {
			recipient: { id: sender },
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