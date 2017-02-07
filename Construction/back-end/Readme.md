# REST API Endpoints
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
