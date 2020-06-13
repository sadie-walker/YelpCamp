const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");

const port = process.env.PORT || 3000; 

//connect to database
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true , useUnifiedTopology: true}); 

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
})

//INDEX
app.get("/campgrounds", function(req,res){
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log("error");
            console.log(err);
        } else {
            res.render("campgrounds/index", {allCampgrounds: allCampgrounds})
        }
    })
})

//CREATE
app.post("/campgrounds", function(req,res){
    let campInput = req.body.newCampInput;
    let imageInput = req.body.newCampImageInput
    let descInput = req.body.newCampDescInput

    Campground.create({
        name: campInput, 
        image: imageInput,
        description: descInput
    }, function(err, newCampground){
        if(err){
            console.log("error");
            console.log(err);
        }
        else{
            console.log("campground added")
        }
    });

    res.redirect("/campgrounds");
})

//NEW
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
})

//SHOW
app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, rtrnCamp){
        if(err){
            console.log(err)
        } else{
            res.render("campgrounds/show", {campground: rtrnCamp});
        }
    })
})

// ***********************************************************************************************
app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: rtrnCamp});
        }
    })
})
//server
app.listen(port, function(){
    console.log("server is running");
})