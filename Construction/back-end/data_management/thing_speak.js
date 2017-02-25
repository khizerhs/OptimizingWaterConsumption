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
    var queue1Length = field1Queue.length 
    var queue2Length = field2Queue.length 
    var queue3Length = field3Queue.length

    var iotUrl = 'http://api.thingspeak.com/update?api_key=ORAYGP0SOPO0J1IB'

    var readyToSend = false

    if (0 < queue1Length) {
        var field1 = field1Queue.shift()

        iotUrl += '&' + field1

        readyToSend = true
    }

    if (0 < queue2Length) {
        var field2 = field2Queue.shift()

        iotUrl += '&' + field2

        readyToSend = true
    }

    if (0 < queue3Length) {
        var field3 = field3Queue.shift()

        iotUrl += '&' + field3

        readyToSend = true
    }
        
    if (readyToSend) {
        if (0 < field4Queue.length) {
            var field4 = field4Queue.shift()

            iotUrl += '&' + field4

            console.log('[updateThingSpeak] Send with field4')
        } else {
            iotUrl += '&field4=0'
        }

        // console.log(iotUrl)
        request.post(iotUrl, function (err, response, body) {
            console.log('[updateThingSpeak] return status code: ' + response.statusCode)

            if (err) {
                cb(err)
            }
        });

        console.log('[updateThingSpeak] Posted ' + iotUrl)
    } else {
        var sQueue1Length = queue1Length.toString()
        var sQueue2Length = queue2Length.toString()
        var sQueue3Length = queue3Length.toString()
        console.log('[updateThingSpeak] Not ready. sQueue1Length: ' + sQueue1Length + ' sQueue2Length: ' + sQueue2Length + ' sQueue3Length: ' + sQueue3Length)
    }
    
    callback();
}

function wait3sec(){
    setTimeout(function(){
        updateThingSpeak(wait3sec);
    }, 3000);
}

updateThingSpeak(wait3sec);