var mongoose = require('mongoose');
mongoose.connect(	process.env.MONGOLAB_URI ||
					process.env.MONGOHQ_URL ||
					"localhost");

module.exports.User = require('./user.js');