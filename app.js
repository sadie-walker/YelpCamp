const express = require("express");
const app = express();
const port = process.env.PORT || 3000; 

app.get("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
})

app.listen(port, function(){
    console.log("server is running");
})