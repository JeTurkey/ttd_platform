var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
// var chatjs = require("chart.js")



// ============= Router ==============
var index = require('./models/indexGet.js') // Index Page ---- GET
var governmentTracker = require('./models/govDeptGet.js') // Government Tracker Page ---- GET
var singleGovTracker = require('./models/singleGovDeptGet.js') // Single Government Tracker Page ---- GET
var readNews = require('./models/readNewsGet.js') // Read news Page ---- GET
var searchNews = require('./models/searchNewsPost.js') // Search News Page ---- POST


// ============= Router END ==============

var app = express();

app.use(require("express-session")({
    secret: "Hello",
    resave: false,
    saveUninitialized: false
}))

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))



// ============= Router USE ==============
app.use('/', index)
app.use('/governmentTracker', governmentTracker)
app.use('/governmentTracker/', singleGovTracker)
app.use('/readNews', readNews)
app.use('/searchNews', searchNews)

// ============= Router USE END ==============

app.listen(8080, function(){
    console.log("Server is running")
})