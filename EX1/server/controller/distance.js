function Distance() {
    this.getDistance = function(req, res) {
        var long1 = parseFloat(req.query.long1);
        var lat1 = parseFloat(req.query.lat1);
        var long2 = parseFloat(req.query.long2);
        var lat2 = parseFloat(req.query.lat2);
        var dLat = deg2rad(lat2 - lat1);
        var dLong = deg2rad(long2 - long1);
        var radiusR = 6371;
        var d1 =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLong / 2) *
                Math.sin(dLong / 2);
        console.log(dLat,dLong )
        var d2 = 2 * Math.atan2(Math.sqrt(d1), Math.sqrt(1 - d1));

        var d = radiusR * d2;
        console.log(req)

        res.json({
            distance: d
        });
    };
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

module.exports = new Distance();
