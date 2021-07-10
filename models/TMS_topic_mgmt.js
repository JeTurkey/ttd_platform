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
    // 获取主题基础信息
    gettingTopicInfo = 'SELECT * \
                        FROM ttd.topic as a \
                        WHERE topic_id = "' + req.params.id + '";'
    // 主题关键词信息
    gettingTopicTags = 'SELECT * \
                        FROM ttd.topic as a \
                        LEFT JOIN ttd.tags as b on a.topic_id = b.belong_to_cat_id \
                        WHERE topic_id = "' + req.params.id + '";'

    // 获取相关监管部门信息
    gettingTopicReg = 'SELECT * \
                       FROM ttd.topic as a \
                       LEFT JOIN ttd.tms_relationship as b on a.topic_id = b.A \
                       LEFT JOIN ttd.gov_dept as c on b.B = c.gov_dept_id \
                       LEFT JOIN ttd.person as d on c.gov_dept_id = d.person_belong_to_id \
                       WHERE a.topic_id = "' + req.params.id + '";'
    
    // 获取所有监管机构用于添加新监管机构
    gettingNewReg = 'SELECT * \
                     FROM ttd.gov_dept;'

    // 获取相关公司信息
    gettingTopicCom = 'SELECT * \
                       FROM ttd.topic as a \
                       LEFT JOIN ttd.tms_relationship as b  on a.topic_id = b.A \
                       LEFT JOIN ttd.company as c on b.B = c.com_id \
                       WHERE a.topic_id = "' + req.params.id + '";'

    // 获取当前系统认为最热公司

    // 获取当前系统认为相关部门信息


    connection.query(gettingTopicInfo + gettingTopicTags + gettingTopicReg + gettingTopicCom + gettingNewReg, [0, 1, 2, 3, 4], function(err, rst){
        if (err){
            return err
        } else {

            res.render("TMS_topic_mgmt", {topicInfo: rst[0], topicTags: rst[1], topicReg: rst[2], topicCom: rst[3], newReg: rst[4]})
        }
    })

})



module.exports = router;