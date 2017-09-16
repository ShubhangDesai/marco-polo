var express = require('express');
var request = require('request')

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
			if (event.message && event.message.text) {
				let text = event.message.text
				if (text === 'Generic'){ 
					console.log("welcome to chatbot")
					sendGenericMessage(sender)
					continue
				}
				sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
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

function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "iPhone 7 Plus 32GB Gold T-Mobile Brand New - $650",
				    "subtitle": "This iPhone 7 Plus is brand new and in perfect condition. I\'m willing to meet anywhere in the New York City area to sell this device. Please do not ask me to send this phone to you in the mail, I am only willing to sell this phone in person - cash only Charger included",
				    "image_url": "https://images.craigslist.org/00e0e_lx5PpKA4GR4_600x450.jpg",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://boston.craigslist.org/gbs/mob/d/iphone-7-plus-32gb-gold/6308518074.html",
					    "title": "Listing URL"
				    }, {
					    "type": "postback",
					    "title": "Buy",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
					"title": "128gb rose gold iPhone 7 plus - $650",
				    "subtitle": "I'm selling my iPhone 7 plus 128gb in rose gold is in very good condition unlocked to any carrier .I brought it in a Apple Store full price",
				    "image_url": "https://images.craigslist.org/00M0M_g1wF9KH6moo_600x450.jpg",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://boston.craigslist.org/nwb/mob/d/128gb-rose-gold-iphone-7-plus/6297370625.html",
					    "title": "Listing URL"
				    }, {
					    "type": "postback",
					    "title": "Buy",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
					"title": "NEW-IN-BOX-APPLE-iPHONE-7-128GB-GOLD-FACTORY-UNLOCKED - $595",
				    "subtitle": "///NEW IN BOX////",
				    "image_url": "https://images.craigslist.org/00d0d_eiFsd4mzl8v_600x450.jpg",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://boston.craigslist.org/gbs/mob/d/new-in-box-apple-iphone-7/6308634620.html",
					    "title": "Listing URL"
				    }, {
					    "type": "postback",
					    "title": "Buy",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }]
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