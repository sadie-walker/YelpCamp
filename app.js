const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user")
const passport = require("passport");
const LocalStrategy = require("passport-local");

const port = process.env.PORT || 3000; 

//connect to database
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true , useUnifiedTopology: true}); 

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// ********** PASSPORT CONFIG
app.use(require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ********************************* ROUTES ********************************************************************
//landing page
app.get("/", function(req, res){
    res.render("landing");
})

// *************** CAMPGROUND ROUTES ***********************************************
//INDEX
app.get("/campgrounds", function(req,res){
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log("error");
            console.log(err);
        } else {
            res.render("campgrounds/index", {allCampgrounds: allCampgrounds})
        }
    })
})

//CREATE
app.post("/campgrounds", function(req,res){
    let campInput = req.body.newCampInput;
    let imageInput = req.body.newCampImageInput
    let descInput = req.body.newCampDescInput

    Campground.create({
        name: campInput, 
        image: imageInput,
        description: descInput
    }, function(err, newCampground){
        if(err){
            console.log("error");
            console.log(err);
        }
        else{
            console.log("campground added")
        }
    });

    res.redirect("/campgrounds");
})

//NEW
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
})

//SHOW
app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, rtrnCamp){
        if(err){
            console.log(err)
        } else{
            res.render("campgrounds/show", {campground: rtrnCamp});
        }
    })
})

// *******************COMMENTS ROUTES ****************************************************
//Comments NEW route
app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, isLoggedIn, function(err, rtrnCamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: rtrnCamp});
        }
    })
})

//comments CREATE route
app.post("/campgrounds/:id/comments", function(req,res){
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

// ******************* PASSPORT ROUTES *****************************
//registration routes
app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(res, req, function(){
                res.redirect("/campgrounds");
            })
        }
    })
})

//login routes
app.get("/login", function(req,res){
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

//logout route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds")
})

//server
app.listen(port, function(){
    console.log("server is running");
})