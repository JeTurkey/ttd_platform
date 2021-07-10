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
    // 获取部门基础信息
    queryString = "select * from ttd.gov_dept where gov_dept_id = \"" + req.params.id + "\";"

    // 获取部门关注领域信息
    gov_topic = 'select c.gov_dept_id, \
                        b.topic_id, \
                        b.tag_name, \
                        b.tag_search_by \
                 from ttd.tms_relationship as a \
                 left join topic as b on a.B = b.topic_id \
                 left join gov_dept as c on a.A = c.gov_dept_id \
                 where a.A = "' + req.params.id + '" AND a.B like "%T%";'


    all_topics = "select topic_id, tag_name from ttd.topic;"
    all_person = "select * from ttd.person where person_belong_to_id = \"" + req.params.id + "\";"

    add_person = "select * from ttd.person where person_belong_to_id <> \"" + req.params.id + "\";"

    connection.query(queryString + gov_topic + all_topics + all_person + add_person, [1, 2, 3, 4, 5], function(err, rst){
        if (err){
            return err
        } else {

            res.render("TMS_department_mgmt", {data: rst[0], gt: rst[1], topics: rst[2], person: rst[3], addperson: rst[4]})
        }
    })

})



module.exports = router;