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

//

router.post('/', function(req, res){
    topic_id = req.body.topic_id;

    gov_dept_id = req.body.gov_dept_id_in_topic;

    console.log(topic_id)
    console.log(gov_dept_id)
    
    queryString = 'INSERT IGNORE INTO ttd.tms_relationship (A, B) VALUES (\'' + topic_id + '\', \'' + gov_dept_id + '\');'
    queryString2 = 'INSERT IGNORE INTO ttd.tms_relationship (A, B) VALUES (\'' + gov_dept_id + '\', \'' + topic_id + '\');'

    connection.query(queryString + queryString2, [0, 1], function(err, rst){
        if (err){
            console.log(err)
            return err
        }else{
            res.redirect('back')
        }
    })

})


module.exports = router;