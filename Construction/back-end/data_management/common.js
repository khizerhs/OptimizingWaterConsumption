var mqtt_topics = ['arduino-temp', 'arduino-hum', 'arduino-soil', 'arduino-water']
exports.mqtt_topics = mqtt_topics

exports.getBayTime = function() {
    var time_offset = -8 * 60 * 60 * 1000
    return +new Date() + time_offset
}