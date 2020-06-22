const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//landing page
router.get("/", function(req, res){
    res.render("landing");
})


// ******************* AUTH ROUTES *****************************
//Sign Up
router.get("/register", function(req,res){
    res.render("register");
})

router.post("/register", function(req,res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + req.user.username);
                res.redirect("/campgrounds");
            })
        }
    })
})

//Login
router.get("/login", function(req,res){
    req.flash("error", "Please login first");
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}))

//Logout
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds")
})

module.exports = router;