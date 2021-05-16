const bodyParser = require("body-parser")
var express = require("express")
var router = express.Router()
var mysql = require("mysql")

// var connection = mysql.createConnection({
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'root',
//     password: 'Rayshi1994!',
//     database: 'ttd',
//     multipleStatements: true
// })

var connection = mysql.createConnection({
    host: 'rm-bp11g1acc24v9f69t1o.mysql.rds.aliyuncs.com',
    port: 3306,
    user: 'rayshi',
    password: 'Rayshi1994!',
    database: 'ttd',
    multipleStatements: true
})
// Connect
connection.connect()

router.get('/', function(req, res){

    queryString = 'SELECT distinct a.com_id, com_name FROM ttd.company as a join topic_com as b on a.com_id = b.com_id;'

    connection.query(queryString, function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            res.render('companyTracker', {data: rst})
        }
    })
})

module.exports = router;