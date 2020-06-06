const express = require("express");
const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 3000; 

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true , useUnifiedTopology: true}); 

const campgrounds = [
    {name: "Camp1", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Camp2", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Camp3", image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Camp4", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Camp5", image: "https://images.unsplash.com/photo-1551655510-d6aa6e46b00e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80"},
    {name: "Camp6", image: "https://images.unsplash.com/photo-1564577160324-112d603f750f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"},
    {name: "Camp7", image: "https://images.unsplash.com/photo-1541363452546-84aa064f4806?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80"},
    {name: "Camp8", image: "https://images.unsplash.com/photo-1516013894828-b214a58fdba7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"}
]

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){
    res.render("campgrounds",{campgrounds: campgrounds});
})

app.post("/campgrounds", function(req,res){
    let campInput = req.body.newCampInput;
    let imageInput = req.body.newCampImageInput

    campgrounds.push({name: campInput, image: imageInput});
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function(req,res){
    res.render("new-camp");
})

app.listen(port, function(){
    console.log("server is running");
})