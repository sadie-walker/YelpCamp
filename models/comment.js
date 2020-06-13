const mongoose = ("mongoose");

const commentSchema = mongoose.Schema({
    text: String,
    author: String
})

const Comment = mongoose.model("Comment", commentSchema); 

module.exports = Comment;