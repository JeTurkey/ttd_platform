const bodyParser = require("body-parser")
var express = require("express")
var router = express.Router()
var mysql = require("mysql")
// var bodyParser = require("body-parser")

// Database Connection

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

// initaite parser that will read search from date
// var urlencodedParser = bodyParser.json()




router.get('/', function(req, res){
    // 画图的
    queryString = 'SELECT COUNT(*) as count, Date_format(news_date, \'%y-%m-%d\') as new_news_date from ttd.news group by new_news_date ORDER BY new_news_date DESC LIMIT 30;'
    // 今日新闻
    // queryString2 = "SELECT DISTINCT news_title, n.news_id, news_link, gov_dept_name, Date_format(news_date, \'%y-%m-%d\') as news_date FROM ttd.gov_dept gd JOIN ttd.gov_news gn ON gn.gov_dept_id = gd.gov_dept_id JOIN ttd.news n ON n.news_id = gn.news_id WHERE gn.gov_dept_id = 1 ORDER BY n.news_id DESC LIMIT 7;"
    comNews = 'SELECT DISTINCT news_title, news_id, Date_format(news_date, "%Y-%m-%d") as new_news_date, com_tag, news_link FROM ttd.news WHERE char_length(com_tag) > 1 ORDER by news_id DESC LIMIT 7;'
    govNews = 'SELECT DISTINCT news_title, news_id, Date_format(news_date, "%Y-%m-%d") as new_news_date, gov_tag, news_link FROM ttd.news WHERE char_length(gov_tag) > 1 ORDER by news_id DESC LIMIT 7;'
    untaggedNews = 'SELECT DISTINCT news_title, news_id, Date_format(news_date, "%Y-%m-%d") as new_news_date FROM ttd.news WHERE char_length(com_tag) < 1 AND char_length(gov_tag) < 1 ORDER by news_id DESC LIMIT 7;'
    // queryString3 = 'select g.gov_dept_name, Date_format(nw.news_date, \'%y-%m-%d\') as news_date, count(*) as news_count From ttd.gov_dept g, ttd.gov_news n, ttd.news nw Where g.gov_dept_id = 5 and nw.news_id = n.news_id Group by g.gov_dept_name, news_date Order by nw.news_date desc;'
    // queryString4 = 'select g.gov_dept_name, Date_format(nw.news_date, \'%y-%m-%d\') as news_date, count(*) as news_count From ttd.gov_dept g, ttd.gov_news n, ttd.news nw Where g.gov_dept_id = 1 and nw.news_id = n.news_id Group by g.gov_dept_name, news_date Order by nw.news_date desc;'
    score = 'SELECT Date_format(trade_date, "%Y-%m-%d") as new_trade_date, hs300_close, sentiment_score FROM ttd_test.hs300 WHERE trade_date > date(\'2020-08-08\');'
    topic_1_trend = 'SELECT * FROM ttd.topic_trend WHERE topic_id = 1 ORDER BY record_date DESC LIMIT 2;'
    topic_2_trend = 'SELECT * FROM ttd.topic_trend WHERE topic_id = 2 ORDER BY record_date DESC LIMIT 2;'
    topic_3_trend = 'SELECT * FROM ttd.topic_trend WHERE topic_id = 3 ORDER BY record_date DESC LIMIT 2;'
    connection.query(queryString + comNews + govNews + untaggedNews + score + topic_1_trend + topic_2_trend + topic_3_trend, [1, 2, 3, 4, 5, 6, 7, 8], function(err, rst){
        if (err){
            console.log(err)
            return err
        } else {
            res.render('index', {data: rst[0].reverse(), data2: rst[1], data3: rst[2], data4: rst[3], data5: rst[4],
                                 t1t: rst[5], t2t: rst[6], t3t: rst[7]})
        }
    })

    
})

module.exports = router;
