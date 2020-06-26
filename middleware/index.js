const middlewareObj = {};
const Campground = require("../models/campground");

//LOGGED IN CHECK
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You must be logged in");
        res.redirect("/login");
    }
}

//CAMPGROUND AUTHOR CHECK
middlewareObj.isCampgroundAuthor = function(req, res, next){
    Campground.findById(req.params.id, function(err, rtrnCamp){
        if(err || !rtrnCamp){
            req.flash("error", "Campground not found");
            res.redirect("back");
            console.log(err);
        } else{
            if(req.isAuthenticated() && req.user.username === rtrnCamp.author.username){
                return next();
            } else {
                req.flash("error", "You don't have permission to edit/remove this Campground");
                res.redirect("/campgrounds/" + req.params.id);
            }
        }
    })
}

//COMMENT AUTHOR CHECK
middlewareObj.isCommentAuthor = function(req, res, next){
    Comment.findById(req.params.commentId, function(err, rtrnComm){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
            console.log(err);
        } else {
            if(req.isAuthenticated() && rtrnComm.author.username === currentUser.username){
                return next();
            } else {
                req.flash("error", "You don't have permission to edit/remove this Campground");
                res.redirect("/campgrounds/" + req.params.id);
            }
        }
    })
}

module.exports = middlewareObj;