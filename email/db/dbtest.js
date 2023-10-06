//数据库
const mysql = require('mysql');

const express = require('express');

const fs = require('fs');
const app = express();

//配置解析表单数据的中间件
app.use(express.urlencoded({extended: false}));

//配置解析表单数据的中间件
app.use(express.urlencoded({extended: false}));

//一定要在路由之前配置 cors 中间件
const cors = require('cors');
app.use(cors());


//建立与MySQL数据库的连接
const db = mysql.createPool({
    host: '127.0.0.1', //数据库的 IP地址
    user: 'root', //登录数据库的账号
    password: 'xiaoying', //登录数据库的密码
    database: 'web_db' //指定要操作哪个数据库
  });
  
  //补充。必须在配置cors中间件之前，配置JSONP接口
app.get('/in',(req,res)=>{
    res.send("hello");
    //测试 mysql模块是否能正常工作
  //语句select 1 没有任何实质性的作用，只是用来检查mysql模块正常工作
  db.query('select 1',(err,results)=>{
    //mysql模块工作期间报错了
    if(err) return console.log(err.message);
    //能够成功执行的SQL语句
    console.log(results);
});
});


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
  

app.listen(80,()=>{
    console.log("express server running at http://127.0.0.1");
});