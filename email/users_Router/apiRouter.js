//挂载路由模块
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

const http = require('http');
const fs = require('fs');
const path = require('path');

//配置解析表单数据的中间件
app.use(express.urlencoded({extended: false}));

//一定要在路由之前配置 cors 中间件
const cors = require('cors');
app.use(cors());

//const app = express();

//

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//一定要在路由之前，挂载 res.cc函数
app.use((req,res,next)=>{
    //status默认值为1，表示失败的情况
    //err的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = (err,status = 1)=>{
        res.json({
            status,
            message: err instanceof Error ? err.message : err
        });
    };
    next();
});

//导入路由模块
const router1 = require('./mysqlQuery');
//把路由模块，注册到app上
app.use('/api',router1);

//导入路由模块
const router2 = require('../emailRouter/emailRouter');
//把路由模块，注册到app上
app.use('/api',router2);

//导入路由模块
const router3 = require('../urlRouter/urlRouter');
//把路由模块，注册到app上
app.use('/api',router3);

//---------------------

app.get('/', (req, res) => {
  // 读取HTML文件
  fs.readFile('index.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
      return;
    }
    // 将文件作为HTML响应发送
    res.send(data);
  });
});


// //----------------

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