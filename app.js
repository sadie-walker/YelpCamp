const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");

//Require Routes
const indexRoutes = require("./routes/index");
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");

//Port Connection
const port = process.env.PORT || 3000; 

//Database Connection
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true , useUnifiedTopology: true}); 

//HTTP CONFIG
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride("_method"));

// FILE CONFIG
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//FLASH CONFIG
app.use(flash());

//PASSPORT CONFIG
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//ROUTES CONFIG
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Server
app.listen(port, function(){
    console.log("server is running");
})