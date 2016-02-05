var mongoose = require('mongoose');
mongoose.connect(	process.env.MONGOLAB_URI ||
					process.env.MONGOHQ_URL ||
					"mongodb://localhost/CrushIt");

module.exports.User = require('./user.js');