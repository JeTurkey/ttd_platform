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
    //  获取部门相关新闻
    gettingNews = 'select a.news_id, \
                          b.news_title, \
                          Date_format(b.news_date, \'%Y-%m-%d\') as new_news_date, \
                          b.news_link, \
                          c.gov_dept_name \
                   from ttd.gov_news as a \
                   left join ttd.news as b on a.news_id = b.news_id \
                   left join ttd.gov_dept as c on a.gov_dept_id = c.gov_dept_id \
                   where a.gov_dept_id = "' + req.params.id + '" \
                   order by a.news_id DESC \
                   limit 5;'

    // 获取情绪图像
    gettingSentiIndex = 'select record_date, \
                         pos, \
                         neg \
                  from ttd.gov_score \
                  where gov_dept_id = "' + req.params.id + '" \
                  order by record_date desc \
                  limit 30;'

    // 部门关注主题
    // gettingFocusTopic = 'select c.tag_name, \
    //                             count(1) as freq \
    //                      from ttd.topic_news as a \
    //                      left join ttd.gov_news as b on a.news_id = b.news_id \
    //                      left join ttd.topic c on a.topic_id = c.topic_id \
    //                      where b.gov_dept_id = "' + req.params.id + '" and a.news_date >= date_sub(curdate(), interval 30 day) \
    //                      group by c.tag_name \
    //                      order by freq DESC \
    //                      limit 5;'
    gettingFocusTopic = 'SELECT d.tag_name, \
                                count(1) as freq \
                         FROM ttd.gov_news as a \
                         LEFT JOIN ttd.tms_relationship as b on a.gov_dept_id = b.A \
                         LEFT JOIN ttd.topic_news as c on b.B = c.topic_id \
                         LEFT JOIN ttd.topic d on c.topic_id = d.topic_id \
                         WHERE a.gov_dept_id = "' + req.params.id + '" and a.news_date >= date_sub(curdate(), interval 30 day) AND b.B like "%T%"\
                         GROUP BY d.tag_name \
                         ORDER BY freq DESC \
                         LIMIT 5;'

    personList = 'select person_id, person_name from ttd.person where person_belong_to_id = ' + req.params.id + ';'


    connection.query(gettingNews + gettingSentiIndex + gettingFocusTopic, [1, 2, 3], function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            console.log(rst[2])
            res.render('singleGovDept', {data: rst[0], indexgraph: rst[1], focustopic: rst[2]})
        }
    })
})

module.exports = router;