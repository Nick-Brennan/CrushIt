var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var siteSchema = new Schema({
	url: {type: String, required: true, unique: true},
	description: String,
	upVotes: Number,
	downVotes: Number,
	postedBy: Number
});

var Site = mongoose.model('Site', siteSchema);

module.exports = Site;