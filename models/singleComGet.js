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

    queryString1 = 'select news_link, news_title, com_name, Date_format(cn.news_date, \'%Y-%m-%d\') as new_news_date from ttd.company c join ttd.com_news cn on cn.com_id = c.com_id join ttd.news n on n.news_id = cn.news_id where cn.com_id = ' + req.params.id + ' ORDER BY cn.news_id DESC LIMIT 5;'
    queryString2 = 'select count(news_title) as news_count, Date_format(cn.news_date, "%Y-%m-%d") as new_news_date from ttd.company c join ttd.com_news cn on cn.com_id = c.com_id join ttd.news n on n.news_id = cn.news_id where cn.com_id = ' + req.params.id + ' GROUP BY new_news_date ORDER BY new_news_date DESC LIMIT 30;'
    focusSource = 'select c.news_source, count(1) as freq from ttd.company as a left join ttd.com_news as b on a.com_id = b.com_id left join ttd.news as c on b.news_id = c.news_id where a.com_id = ' + req.params.id + ' and c.news_date >= date_sub(curdate(), interval 30 day) group by c.news_source order by count(1) desc limit 5;'
    recent30Days = 'select date(record_date) as record_date, (select sum(topic_count) from topic_trend as b where b.record_date <= a.record_date and b.topic_id = a.topic_id and b.`record_date` >= date_sub(curdate(), interval 30 day)) as cum_count from topic_trend as a left join topic_com as b on b.topic_id = a.topic_id where b.com_id = ' + req.params.id + ' and `record_date` >= date_sub(curdate(), interval 30 day) limit 30;'
    if (req.params.id == 3){
        hotTopic = 'select c.topic_id, c2.tag_name, count(1) as freq from ttd.news as a left join ttd.com_news as b on a.news_id = b.news_id left join ttd.topic_news as c on b.news_id = c.news_id left join ttd.topic as c2 on c.topic_id = c2.topic_id where b.com_id = ' + req.params.id + ' and c.topic_id in (1,2,3,5,15) and a.news_date >= date_sub(curdate(), interval 30 day) group by c.topic_id, c2.tag_name order by count(1) desc;'
    }else{
        hotTopic = 'select c.topic_id, c2.tag_name, count(1) as freq from ttd.news as a left join ttd.com_news as b on a.news_id = b.news_id left join ttd.topic_news as c on b.news_id = c.news_id left join ttd.topic as c2 on c.topic_id = c2.topic_id where b.com_id = ' + req.params.id + ' and a.news_date >= date_sub(curdate(), interval 30 day) and c.topic_id <> 13 and c.topic_id is not null group by c.topic_id, c2.tag_name order by count(1) desc limit 5;'
    }
    
    indexMeter = 'select record_date, neg, pos from ttd.com_score where com_id = ' + req.params.id + ' and (neg <> 0 or pos <> 0) order by record_date desc limit 1;'
    
    
    connection.query(queryString1 + queryString2 + recent30Days + focusSource + hotTopic + indexMeter
        , [1, 2, 3, 4, 5, 6], function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            res.render('singleCom', {data: rst[0], data2: rst[1].reverse(), recent: rst[2], source: rst[3], hot: rst[4].reverse(), meter: rst[5]})
        }
    })
})

module.exports = router;