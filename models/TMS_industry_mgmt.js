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

    gettingIndTitle = 'SELECT * \
                       FROM ttd.t_ods_gics_industry \
                       WHERE idst_sub_id = "' + req.params.id + '";'

    // 获取行业所关联的监管机构
    gettingIndGov = 'SELECT * \
                     FROM ttd.t_ods_gics_industry as a \
                     LEFT JOIN tms_relationship as b on a.idst_sub_id = b.A \
                     LEFT JOIN gov_dept as c on b.B = c.gov_dept_id \
                     LEFT JOIN person as d on c.gov_dept_id = d.person_belong_to_id and d.if_vip = 1 \
                     WHERE b.B like "%G%" and idst_sub_id = "' + req.params.id + '";'

    // 获取监管机构名单，用于添加新的关联监管机构
    gettingNewGov = 'SELECT * \
                     FROM ttd.gov_dept;'


    connection.query(gettingIndTitle + gettingIndGov + gettingNewGov, [0, 1, 2], function(err, rst){
        if (err){
            return err
        } else {

            res.render("TMS_industry_mgmt", {indTitle: rst[0], govList: rst[1], newGovList: rst[2]})
        }
    })

})



module.exports = router;