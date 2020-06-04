const express = require("express");
const app = express();
const port = process.env.PORT || 3000; 

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){
    res.render("campgrounds");
})

app.listen(port, function(){
    console.log("server is running");
})