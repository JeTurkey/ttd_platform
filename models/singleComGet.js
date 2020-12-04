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

    queryString1 = 'select news_link, news_title, com_name, Date_format(news_date, \'%Y-%m-%d\') as news_date from ttd.company c join ttd.com_news cn on cn.com_id = c.com_id join ttd.news n on n.news_id = cn.news_id where cn.com_id = ' + req.params.id + ' ORDER BY cn.news_id DESC LIMIT 7;'
    queryString2 = 'select count(news_title) as news_count, Date_format(news_date, "%Y-%m-%d") as news_date from ttd.company c join ttd.com_news cn on cn.com_id = c.com_id join ttd.news n on n.news_id = cn.news_id where cn.com_id = ' + req.params.id + ' GROUP BY news_date;'

    connection.query(queryString1 + queryString2, [1, 2], function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            res.render('singleCom', {data: rst[0], data2: rst[1]})
        }
    })
})

module.exports = router;