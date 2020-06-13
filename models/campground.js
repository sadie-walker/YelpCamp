const mongoose = require("mongoose");

//add campground Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
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