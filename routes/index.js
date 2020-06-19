const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//landing page
router.get("/", function(req, res){
    res.render("landing");
})


// ******************* AUTH ROUTES *****************************
//registration routes
router.get("/register", function(req,res){
    res.render("register");
})

router.post("/register", function(req,res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            })
        }
    })
})

//login routes
router.get("/login", function(req,res){
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

//logout route
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds")
})

module.exports = router;