var mongoose = require('mongoose'),
    schema = require('./schema'),
  CropStage = schema.CropStage;

exports.list_stages = function(req, res) {
  CropStage.find({crop_id: req.params.cropId}, function(err, stage) {
    if (stage == undefined || stage == null)
      res.status(404).json({message: 'Stages Not found'});
    else if (err)
      res.send(err);
    else
      res.json(stage);
  });
};

exports.add_stage = function(req, res) {
  var new_stage = new CropStage(req.body);
  new_stage.save(function(err, stage) {
    if (err)
      res.send(err);
    else
      res.status(201).json(stage);
  });
};

exports.update_stage = function(req,res){
   CropStage.findOneAndUpdate(req.body._id, req.body, {new: true}, function(err, stage) {
    if (stage == undefined || stage == null)
      res.status(404).json({message: 'Stage Not found'});
    else if (err)
      res.status(400).json(err);
    else    
      res.json(stage);
  });
};

exports.delete_stage = function(req, res) {
CropStage.remove({_id:req.params.cropId}, function(err, stage) {
    if (err)
      res.status(400).json(err);
    else{
      res.json({ message: 'Stage successfully deleted' });
    }
  });
};
