var request = require('request');

var thingSpeakQueue = []
exports.thingSpeakQueue = thingSpeakQueue

function updateThingSpeak(callback) {
    if (0 < thingSpeakQueue.length) {
        var url = thingSpeakQueue.shift()

        // console.log(url)
        request.post(url, function (err, response, body) {
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