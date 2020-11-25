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


router.get('/:id', function(req, res){
    
    queryString = 'select news_title, gov_dept_name, Date_format(news_date, \'%Y-%m-%d\') as news_date from gov_dept d join gov_news gn on gn.gov_dept_id = d.gov_dept_id join news n on n.news_id = gn.news_id where gn.gov_dept_id = ' + req.params.id + ' ORDER BY gn.news_id DESC LIMIT 7;'

    

    connection.query(queryString, function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            res.render('singleGovDept', {data: rst})
        }
    })
})

module.exports = router;