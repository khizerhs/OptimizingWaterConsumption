var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');
  
//To avoid the heroku app going to sleep :)
var http = require("http");
setInterval(function() {
	console.log("App ping");
    http.get("http://smartfarm-sjsu.herokuapp.com/");
}, 300000); // every 5 minutes (300000)

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://52.35.182.188:27017/maindb', function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to MongoDB :' + err);
  } else {
    console.log ('Succeeded connected to MongoDB');
  }
});


//Catch uncaughtExceptions
var response;
process.on('uncaughtException', function (err) {
  console.log("Exception caught",err);
  //response.status(500).send('Something broke!')
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var sensor_routes = require('./routes/smartIrrigation-sensor-routes');
var user_routes = require('./routes/smartIrrigation-user-routes');
var crop_routes = require('./routes/smartIrrigation-crop-routes');
var waterHistory_routes = require('./routes/smartIrrigation-waterConsumptionHistory-routes');
var sensorHistory_routes = require('./routes/smartIrrigation-sensorHistory-routes');
sensor_routes(app);
user_routes(app);
crop_routes(app);
waterHistory_routes(app);
sensorHistory_routes(app);

app.listen(port);


console.log('RESTful API server started on: ' + port);

/*Smart Irrigation Module - ETC calculations

var htmlparser = require("htmlparser2");//Scraping sjsu meteorology website for real-time values
var Client = require('node-rest-client').Client;//For wunderground api calls
var client = new Client();
var Rs,P,Tkmax,Tkmin,T,U2,RHmax,RHmin,Etr,Rn,Rns,Rnl,Eo,EoTmin,EoTmax,Ea,Es,Delta,Gamma,Cn=900,Cd=0.34;//Variables

//Main function to calculate ETC ** Do Not Modify **
function CalEtc(){
	client.get("http://www.met.sjsu.edu/wx/currentfull.php", function (data, response) {
		var dom = htmlparser.parseDOM(data);    
    	Rs=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[3].children[1].children[1].children[3].children[3].children[1].children[1].children[1].children[0].children[0].data);
    	Rs=(Rs*3.6)/1000;//Net solar radiation(W/m2)
    	RHmax=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[3].children[1].children[1].children[5].children[3].children[1].children[1].children[1].children[0].children[0].data);//Relative humidity(%)
    	P=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[3].children[1].children[1].children[5].children[3].children[1].children[1].children[1].children[0].children[0].data);//Atmospheric Pressure(mBar)
    	Tkmax=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[1].children[1].children[1].children[5].children[3].children[2].children[0].data);//Max temperature(c)
    	Tkmin=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[1].children[1].children[1].children[7].children[3].children[2].children[0].data);
    	T=(parseFloat(Tkmin)+parseFloat(Tkmax))/2;//Min temperature(c)
    	client.get("http://api.wunderground.com/api/90e662793af1aa07/conditions/q/CA/San_Jose.json", function (data, response) {
			U2=parseFloat(data.current_observation.wind_kph);//Wind speed(kmph)
			RHmin=parseFloat(data.current_observation.relative_humidity);//Relative humidity(%)
			if(RHmin>RHmax){
				RHmax=RHmax+RHmin;RHmin=RHmax-RHmin;RHmax=RHmax-RHmin;
			}Calc();
		});
	});
}

//Function for ETr ** Do Not Modify **
function Calc(){
	Rns=Rs*0.77;
	EoTmin=svapf(Tkmin);	
	EoTmax=svapf(Tkmax);
	Ea=((EoTmin*(RHmax/100))+(EoTmax*(RHmin)/100))/2;//Mean actual vapor pressure
	Es=(EoTmax+EoTmin)/2;//Saturation vapor pressure
	Rnl=(4.901*(Math.pow(10,-9)))*0.525*(0.34-(0.14*Math.pow(Ea,0.5)))*((Math.pow(Tkmax,4))+Math.pow(Tkmin,4))/2;
	Rn=Rns-Rnl;//Net radiation
	Delta=(2503*(Math.pow(2.718,((17.27*T)/(T+273.3)))))/Math.pow((T+237.3),2);//Slope of saturation vapor pressure-temperature curve 
	Gamma=((RHmin+RHmax)/2)*0.1*0.000665;//Psychometric constant
	temp1=0.408*Delta*(Rn);
	temp2=Gamma*(Cn/(T+273))*U2*0.277*(Es-Ea);
	temp3=Delta+Gamma*(1+Cd*U2*0.277);
	Etr=(temp1+temp2)/temp3;
	console.log("Radiation(W/m2):"+Rs+"\nAtmospheric Pressure(mBar):"+P+"\nMax Temperature(C):"+Tkmax+"\nMin Temperature(C):"+Tkmin+"\nMean Temperature(C):"+T+"\nWind Speed(Kmph):"+U2+"\nMax Humidity(%):"+RHmax+"\nMin Humidity(%):"+RHmin+"\nNet Radiation(MJ/m2/d):"+Rn+"\nNet Short-wave Radiation(MJ/m2/d):"+Rns+"\nNet Long-wave Radiation(MJ/m2/d):"+Rnl+"\nSaturation vapor pressure-Min Temperature(kPa):"+EoTmin+"\nSaturation vapor pressure-Max Temperature(kPa):"+EoTmax+"\nMean actual vapor pressure(kPa):"+Ea+"\nSaturation vapor pressure(kPa):"+Es+"\nSlope of saturation vapor pressure-temperature curve:"+Delta+"\nPsychrometric constant(kPa/c):"+Gamma+"\nETR(mm/d):"+Etr+"\nCrop co-efficient(Cabbage)(Kc):50\nETC:"+Etr*50);
}

//Function for saturation vapor pressure ** Do Not Modify **
function svapf(temp){
	t=(17.27*temp)/(temp+273.3);
	Eo=0.6108*(Math.pow(2.718,t));
	return(Eo);
}
*/


/*// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var userManagement = require ('./data_management/user_management.js');
var sensorManagement = require ('./data_management/sensor_management.js');
var response;
//Catch uncaughtExceptions
process.on('uncaughtException', function (err) {
  console.log("Exception caught",err);
  response.status(500).send('Something broke!')
})

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/users')

    // create an user (accessed at POST http://localhost:5000/api/users)
    .post(function(req, res) {
		response = res;
		userManagement.createUser(req, function (err){
			if(err)
				res.status(500).send(err.message);
			else
				res.status(201).json({ message: 'User created!' });
		});
        
        
    })
	
	.get(function(req, res) {
		response = res;
		console.log("Get all users");
		var query = {
			email : req.param('email'),
			search : req.param('search')
		}
		userManagement.getUsers(query,function(err,users){
			if (err)
                res.status(500).send(err.message);
			else if(users == undefined || users == null )
					res.status(404).json({ message: 'User not found' })
            else
				res.status(200).json(users);
		});
    });

router.route('/users/:user_id')

    // get the bear with that id (accessed at GET http://localhost:5000/api/users/:user_id)
    .get(function(req, res) {
		response = res;
		userManagement.getUserProfile(req,function(err,user){
			if (err)
                res.status(500).send(err.message);
			else if(user == undefined || user == null  )
					res.status(404).json({ message: 'User not found' })
			else
				res.status(200).json(user);
		});
    })
	
	.put(function(req, res) {
		response = res;
			userManagement.updateUser({email:req.params.user_id},req.body,function(err,user){
				//console.log("Err: "+JSON.stringify(err, ["message", "arguments", "type", "name"]));
				if (err)
					res.status(500).send(err.message);
				else if(user == undefined || user == null  )
					res.status(404).json({ message: 'User not found' })
				else
					res.status(204).send();
			});
    })
	
	.delete(function(req, res) {
		response = res;
		userManagement.removeUser(req,function(err){
			if (err)
                res.status(500).send(err.message);
			else
				res.status(200).json({ message: 'User deleted' });
		});
    });
	

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

app.use('/api', router);

app.listen(theport);
console.log('Magic happens on port ' + theport);

//
// Preamble
var http = require ('http');	     // For serving a basic web page.
var mongoose = require ("mongoose"); // The reason for this demo.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring = 
  process.env.MONGODB_URI || 
  'mongodb://52.35.182.188:27017/maindb';



// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});
*/


