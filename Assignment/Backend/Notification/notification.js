module.exports = function(noti, playerIds) {
    var message = {
        app_id: "f5dbee2d-7ae3-4c25-8f5f-5e91f0bd60d2",
        contents: {"en": noti},
        include_player_ids: playerIds
    };

    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic MTY0OWUxMjktZWQwNC00NjlhLTgxZDQtYTcxMDE1NTM1NTRh"
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require('https');
    var req = https.request(options, function(res) {
        res.on('data', function(data) {
            console.log("Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(message));
    req.end();
};