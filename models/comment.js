const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: String,
    rating: Number,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})

const Comment = mongoose.model("Comment", commentSchema); 

module.exports = Comment;