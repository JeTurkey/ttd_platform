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
    
    queryString = 'select news_link, news_title, gov_dept_name, Date_format(n.news_date, \'%Y-%m-%d\') as news_date from gov_dept d join gov_news gn on gn.gov_dept_id = d.gov_dept_id join news n on n.news_id = gn.news_id where gn.gov_dept_id = ' + req.params.id + ' ORDER BY gn.news_id DESC LIMIT 5;'
    indexGraph = 'select record_date, pos, neg from ttd.gov_score where gov_dept_id = ' + req.params.id + ' order by record_date desc limit 30;'
    focusTopic = 'select d.tag_name, count(1) as freq from ttd.news as a left join ttd.topic_news as b on a.news_id = b.news_id left join ttd.topic_gov as c on b.topic_id = c.topic_id left join ttd.topic as d on d.topic_id = b.topic_id where c.gov_dept_id = ' + req.params.id + ' and b.news_date >= date_sub(curdate(), interval 30 day) group by b.topic_id;'

    connection.query(queryString + indexGraph + focusTopic, [1, 2, 3], function(err, rst){
        if(err){
            console.log(err)
            return err
        }else{
            res.render('singleGovDept', {data: rst[0], indexgraph: rst[1], focustopic: rst[2]})
        }
    })
})

module.exports = router;