const middlewareObj = {};
const Campground = require("../models/campground");

//LOGGED IN CHECK
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

//CAMPGROUND AUTHOR CHECK
middlewareObj.isCampgroundAuthor = function(req, res, next){
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

//COMMENT AUTHOR CHECK
middlewareObj.isCommentAuthor = function(req, res, next){
    Comment.findById(req.params.commentId, function(err, rtrnComm){
        if(err){
            console.log(err);
        } else {
            if(req.isAuthenticated() && rtrnComm.author.username === currentUser.username){
                return next();
            } else{
                res.redirect("/campgrounds/" + req.params.id);
            }
        }
    })
}

module.exports = middlewareObj;