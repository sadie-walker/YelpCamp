const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


//Comments NEW
router.get("/new", middleware.isLoggedIn,  function(req,res){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: rtrnCamp});
        }
    })
})

//Comments CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
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
router.get("/:commentId/edit", middleware.isCommentAuthor, function(req,res){
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
router.put("/:commentId", middleware.isCommentAuthor, function(req,res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, rtrnComm){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//DESTROY
router.delete("/:commentId", middleware.isCommentAuthor, function(req,res){
    Comment.findByIdAndDelete(req.params.commentId, function(err, dltComm){
        if(err){
            console.log(err);
        } else {
            Campground.findByIdAndUpdate(req.params.id, {
                $pull: {
                    comments: req.params.commentId
                }
            }, function(err, updtCamp){
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    })
})

module.exports = router;