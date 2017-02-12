var request = require('request');

var field1Queue = []
var field2Queue = []
var field3Queue = []
var field4Queue = []

exports.field1Queue = field1Queue
exports.field2Queue = field2Queue
exports.field3Queue = field3Queue
exports.field4Queue = field4Queue

function updateThingSpeak(callback) {
    if (0 < field1Queue.length && 0 < field2Queue.length && 0 < field3Queue.length) {
        var field1 = field1Queue.shift()
        var field2 = field2Queue.shift()
        var field3 = field3Queue.shift()

        var iotUrl = 'http://api.thingspeak.com/update?api_key=ORAYGP0SOPO0J1IB&' + field1 + '&' + field2 + '&' + field3

        if (0 < field4Queue.length) {
            var field4 = field4Queue.shift()

            iotUrl += '&' + field4
        }

        // console.log(iotUrl)
        request.post(iotUrl, function (err, response, body) {
            // console.log('IOT return status code:' + response.statusCode)
            if (err) {
                cb(err)
            }
        });
    }
    
    callback();
}

function wait5sec(){
    setTimeout(function(){
        updateThingSpeak(wait5sec);
    }, 5000);
}

updateThingSpeak(wait5sec);