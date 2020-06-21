const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

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
                id: req.user._id,
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

// Campground EDIT
router.get("/:id/edit", isAuthor, function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: rtrnCamp});
        }
    })
})

// Campground UPDATE
router.put("/:id", isAuthor, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updtCamp){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// Campground DESTORY
router.delete("/:id", isAuthor, function(req,res, next){
    Campground.findByIdAndRemove(req.params.id, function(err, dltCamp){
        dltCamp.comments.forEach(function(comment){
            console.log(comment._id);
            Comment.findByIdAndDelete(comment._id, function(err, dltComm){
                if(err){
                    console.log(err);
                } else{
                    return next();
                }
            });
        })
   })
   res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

function isAuthor(req, res, next){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else{
            if(req.isAuthenticated() && req.user.username === rtrnCamp.author.username){
                return next();
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        }
    })
}

module.exports = router;