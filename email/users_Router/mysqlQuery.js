const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const app = express();
//配置解析表单数据的中间件
app.use(express.urlencoded({extended: false}));

//一定要在路由之前配置 cors 中间件
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//挂载对应的路由
router.post('/post',(req,res)=>{
    //通过 req.query 获取客服端、通过查询字符串，发送到服务器的数据
    // console.log(req.body);

//数据库
    const mysql = require('mysql');
//建立与MySQL数据库的连接
const db = mysql.createPool({
    host: '127.0.0.1', //数据库的 IP地址
    user: 'root', //登录数据库的账号
    password: 'xiaoying', //登录数据库的密码
    database: 'web_db' //指定要操作哪个数据库
});

// //测试 mysql模块是否能正常工作
// db.query('select 1',(err,results)=>{
//     if(err) return console.log(err.message);
//     console.log(results);
// });

//console.log(req.data);
// 查询 users中的所有数据
//SELECT * FROM users WHERE username = 'username';
const email = req.body.email;
const password = req.body.password;
if (!email) {//判断邮箱是否为空
    res.json({ success: false, message: "请输入邮箱地址！" });
    return;
  }

  //判断邮箱是否合法
  // 创建一个正则表达式
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(email)) {
    console.log("email: " + email + " 是一个合法的电子邮件地址");
  } else {
    console.log("email: " + email + " 不是一个合法的电子邮件地址");
    res.json({ success: false, message: "请输入正确的邮箱地址！" });
    return;
    }

let results;
// const sqlStr = 'select * from users';
const sqlStr = 'SELECT * FROM users WHERE email = ?';//查出users表中某个用户，?表示占位符
db.query(sqlStr, email,(err,results)=>{
    if(err) return console.log(err.message);
    //执行的是select查询语句，则执行的结果是数组
    //console.log(results);
    res.send({data: results});
///////////////////////////////////////后面优化///////////////////////////////////////////
    
});



});

//暴露
module.exports = router;
