const express = require('express');
const router = express.Router();
//一定要在路由之前配置 cors 中间件
const app = express();
const cors = require('cors');
app.use(cors());

//挂载对应的路由
router.get('/get',(req,res)=>{
    //通过 req.query 获取客服端、通过查询字符串，发送到服务器的数据
    const query = req.query;

//数据库
    const mysql = require('mysql');
//建立与MySQL数据库的连接
const db = mysql.createPool({
    host: '127.0.0.1', //数据库的 IP地址
    user: 'root', //登录数据库的账号
    password: 'xiaoying', //登录数据库的密码
    database: 'my_db_01' //指定要操作哪个数据库
});

// //测试 mysql模块是否能正常工作
// db.query('select 1',(err,results)=>{
//     if(err) return console.log(err.message);
//     console.log(results);
// });


// 查询 users中的所有数据
//SELECT * FROM users WHERE username = 'username';

let results;
const sqlStr = 'select * from users';
db.query(sqlStr,(err,results)=>{
    if(err) return console.log(err.message);
    //执行的是select查询语句，则执行的结果是数组
    console.log(results);
    res.send({data: results});
});


    //调用 res.send() 方法，向客服端响应处理结果
    // res.send({
    
    //     // status: 0, //0表示处理成功，1表示处理失败
    //     // msg: 'GET 请求成功！', //状态的描述
    //     // data: query //需要响应给客服端的数据
    //     // // 查询 users中的所有数据
    // });

});

//暴露
module.exports = router;
