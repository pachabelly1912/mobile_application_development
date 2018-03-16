var DistanceAPI = require('./controller/distance');

module.exports = {

	configure: function(express, app) {

		// API Routes
		var router = express.Router();

		// Routes will be perofixed with /api
		app.use('/api', router);
		router.use(function(req, res, next){
			console.log('FYI... There is some processing currently going down...');
			next();
		});

		router.route('/distance')

			.get(function(req, res){
				DistanceAPI.getDistance(req, res);
			});
	}	
};