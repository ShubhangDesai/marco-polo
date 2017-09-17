
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


          http.createServer(function(request, response){
            app.post('/sms', function(req, res) {
                        var twiml = new twilio.TwimlResponse();
                        twiml.message('The Robots are coming! Head for the hills!');
                        res.writeHead(200, {'Content-Type': 'text/xml'});
                        res.end(twiml.toString());
                      });

                  http.createServer(app).listen(8000, function () {
                    console.log("Express server listening on port 8000");
                  });
          }).listen(portno)



}
