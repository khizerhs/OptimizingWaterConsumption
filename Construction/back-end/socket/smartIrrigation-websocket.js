'use strict';
var ws_clients = null;
var crop_user = ''

exports.start_ws = function(ws) {
    ws.on('connection', function(client) {  
        console.log('Websocket client connected...');
        ws_clients = client

        // server receive
        client.on('register', function(crop_user) {
            console.log(crop_user)
            ws_clients.emit("ws_test", crop_user)
        });

    });
};

exports.emit_ws = function(topic, cuser, message) {
    if (null == ws_clients) {
        console.log('ws_client null')
        return
    }

    // if (cuser != crop_user) {
    //     return
    // }

    console.log('emit ' + topic, message)
    ws_clients.emit(topic, message)
}