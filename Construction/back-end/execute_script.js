
var fs = require('fs');

var request = require('request');

var stream = fs.createReadStream('insert_prediction_script.txt');
stream.on('line', function(line) { 
	request
  	.get(line)
  	.on('response', function(response) {
    	console.log(response.statusCode) // 200
    	console.log(response.headers['content-type'])
  	})
});