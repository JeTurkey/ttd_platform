const bodyParser = require("body-parser")
var express = require("express")
var router = express.Router()



// TMS Home 不需要链接DB

router.get('/', function(req, res){
    // queryString = 'SELECT distinct a.gov_dept_id, gov_dept_name FROM ttd.gov_dept as a join topic_gov as b on a.gov_dept_id = b.gov_dept_id;;'

    res.render('TMS_home')


})


module.exports = router;