const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user")
const passport = require("passport");
const LocalStrategy = require("passport-local");

const indexRoutes = require("./routes/index");
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

//server
app.listen(port, function(){
    console.log("server is running");
})