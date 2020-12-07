const bodyParser = require("body-parser")
var express = require("express")
const passport = require("passport")
var router = express.Router()
// var bodyParser = require("body-parser")

// Database Connection



router.get('/', function(req, res){

    res.render('login')

})

router.post('/', passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/"
}), function(req, res){
});

module.exports = router;