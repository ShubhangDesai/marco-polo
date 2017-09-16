var express = require('express');
var bodyParser = require('body-parser');
var craigslist = require('node-craigslist');

client = new craigslist.Client({
});

var resObject = [];

exports.getListings = function(request,response) { 
    
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
    if(request.body.hasOwnProperty('city')){
      options['city'] = request.body.city;
    }

    //console.log(options);
    client
    .search(options, request.body.query)
    .then((listings) => {
      for(var i=0; i<listings.length && i<5; i++){

        resObject.push(listings[i]);
      }
      console.log(resObject.length);
      var i = 0;
      function listingIterator(i) {
        if( i < resObject.length ) {
          getDetails( resObject[i], function(details, err) {
            if(err) {
              console.log('error: '+err);
            }
            else {
              resObject[i]['description'] = details.description;
              resObject[i]['image'] = details.images[0];
              resObject[i]['replyUrl'] = details.replyUrl;
              resObject[i]['pid'] = details.pid;
              
              listingIterator(i+1);
            }
          })
        }
      }
      listingIterator(0);
      // filtered listings (by price)
      //listings.forEach((listing) => console.log(listing));
      response.send(resObject);
    })
    .catch((err) => {
      console.error(err);
    });
}

function getDetails(listing, callback){
  
  client.details(listing)
  .then((details) => {
    console.log(details);
    callback(details);
  })
  .catch((err) => {
    console.error(err);
  });
}