var craigslist = require('node-craigslist');

/*
 * Pass in query parameters as the first parameter
 * Callback takes an error and a body as arguments
 */
function getListings(properties, cb) {
	var craigslist = require('node-craigslist'),
 	client = new craigslist.Client({
    	city : 'seattle'
  	}),
  	options = {
    	category : 'ppa',
    	maxAsk : '200',
    	minAsk : '100'
  	};
 
	client
  		.search(options, 'xbox one')
  		.then((listings) => {
    	// filtered listings (by price)
    	listings.forEach((listing) => console.log(listing));
  	})
  	.catch((err) => {
    	console.error(err);
  	});
}

module.exports = {
  getListings: getListings
}
