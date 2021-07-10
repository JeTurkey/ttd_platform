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
    // 相关新闻
    gettingNews = 'select a.news_id, \
                          b.news_title, \
                          Date_format(b.news_date, "%Y-%m-%d") as new_news_date, \
                          b.news_link, \
                          c.com_name \
                          from com_news as a \
                          left join news as b on a.news_id = b.news_id \
                          left join company as c on a.com_id = c.com_id \
                          where a.com_id = ' + req.params.id + ' \
                          order by a.news_id DESC \
                          limit 5;'
    
    // queryString2 = 'select count(news_title) as news_count, Date_format(cn.news_date, "%Y-%m-%d") as new_news_date from ttd.company c join ttd.com_news cn on cn.com_id = c.com_id join ttd.news n on n.news_id = cn.news_id where cn.com_id = ' + req.params.id + ' GROUP BY new_news_date ORDER BY new_news_date DESC LIMIT 30;'
    // 近30天新闻源统计 饼状图
    gettingNewsSourceCount = 'select c.data_source_name, \
                                     count(1) as freq \
                                     from ttd.com_news as a \
                                     left join ttd.news as b on a.news_id = b.news_id \
                                     left join data_source as c on b.news_source = c.data_source_id \
                                     where a.com_id = ' + req.params.id + ' and b.news_date >= date_sub(curdate(), interval 30 day) and data_source_name is not null \
                                     group by c.data_source_name;'
    // 近30天监管部门数量统计 饼状图
    gettingRegDeptCount = 'select c.gov_dept_name, \
                                  count(1) as freq \
                                  from ttd.com_news as a \
                                  left join ttd.gov_news as b on a.news_id = b.news_id \
                                  left join ttd.gov_dept as c on b.gov_dept_id = c.gov_dept_id \
                                  where a.com_id = ' + req.params.id + ' and a.news_date >= date_sub(curdate(), interval 30 day) and c.gov_dept_name is not null \
                                  group by c.gov_dept_name \
                                  order by freq DESC \
                                  limit 5;'

    // 近30天公司曝光度 折线图水位
    gettingComExpo = 'select date(record_date) as record_date, \
                            (select sum(topic_count) \
                             from topic_trend as b \
                             where b.record_date <= a.record_date and b.topic_id = a.topic_id and b.`record_date` >= date_sub(curdate(), interval 30 day) \
                            ) as cum_count \
                      from topic_trend as a \
                      left join topic_com as b on b.topic_id = a.topic_id \
                      where b.com_id = ' + req.params.id + ' and `record_date` >= date_sub(curdate(), interval 30 day) \
                      limit 30;'

    // 近30天公司最热关联话题 横向柱状图
    gettingHotTopic = 'select c.tag_name, \
                              count(1) as freq \
                       from ttd.topic_news as a \
                       left join ttd.com_news as b on a.news_id = b.news_id \
                       left join ttd.topic c on a.topic_id = c.topic_id \
                       where b.com_id = ' + req.params.id + ' and a.news_date >= date_sub(curdate(), interval 30 day) \
                       group by c.tag_name \
                       order by freq \
                       limit 5;'

    
    // 情绪咪表
    indexMeter = 'select record_date, \
                         neg, \
                         pos \
                  from ttd.com_score \
                  where com_id = ' + req.params.id + ' and (neg <> 0 or pos <> 0) \
                  order by record_date desc \
                  limit 1;'

    totalHotness = 'select Date_format(news_date, "%Y-%m-%d") as new_news_date, max(freq) as freq from (select date(a.news_date) as news_date, (select count(1) from ttd.topic_news as b where date(b.news_date) <= date(a.news_date) and b.topic_id = a.topic_id and b.news_date >= date_sub(a.news_date, interval 30 day) group by b.topic_id) as freq from ttd.topic_news as a left join ttd.topic_com as b on a.topic_id = b.topic_id where b.com_id = ' + req.params.id + ' and a.news_date >= date_sub(curdate(), interval 30 day) group by a.news_date, b.topic_id) as a group by news_date;'
    
    connection.query(gettingNews + gettingNewsSourceCount + gettingRegDeptCount + gettingComExpo + gettingHotTopic + indexMeter, [0, 1, 2, 3, 4, 5], function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            console.log(rst[0])
            console.log(rst[1])
            console.log(rst[2])
            console.log(rst[3])
            console.log(rst[4])
            console.log(rst[5])
            res.render('singleCom', {data: rst[0], news_source_count: rst[1], reg_dept_count: rst[2], com_expo: rst[3], hot_topic: rst[4], meter: rst[5]})
        }
    })
})

module.exports = router;