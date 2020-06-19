const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//Comments NEW route
router.get("/campgrounds/:id/comments/new", isLoggedIn,  function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: rtrnCamp});
        }
    })
})

//comments CREATE route
router.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    rtrnCamp.comments.push(comment);
                    rtrnCamp.save();
                    res.redirect("/campgrounds/" + rtrnCamp._id);
                }
            })
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