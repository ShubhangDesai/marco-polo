var express = require('express');
var request = require('request');

exports.shopperIntent = function(text) {
  request({
    url: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/16b92656-8832-4d56-92ea-15f72fe69b3b',
    qs: {
      'subscription-key': '6c099f46b90c4ab8b85b31fde3e7a756',
      'verbose': 'true',
      'q': text
    },
    method: 'GET'
  }, function(error, response, body) {
    return JSON.parse(body)
  });
}
