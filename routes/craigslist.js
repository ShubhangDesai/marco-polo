var express = require('express');
var bodyParser = require('body-parser');
var craigslist = require('node-craigslist');

exports.getListings = function(request,response) { 
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
}