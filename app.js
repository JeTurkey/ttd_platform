var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
// var chatjs = require("chart.js")



// ============= Router ==============
var index = require('./models/indexGet.js') // Login page ---- GET

// ============= Router END ==============

var app = express();

app.use(require("express-session")({
    secret: "Hello",
    resave: false,
    saveUninitialized: false
}))

app.set("view engine", "ejs")
app.use(express.static("public"))



// ============= Router USE ==============
app.use('/', index)

// ============= Router USE END ==============

app.listen(8080, function(){
    console.log("Server is running")
})