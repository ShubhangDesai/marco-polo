var express = require('express');
var bodyParser = require('body-parser');
var craigslist = require('node-craigslist');

client = new craigslist.Client({
});

var resObject = [];

exports.getListings = function(request,callback) { 
    
    var options = {
      hasPic : true,
      bundleDuplicates : true,
      category : 'sss',
      offset : 5
    };
  
    if(request.hasOwnProperty('category')){
      options['category'] = request.category;
    }
    if(request.hasOwnProperty('maxAsk')){
      options['maxAsk'] = request.maxAsk;
    }
    if(request.hasOwnProperty('minAsk')){
      options['minAsk'] = request.minAsk;
    }
    if(request.hasOwnProperty('offset')){
      options['offset'] = request.offset;
    }
    if(request.hasOwnProperty('city')){
      options['city'] = request.city;
    }

    //console.log(options);
    client
    .search(options, request.query)
    .then((listings) => {
      for(var i=0; i<listings.length && i<5; i++){

        resObject.push(listings[i]);
      }
      //console.log(resObject.length);
      var i = 0;
      function listingIterator(i) {
        if( i < resObject.length ) {
          getDetails( resObject[i], function(details, err) {
            if(err) {
              console.log('error: '+err);
            }
            else {
              console.log(details);
              resObject[i]['description'] = details['description'];
              resObject[i]['image'] = details['images'];
              resObject[i]['replyUrl'] = details['replyUrl'];
              resObject[i]['pid'] = details['pid'];

              listingIterator(i+1);
            }
          })
        }
        else{
          callback(resObject);
        }
      }
      listingIterator(0);
      // filtered listings (by price)
      //listings.forEach((listing) => console.log(listing));
      
    })
    .catch((err) => {
      console.error(err);
    });
}

function getDetails(listing, callback){
  
  client.details(listing)
  .then((details) => {
    //console.log(details);
    var obj = {};
    obj = details;
    callback(obj);
  })
  .catch((err) => {
    console.error(err);
  });
}