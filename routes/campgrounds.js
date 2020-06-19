const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

//Campground INDEX
router.get("/", function(req,res){
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log("error");
            console.log(err);
        } else {
            res.render("campgrounds/index", {allCampgrounds: allCampgrounds});
        }
    })
})

//Campground NEW
router.get("/new", function(req,res){
    res.render("campgrounds/new");
})

//Campground CREATE
router.post("/", function(req,res){
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

//Campground SHOW
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, rtrnCamp){
        if(err){
            console.log(err)
        } else{
            res.render("campgrounds/show", {campground: rtrnCamp});
        }
    })
})

module.exports = router;