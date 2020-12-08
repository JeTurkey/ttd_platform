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
    queryString = 'SELECT COUNT(*) as count, Date_format(news_date, \'%y-%m-%d\') as news_date from ttd.news group by news_date LIMIT 30;'
    queryString2 = "SELECT DISTINCT news_title, news_link, gov_dept_name, Date_format(news_date, \'%y-%m-%d\') as news_date FROM ttd.gov_dept gd JOIN ttd.gov_news gn ON gn.gov_dept_id = gd.gov_dept_id JOIN ttd.news n ON n.news_id = gn.news_id WHERE gn.gov_dept_id = 1 ORDER BY n.news_id DESC LIMIT 7;"
    queryString3 = 'select g.gov_dept_name, Date_format(nw.news_date, \'%y-%m-%d\') as news_date, count(*) as news_count From ttd.gov_dept g, ttd.gov_news n, ttd.news nw Where g.gov_dept_id = 5 and nw.news_id = n.news_id Group by g.gov_dept_name, news_date Order by nw.news_date desc;'
    queryString4 = 'select g.gov_dept_name, Date_format(nw.news_date, \'%y-%m-%d\') as news_date, count(*) as news_count From ttd.gov_dept g, ttd.gov_news n, ttd.news nw Where g.gov_dept_id = 1 and nw.news_id = n.news_id Group by g.gov_dept_name, news_date Order by nw.news_date desc;'
    connection.query(queryString + queryString2 + queryString3 + queryString4, [1, 2, 3, 4], function(err, rst){
        if (err){
            console.log(err)
            return err
        } else {
            
            res.render('index', {data: rst[0], data2: rst[1], data3: rst[2], data4: rst[3]})
        }
    })

    
})

module.exports = router;
