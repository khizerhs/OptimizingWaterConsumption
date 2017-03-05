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
  mad : { type: String, required : true},
  sensors : [{ type: Schema.Types.ObjectId, ref: 'Sensor'}]
}, { autoIndex: true });

var sensorHistorySchema = new mongoose.Schema({
  sensor_id : {type: mongoose.Schema.Types.ObjectId, ref : 'Sensor'},
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  value:{ type:String , required : true},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var weatherHistorySchema = new mongoose.Schema({
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  precipitation : { type: String},
  solar_radiation:{ type: String},
  soil_heat_flux_density:{type:String},
  saturation_vapor_pressure:{type:String},
  actual_vapor_pressure:{type:String},
  delta:{type:String},
  gamma:{type:String},
  avg_max_temp : {type:String},
  avg_min_temp : {type:String},
  win_speed : {String},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

var waterConsumptionHistorySchema = new mongoose.Schema({
  crop_user_id : {type: mongoose.Schema.Types.ObjectId, ref : 'CropUser'},
  evatranspiration:{ type: String},
  water_consumption:{ type: String},
  creation_date: {type: Date, default: Date.now}
}, { autoIndex: true });

exports.Crop = mongoose.model('Crop', cropSchema);
exports.CropStage = mongoose.model('CropStage', cropSchema);
exports.User = mongoose.model('User', userSchema);
exports.Sensor = mongoose.model('Sensor', sensorSchema);
exports.CropUser = mongoose.model('CropUser', cropUserSchema);
exports.SensorHistory = mongoose.model('SensorHistory', sensorHistorySchema);
exports.WaterConsumptionHistory = mongoose.model('WaterConsumption', waterConsumptionHistorySchema);
exports.WeatherHistory= mongoose.model('WeatherHistory', cropSchema);
