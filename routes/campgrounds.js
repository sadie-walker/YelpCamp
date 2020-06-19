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
router.get("/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

//Campground CREATE
router.post("/", isLoggedIn, function(req,res){
    Campground.create(req.body.camp, function(err, newCamp){
        if(err){
            console.log(err);
        }
        else{
            newCamp.author = {
                _id: req.user._id,
                username: req.user.username
            }
            newCamp.save();
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;