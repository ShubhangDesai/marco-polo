var accountSid = 'ACf70f438d634576ed3c82882596df73ff';
var authToken = '1084d124870aa80d68f4e31f2205fd52';
var obj = [];
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

var init = 0;
var botMessageCount = 0;

var sendMessage = function(message,to) {
  client.messages.create({
              body: message,
              to: to,
              from: '+17657750687'
          }, function(err, message) {
                console.log(' error is: ' + err);
              	console.log(' Testing gives: ' + message);
          });
};


exports.conversationWithSeller = function(data){
  if(init == 0){
    init = 1;
    var message = "Hi, I'm " + data.name + ". I saw your listing on craigslist titled \"" + data.title + "\". I was wondering if you would be interested in selling it to me for " + data.avgcost + ". Please let me know.";
    sendMessage(message, data.phoneNumber);
    botMessageCount++;
  } else {
    if(botMessageCount == 1){
      
    }
  }
}

exports.sendMessage = sendMessage;