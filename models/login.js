const bodyParser = require("body-parser")
var express = require("express")
var router = express.Router()
// var bodyParser = require("body-parser")

// Database Connection



router.get('/', function(req, res){

    res.render('login')

})

module.exports = router;