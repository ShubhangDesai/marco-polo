var accountSid = 'ACf70f438d634576ed3c82882596df73ff';
var authToken = '1084d124870aa80d68f4e31f2205fd52';
var obj = [];
var twilio = require('twilio');
var fb = require('./routes/fb');
var client = new twilio.RestClient(accountSid, authToken);
var name='boy',title='car',initialcost = 90,phoneNumber = '+17657750687',actualCost = 110, userid = '1576934995661792';
var init = 0;
var botMessageCount = 0;

var sendMessage = function(message,to) {
  client.messages.create({
              body: message,
              to: to,
              //from: '+12027510701'
              from: '+12727703870'
          }, function(err, message) {
              if(err)
                console.log(' error is: ', err);
              	console.log(' Testing gives: ', message);
          });
};


exports.conversationWithSeller = function(data){
  console.log('convowseller data', data);
  name = data.name;
  title = data.title;
  initialcost = parseInt(data.price.substring(1)) * 0.8;
  actualCost = parseInt(data.price.substring(1));
  userid = data.userid;
  if(init == 0){
    init = 1;
    var message = "Hi, I'm " + name + ". I saw your listing on craigslist titled \"" + title + "\". I was wondering if you would be interested in selling it to me for " + initialcost + ". Please let me know.";
    sendMessage(message, phoneNumber);
  } 
}

exports.convo = function(req,res){
    var string = req.body.Body;
    var twiml = new twilio.TwimlResponse();
    botMessageCount++;
    if(botMessageCount == 1){
      if(string.toLowerCase().indexOf("no") !== -1 || string.toLowerCase().indexOf("nah") !== -1){
        twiml.message('Oh! Does '+actualCost+ " sound good?");
      }
      else if(string.toLowerCase().indexOf("yes") !== -1 || string.toLowerCase().indexOf("yeah") !== -1){
        twiml.message('Nice. I can pickup the item from your place whenever you think is a good time. Send me your address.');
        botMessageCount = 0;
        fb.sendTextMessage(userid, "Great news! I was able to get you your '" + title + "'. You can go ahead and contact the number yourself to finalize the details but I've negotiated the prize on your behalf. Hope you enjoy! ^_^");
      }
    }

    if(botMessageCount == 2){
      if(string.toLowerCase().indexOf("yeah") !== -1 || string.toLowerCase().indexOf("yes") !== -1){
        twiml.message('Nice. I can pickup the item from your place whenever you think is a good time. Send me your address.');
        fb.sendTextMessage(userid, "Great news! I was able to get you your '" + title + "'. You can go ahead and contact the number yourself to finalize the details but I've negotiated the prize on your behalf. Hope you enjoy! ^_^");
      }
      else{
        twiml.message('Nevermind. Thankyou for your time. I don\'t think I\'m interested anymore');
        fb.sendTextMessage(userid, "Unfortunately we were unable to settle on a price. :( Maybe pick another item and I can try again.");
      }
      botMessageCount = 0;
    }
    
    console.log(req.body.Body);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
};

exports.sendMessage = sendMessage;