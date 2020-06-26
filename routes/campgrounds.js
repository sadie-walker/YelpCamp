const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//Campground INDEX
router.get("/", function(req,res){
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {allCampgrounds: allCampgrounds});
        }
    })
})

//Campground NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

//Campground CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.create(req.body.camp, function(err, newCamp){
        if(err){
            req.flash("error", "Unable to create new campground");
            res.redirect("back");
            console.log(err);
        }
        else{
            newCamp.author = {
                id: req.user._id,
                username: req.user.username
            }
            newCamp.save();
            req.flash("success", "Campground added!");
            res.redirect("/campgrounds");
        }
    });
})

//Campground SHOW
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, rtrnCamp){
        if(err || !rtrnCamp){
            req.flash("error", "Unable to find campground");
            res.redirect("back");
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: rtrnCamp});
        }
    })
})

// Campground EDIT
router.get("/:id/edit", middleware.isCampgroundAuthor, function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            req.flash("error", "Unable to find campground");
            res.redirect("back");
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: rtrnCamp});
        }
    })
})

// Campground UPDATE
router.put("/:id", middleware.isCampgroundAuthor, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updtCamp){
        if(err){
            req.flash("error", "Unable to update campground");
            res.redirect("back");
            console.log(err);
        } else {
            req.flash("Campground Updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// Campground DESTORY
router.delete("/:id", middleware.isCampgroundAuthor, function(req,res, next){
    Campground.findByIdAndRemove(req.params.id, function(err, dltCamp){
        if(err){
            req.flash("error", "Unable to find campground");
            res.redirect("back");
            console.log(err);
        } else {
            dltCamp.comments.forEach(function(comment){
                Comment.findByIdAndDelete(comment._id, function(err, dltComm){
                    if(err){
                        req.flash("error", "Unable to delete comments");
                        res.redirect("back");
                        console.log(err);
                    } else{
                        return next();
                    }
                });
            })
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
        
   })
})

module.exports = router;