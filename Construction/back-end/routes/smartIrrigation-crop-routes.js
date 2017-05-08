'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../data_management/crop_management');
  var smartIrrigationStage = require('../data_management/crop_stage_management');


  app.route('/crops')
    .get(smartIrrigation.list_crops)
    .post(smartIrrigation.create_crop);


  app.route('/crops/:cropId')
    .get(smartIrrigation.read_crop)
    .put(smartIrrigation.update_crop)
    .delete(smartIrrigation.delete_crop)

  app.route('/cropstage/:cropId')
    .get(smartIrrigationStage.list_stages)
    .delete(smartIrrigationStage.delete_stage)
    
  app.route('/cropstage')
  .post(smartIrrigationStage.add_stage)
  .put(smartIrrigationStage.update_stage)
};
