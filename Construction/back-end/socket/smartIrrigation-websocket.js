'use strict';
var ws_clients = [];
var crop_user = ''

exports.start_ws = function(ws) {
    ws.on('connection', function(client) {  
        console.log('Websocket client connected...');
        ws_clients.push(client)
        
        // server receive
        client.on('register', function(crop_user) {
        });

    });
};

exports.emit_ws = function(cuser, message) {
    if (0 === ws_clients.length) {
        console.log('ws_client empty')
        return
    }

    for (var i = 0; i < ws_clients.length; i++) {
        ws_clients[i].emit(cuser, message)
    }
}