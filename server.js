'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var portno = 8000;
var app = express();
app.use(express.static(__dirname));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function (request, response) {
    console.log('Test');
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

var server = app.listen(portno, function () {
  console.log('Listening at http://localhost:' + portno);
});
