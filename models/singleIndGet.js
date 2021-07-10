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

    topic_news = 'select n.news_title, n.news_link, Date_format(n.news_date, "%Y-%m-%d") as new_record_date, com_tag, gov_tag from ttd.topic_news as tn left join news as n on tn.news_id = n.news_id where tn.topic_id = "' + req.params.id + '" order by new_record_date DESC limit 10; '
    topic_trend = 'select topic_count, Date_format(record_date, "%Y-%m-%d") as new_record_date from ttd.topic_trend tt where tt.topic_id = "' + req.params.id + '" ORDER BY new_record_date DESC LIMIT 60;'

    connection.query(topic_news + topic_trend, [1, 2], function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            res.render('singleInd', {data: rst[0], data2: rst[1].reverse()})
        }
    })
})

module.exports = router;