'use strict';
var Alexa = require('alexa-sdk');
var http = require('https');

var APP_ID = "";//"amzn1.ask.skill.73585f53-5816-400b-b05e-71f2e09dec8d"; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-ollie]";
var SKILL_NAME = 'Random  NYC Museum';

var getMuseumData = function(cb) {
  var url = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json";
  
  http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        cb(fbResponse["data"]);
    });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });

};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
      this.emit('GetRandomMuseumIntent');
    },
    'GetRandomMuseumIntent': function () {
      var me = this;
      getMuseumData(function(museumData) {
        
          var factIndex = Math.floor(Math.random() * museumData.length);
          var randomFact = museumData[factIndex];

          // Create speech output
          var speechOutput = "Why don't you visit the " + randomFact[9] + " located at " + randomFact[12];
          me.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact[9]);
      });
      return false;
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can ask for a random museum, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};
