
var fs = require('fs');

var request = require('request');

var lineReader = require('readline').createInterface({
  input: fs.createReadStream('insert_prediction_script.txt')
});

lineReader.on('line', function (line) {
  console.log('Line from file:', line);
  if(line != ''){
  	var options = {
    url: line,
    method: 'GET'
	};
	request
  	.get(options)
  	.on('response', function(response) {
    	console.log(response.statusCode) // 200	
    	console.log(response.headers['content-type'])
  	})
  }
});

