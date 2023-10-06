const express = require('express');
const app = express();

//配置解析表单数据的中间件
app.use(express.urlencoded({extended: false}));

//一定要在路由之前配置 cors 中间件
const cors = require('cors');
app.use(cors());

//导入路由模块
const router1 = require('./06.2.1_apiRouter');
//把路由模块，注册到app上
app.use('/api',router1);

//导入路由模块
const router2 = require('./06.1.1_apiRouter');
//把路由模块，注册到app上
app.use('/api',router2);

app.listen(80,()=>{
    console.log("express server running at http://127.0.0.1");
});

//const mysql = require('mysql');

// //建立与MySQL数据库的连接
// const db = mysql.createPool({
//     host: '127.0.0.1', //数据库的 IP地址
//     user: 'root', //登录数据库的账号
//     password: 'xiaoying', //登录数据库的密码
//     database: 'my_db_01' //指定要操作哪个数据库
// });

// //测试 mysql模块是否能正常工作
// db.query('select 1',(err,results)=>{
//     if(err) return console.log(err.message);
//     console.log(results);
// });

// // 查询 users中的所有数据
// const sqlStr = 'select * from users';
// db.query(sqlStr,(err,results)=>{
//     if(err) return console.log(err.message);
//     //执行的是select查询语句，则执行的结果是数组
//     console.log(results);
// });