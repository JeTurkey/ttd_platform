var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport')
var LocalStrategy = require('passport-local')
var passportLocalMongoose = require('passport-local-mongoose');
var expressSanitizer      = require("express-sanitizer")
var User                  = require("./models/userSchema")
require('echarts');

// var chatjs = require("chart.js")

// ============== MongoDB connection =============
mongoose.connect("mongodb://localhost/ttd", { useNewUrlParser: true })
// ============== MongoDB connection END =============

// ============= GET Router ==============
var index = require('./models/indexGet.js') // GET ---- Index Page 
var governmentTracker = require('./models/govDeptGet.js') // GET ---- Government Tracker Page 
var singleGovTracker = require('./models/singleGovDeptGet.js') // GET ---- Single Government Tracker Page 
var readNews = require('./models/readNewsGet.js') // GET ---- Read news Page 
var companyTracker = require('./models/companyTrackerGet.js') // GET ---- Company Tracker
var singleComTracker = require('./models/singleComGet.js') // GET ---- Single company Tracker
var singleNews = require('./models/singleNews.js') // GET ---- Single news
var loginGet = require('./models/login.js') // GET ---- Login
var industryTracker = require("./models/industryTrackerGet.js") // GET ---- industry Tracker
var singleIndTracker = require('./models/singleIndGet.js') // GET ---- Single Industry Page
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

// ============== 登陆代码 =================
app.use(expressSanitizer());
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ============== 登陆代码 END =================


// ============= Router USE ==============
app.use('/', loginGet)
app.use('/home', isLoggedIn, index)
app.use('/governmentTracker', isLoggedIn, governmentTracker)
app.use('/governmentTracker/', isLoggedIn, singleGovTracker)
app.use('/readNews', isLoggedIn, readNews)
app.use('/readNews/', isLoggedIn, singleNews)
app.use('/searchNews', isLoggedIn, searchNews)
app.use('/companyTracker', isLoggedIn, companyTracker)
app.use('/companyTracker/', isLoggedIn, singleComTracker)
app.use('/industryTracker', isLoggedIn, industryTracker)
app.use('/industryTracker/', isLoggedIn, singleIndTracker)
// app.use('/home', index)
// app.use('/governmentTracker', governmentTracker)
// app.use('/governmentTracker/', singleGovTracker)
// app.use('/readNews', readNews)
// app.use('/readNews/', singleNews)
// app.use('/searchNews', searchNews)
// app.use('/companyTracker', companyTracker)
// app.use('/companyTracker/', singleComTracker)
// app.use('/industryTracker', industryTracker)
// app.use('/industryTracker/', singleIndTracker)

// ============= Router USE END ==============

app.get('/public/icon/*', function(req, res){
    res.sendFile(__dirname + "/" + req.url)
    console.log('Request for ' + req.url + 'received')
})



// ============= 中间件 ==============
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}
// ============= 中间件 END ==============

app.listen(8080, function(){
    console.log("Server is running")
})