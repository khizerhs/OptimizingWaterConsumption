# REST API Endpoints
## Crop Management
### * List all the Crops
    GET https://smartfarm-sjsu.herokuapp.com/crops

Expected Output:

    Status Code: 200 OK
    Response Body:
    [{"_id":"589a8c7b16e8fb40c66e14b7","name":"Radish","description":"First Test crop","mad":2,"__v":0,"creation_date":"2017-02-08T03:11:55.039Z"},{"_id":"589a8d7f16e8fa40d66e14b7","name":"Lettuce","description":"Second Test crop","mad":2,"__v":0,"creation_date":"2017-02-08T03:22:55.039Z"},..... ]

### * Add a Crop
    POST https://smartfarm-sjsu.herokuapp.com/crops
    
    Request Body:
    {
    "name":"Radish",
    "description":"First Test crop",
    "mad":"2"
    }

Expected Output:

     Status Code: 200 OK
     Response Body:
     [{"_id":"589a8c7b16e8fb40c66e14b7","name":"Radish","description":"First Test crop","mad":2,"__v":0,"creation_date":"2017-02-08T03:11:55.039Z"}]

### * Update a Crop
    PUT https://smartfarm-sjsu.herokuapp.com/crops/589a8c7b16e8fb40c66e14b7
    
    Request Body:
    {
    "name":"Radish",
    "description":"Updated First Test crop",
    "mad":"2"
    }
    
Note that the number "589xxxxxxxxxxxxx" is the id of the collection.
Expected output:
    
    Status Code: 200 OK
    Response Body:
    {"_id":"589a8c7b16e8fb40c66e14b7","name":"Radish","description":"Updated First Test crop","mad":2,"__v":0,"creation_date":"2017-02-08T03:11:55.039Z"}

### * Delete a Crop
    DELETE https://smartfarm-sjsu.herokuapp.com/crops/589a8c7b16e8fb40c66e14b7
Note that the number "589xxxxxxxxxxxxx" is the id of the collection.
Expected output:

    Status Code: 200 OK
    {"message":"Crop successfully deleted"}
    
### * Read a Crop
    
    GET https://smartfarm-sjsu.herokuapp.com/crops/589a8c7b16e8fb40c66e14b7

Expected Output:

     Status Code: 200 OK
     Response Body:
     {"_id":"589a8c7b16e8fb40c66e14b7","name":"Radish","description":"First Test crop","mad":2,"__v":0,"creation_date":"2017-02-08T03:11:55.039Z"}

    
## Sensor Management
### * List all the sensors in the database
    GET https://smartfarm-sjsu.herokuapp.com/sensors

Expected Output:

    Status Code: 200 OK
    Response Body:
    [{"_id":"58998a410494c5379542d348","name":"temperature","description":"test","__v":0},
     {"_id":"58998a410494c5379542d348","name":"temperature","description":"test","__v":0},....]

### * Add a sensor in the database
    POST https://smartfarm-sjsu.herokuapp.com/sensors
    
    Request Body:
    {
    "name":"temperature",
    "description":"test",
    "sensor_type":"abcd"
    }

Expected Output:

    Status Code: 200 OK
    Response Body:
    [{"_id":"58998a410494c5379542d348","name":"temperature","description":"test","__v":0}]
	
## Water consumption
### Get Water history

	GET https://sjsusmartfarm-backend.herokuapp.com/water-history?start=MM-DD-YYYY HH:MM&end=MM-DD-YYYY HH:MM

Expected Output:

    Status Code: 200 OK
    Response Body:
    [
	  {
		"_id": "58c5037398f9080004fdd170",
		"crop_user_id": "589d54a5055013627647c9e7",
		"evatranspiration": "0",
		"water_consumption": "79",
		"__v": 0,
		"creation_date": "2017-03-12T00:14:43.924Z"
	  },
	  {
		"_id": "58c5085a98f9080004fdd18a",
		"crop_user_id": "589d54a5055013627647c9e7",
		"evatranspiration": "0",
		"water_consumption": "43",
		"__v": 0,
		"creation_date": "2017-03-12T00:35:38.090Z"
	  }
	]

### Get total water consumption	

	GET https://sjsusmartfarm-backend.herokuapp.com/water-history/total-consumption?start=MM-DD-YYYY HH:MM&end=MM-DD-YYYY HH:MM
	
Expected Output:

    Status Code: 200 OK
	
	{
		"total" : "3000" //in mililiters
	}
## Water consumption prediction
### Prediction 
    GET https://sjsusmartfarm-backend.herokuapp.com/water-consumption-prediction/prediction?crop_user_id=XXXXXXXX&&date=YYYY-MM-DD

	
Expected Output:

    Status Code: 200 OK
    Response Body:
    {
		"prediction": "186.32683154658497" //in mililiters
	}

### Prediction range 
    GET https://sjsusmartfarm-backend.herokuapp.com/water-consumption-prediction/predictionByRange?crop_user_id=XXXXXXXX&&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD

    
Expected Output:

    Status Code: 200 OK
    Response Body:
    [
      {
        "prediction": 381.7383576817521,
        "date": "2017-02-01T00:00:00.000Z"
      },
      {
        "prediction": 382.39950037599226,
        "date": "2017-02-02T00:00:00.000Z"
      },
      {
        "prediction": 384.00889388483745,
        "date": "2017-02-03T00:00:00.000Z"
      }
    ]


## Weather history
### Get weather history
    GET https://sjsusmartfarm-backend.herokuapp.com/weather-history-range?cropUserId=XXXXXXXX&start=YYYY-MM-DDThh:mm::ss&end=YYYY-MM-DDThh:mm::ss

Expected Output:

    Status Code: 200 OK
    Response Body:
    [
      {
        "_id": "58e99291c562303c56d1d167",
        "precipitation": "0",
        "solar_radiation": "640",
        "vapor_pressure": "14.9",
        "air_temperature": "63.5",
        "relative_humidity": "74",
        "dew_point": "55.2",
        "wind_speed": "7.4",
        "wind_direction": "269",
        "water_consumption_predicted": "0.02041394935438913",
        "crop_user_id": "58caea3116a1664e9fdb71d7",
        "__v": 0,
        "creation_date": "2017-04-08T18:46:57.295Z"
      }
    ]