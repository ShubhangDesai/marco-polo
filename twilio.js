var accountSid = 'ACf70f438d634576ed3c82882596df73ff';
var authToken = '1084d124870aa80d68f4e31f2205fd52';
var obj = [];
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

initTwilio(obj);
var sellerText = 'I am selling a sofa';
var initTwilio = function(obj) {
  client.messages.create({
              body: sellerText,
              to: '+17657750687',
              from: '+12727703870'
          }, function(err, message) {
                console.log(' error is: ' + err);
              	console.log(' Testing gives: ' + message);
          });
}

function sendToUser(message,numberSeller,numberBuyer){
    client.messages.create({
      body: message,
      to: numberBuyer,
      from: numberSeller
    }, function(message){
        console.log('Testing gives ' + message);
    });
};
