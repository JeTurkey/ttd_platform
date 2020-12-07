const bodyParser = require("body-parser")
var express = require("express")
var router = express.Router()
var mysql = require("mysql")


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

router.get('/:id', function(req, res){
    
    queryString = 'SELECT * FROM ttd.news n WHERE n.news_id=' + req.params.id + ';'

    

    connection.query(queryString, function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            res.render('singleNews', {data: rst})
        }
    })
})

module.exports = router;