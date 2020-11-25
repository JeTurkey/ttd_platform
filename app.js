var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
// var chatjs = require("chart.js")



// ============= GET Router ==============
var index = require('./models/indexGet.js') // GET ---- Index Page 
var governmentTracker = require('./models/govDeptGet.js') // GET ---- Government Tracker Page 
var singleGovTracker = require('./models/singleGovDeptGet.js') // GET ---- Single Government Tracker Page 
var readNews = require('./models/readNewsGet.js') // GET ---- Read news Page 
var companyTracker = require('./models/companyTrackerGet.js') // GET ---- Company Tracker


// ============= GET Router END ==============

// ============= POST Router ==============
var searchNews = require('./models/searchNewsPost.js') // POST ---- Search News Page 
// ============= POST Router END ==============

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
app.use('/companyTracker', companyTracker)

// ============= Router USE END ==============

app.listen(8080, function(){
    console.log("Server is running")
})