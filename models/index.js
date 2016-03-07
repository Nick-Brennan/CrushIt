var mongoose = require('mongoose');
mongoose.connect(	process.env.MONGOLAB_URI ||
					process.env.MONGOHQ_URL ||
					"mongodb://localhost/Crush-It");

module.exports.User = require('./user.js');
module.exports.Site = require('./site.js');
module.exports.Comment = require('./comment.js');