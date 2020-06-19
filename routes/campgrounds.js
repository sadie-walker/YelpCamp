const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

//INDEX
router.get("/campgrounds", function(req,res){
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log("error");
            console.log(err);
        } else {
            res.render("campgrounds/index", {allCampgrounds: allCampgrounds});
        }
    })
})

//CREATE
router.post("/campgrounds", function(req,res){
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
router.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
})

//SHOW
router.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, rtrnCamp){
        if(err){
            console.log(err)
        } else{
            res.render("campgrounds/show", {campground: rtrnCamp});
        }
    })
})

module.exports = router;