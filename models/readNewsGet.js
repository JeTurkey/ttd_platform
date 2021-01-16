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
    // 读取所有新闻
    currentPage = req.params.id
    readingNewsQuery = 'SELECT news_id, news_title, news_source, news_link, Date_format(news_date, \'%Y-%m-%d\') as new_news_date, gov_tag, com_tag FROM ttd.news ORDER BY news_id DESC LIMIT ' + 20 + ' OFFSET ' + ((currentPage - 1) * 20) + ';'
    pageCountQuery = 'SELECT count(news_id) as totalCount from ttd.news;'
    
    connection.query(readingNewsQuery + pageCountQuery, [1, 2], function(err, rst){
         if(err){
            console.log(err)
            return err
        }else{
            console.log(rst[1])
            res.render('readNews', {data: rst[0], pageCount: rst[1], pageNumber: currentPage})
        }
    })
})

module.exports = router;