var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var cropSchema = new mongoose.Schema({
  name:{ type: String,required : true},
  description:{ type: String, trim: true },
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var cropStageSchema = new mongoose.Schema({
  crop_id : {type: mongoose.Schema.Types.ObjectId, ref : 'Crop'},
  stage:{ type: String,required : true},
  crop_coefficient:{ type: String},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var userSchema = new mongoose.Schema({
  name:{ type: String,required : true},
  address:{ type: String, trim: true },
  admin : { type: Boolean, default : false},
  phone: { type: String, required : true},
  login: { type: String, required : true},
  pass : {type : String, required : true}
}, { autoIndex: true });

var sensorSchema = new mongoose.Schema({
  name:{ type: String,required : true},
  description:{ type: String},
  type : { type: String}
}, { autoIndex: true });

var cropUserSchema = new mongoose.Schema({
  crop_id : {type: mongoose.Schema.Types.ObjectId, ref : 'Crop'},
  user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'User'},
  name:{ type: String,required : true},
  description:{ type: String, trim: true },
  stage : {type: String},
  field_size: { type: String, required : true},
  field_capacity: { type: String, required : true},
  acreage : { type: String},
  mad : { type: String, required : true},
  sensors : [{ type: Schema.Types.ObjectId, ref: 'Sensor'}]
}, { autoIndex: true });

var sensorHistorySchema = new mongoose.Schema({
  sensor_id : {type: mongoose.Schema.Types.ObjectId, ref : 'Sensor'},
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  value:{ type:String , required : true},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var waterConsumptionPredictionSchema = new mongoose.Schema({
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  precipitation : { type: String},
  solar_radiation:{ type: String},
  vapor_pressure:{type:String},
  air_temperature:{type:String},
  relative_humidity:{type:String},
  dew_point:{type:String},
  wind_speed:{type:String},
  wind_direction: {type:String},
  soil_temperature: {type:String},
  water_consumption_predicted: {type: String, required : true},
  date_prediction : {type: Date},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var weatherHistorySchema = new mongoose.Schema({
  creation_date: {type: Date, default: Date.now},
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  zipcode : {type:String},
  precipitation : { type: String},
  solar_radiation:{ type: String},
  vapor_pressure:{type:String},
  air_temperature:{type:String},
  relative_humidity:{type:String},
  dew_point:{type:String},
  wind_speed:{type:String},
  wind_direction: {type:String},
  soil_temperature: {type:String},
  date: {type: Date, default: Date.now},
  hour: {type: Number}
}, { autoIndex: true });

var waterConsumptionHistorySchema = new mongoose.Schema({
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  evatranspiration:{ type: String},
  water_consumption:{ type: String},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var sensorHistorySchema = new mongoose.Schema({
  sensor_id : {type: mongoose.Schema.Types.ObjectId, ref : 'Sensor'},
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  value:{ type:String , required : true},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var machineLearningSchema = new mongoose.Schema({
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  coeffs:{ type:String , required : true},
  variance_score:{ type:String , required : true},
  features_scale:{ type:String },
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var arduinoControlSchema = new mongoose.Schema({
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  valve_control : { type:String},
  temp_control : { type:String},
  hum_control : { type:String},
  soil_control : { type:String},
  soil_moisture_low_range : { type:String},
  water_pouring_time : { type:String},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

exports.Crop = mongoose.model('Crop', cropSchema);
exports.CropStage = mongoose.model('CropStage', cropSchema);
exports.User = mongoose.model('User', userSchema);
exports.Sensor = mongoose.model('Sensor', sensorSchema);
exports.CropUser = mongoose.model('CropUser', cropUserSchema);
exports.SensorHistory = mongoose.model('SensorHistory', sensorHistorySchema);
exports.WaterConsumptionHistory = mongoose.model('WaterConsumption', waterConsumptionHistorySchema);
exports.WeatherHistory= mongoose.model('WeatherHistory', weatherHistorySchema);
exports.WaterConsumptionPrediction= mongoose.model('waterConsumptionPrediction', waterConsumptionPredictionSchema);
exports.MachineLearning = mongoose.model('MachineLearning', machineLearningSchema);
exports.ArduinoControl = mongoose.model('ArduinoControl', arduinoControlSchema);

