var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	text: String,
	belongsTo: Number,
	upVotes: [Number],
	downVotes: [Number],
	postedBy: Number,
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;