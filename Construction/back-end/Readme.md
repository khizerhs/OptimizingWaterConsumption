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
