'use strict';
var ws_clients = {};

exports.start_ws = function(ws) {
    ws.on('connection', function(client) {  
        console.log('Websocket client connected...');        

        client.on('register', function(crop_user) {
            console.log('register ' + crop_user)
            if (!(crop_user in ws_clients)) {
                ws_clients[crop_user] = []
            }
            ws_clients[crop_user].push(client)
        });

        client.on('unregister', function(crop_user) {
            console.log('unregister ' + crop_user)
            
            if (crop_user in ws_clients) {
                for (var i = 0;i < ws_clients[crop_user].length; ++i) {
                    if (ws_clients[crop_user][i] === client) {
                        ws_clients[crop_user].splice(i, 1)
                        break
                    }
                }
            }
        });


    });
};

exports.emit_ws = function(cuser, message) {
    if (0 === ws_clients.length) {
        console.log('ws_client empty')
        return
    }

    if (cuser in ws_clients) {
        for (var i = 0; i < ws_clients[cuser].length; i++) {
            console.log('emit to ' + cuser + ' ' + message)
            ws_clients[cuser][i].emit(cuser, message)
        }
    }
}