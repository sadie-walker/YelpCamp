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
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            })
        }
    })
})

//Login
router.get("/login", function(req,res){
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){})

//Logout
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds")
})

module.exports = router;