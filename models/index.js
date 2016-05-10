var mongoose = require('mongoose');
mongoose.connect(	process.env.MONGOLAB_URI ||
					process.env.MONGOHQ_URL ||
					"mongodb://localhost/crushit");

module.exports.User = require('./user.js');
module.exports.Site = require('./site.js');