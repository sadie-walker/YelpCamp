const mongoose = require("mongoose");

//add campground Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

//create camground model
const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;