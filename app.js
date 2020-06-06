const express = require("express");
const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 3000; 

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true , useUnifiedTopology: true}); 

//add campground Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
})

//create camground model
const Campground = mongoose.model("Campground", campgroundSchema);


app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){
    Campground.find({}, function(err,campgrounds){
        if(err){
            console.log("error");
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: campgrounds})
        }
    })
})

app.post("/campgrounds", function(req,res){
    let campInput = req.body.newCampInput;
    let imageInput = req.body.newCampImageInput

    Campground.create({
        name: campInput, 
        image: imageInput
    }, function(err, campground){
        if(err){
            console.log("error");
        }
        else{
            console.log("campgrounded added")
        }
    });

    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function(req,res){
    res.render("new-camp");
})

app.listen(port, function(){
    console.log("server is running");
})