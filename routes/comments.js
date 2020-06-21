const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//Comments NEW
router.get("/new", isLoggedIn,  function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: rtrnCamp});
        }
    })
})

//Comments CREATE
router.post("/", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author = {
                        _id: req.user._id,
                        username: req.user.username
                    }
                    comment.save();
                    rtrnCamp.comments.push(comment);
                    rtrnCamp.save();
                    res.redirect("/campgrounds/" + rtrnCamp._id);
                }
            })
        }
    })
})

//EDIT
router.get("/:commentId/edit", function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else{
            Comment.findById(req.params.commentId, function(err, rtrnComm){
                res.render("comments/edit", {comment: rtrnComm, campground: rtrnCamp});
            }) 
        }
    })
})

//UPDATE
router.put("/:commentId", function(req,res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, rtrnComm){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
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