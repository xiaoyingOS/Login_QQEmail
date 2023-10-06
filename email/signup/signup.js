//用户插入数据库，密码加密
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

//
//导入bcryptjs这个包
const bcrypt = require('bcryptjs');

//导入生成 Token的包
const jwt = require('jsonwebtoken');

//导入全局的配置文件
const config = require('./config');

//挂载对应的路由
router.post('/signUp',(req,res)=>{
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


const email = req.body.email;
const password = req.body.password;
const yzm = req.body.yzm;

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

    // let results;
    // // const sqlStr = 'select * from users';
    // const sqlStr = 'SELECT * FROM users WHERE email = ?';//查出users表中某个用户，?表示占位符
    // db.query(sqlStr, email,(err,results)=>{
    //     if(err) return console.log(err.message);
    //     //执行的是select查询语句，则执行的结果是数组
    //     //console.log(results);
    //     res.send({data: results});
    ///////////////////////////////////////后面优化///////////////////////////////////////////
    

//判断验证码是否和服务端保持一致
if(yzm != 0 ){
    res.json({ success: false, message: "验证码错误！" });
    return;
}

//
const userinfo = req.body;
    //对表单中的数据，进行合法性校验
    // if(!userinfo.email || !userinfo.password){
    //     // return res.send({status: 1, message: '用户名或密码不合法'});
    //     return res.cc('用户名或密码不合法');
    // };
    //用更高级的验证方式，不再用if...else了

    //定义SQL语句，查询用户名是否被占用
    const sqlStr = 'select * from users where email=?';
    db.query(sqlStr,userinfo.email,(err,results)=>{
        // if(err) return res.send({status: 1, message: err.message});
        if(err) return res.cc(err);
        if(results.length > 0){
            // return res.send({status: 1,message: });
            return res.cc('用户名已被占用，请换一个用户名')
        }

        //TODO：用户名可以使用
        //调用bcrypt.hanshSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password,13);

        //定义插入新用户的 SQL语句
        const sqlStr2 = 'insert into users set ?';
        //调用 db.quer() 执行SQL语句
        db.query(sqlStr2,{email: userinfo.email, password: userinfo.password},(err,results)=>{
            //判断SQL语句是否执行成功
            // if(err) return res.send({status: 1, message: err.message});
            if(err) return res.cc(err);
            //判断影响行数是否为1
            if(results.affectedRows !== 1){
                // res.send({status: 1, message: '注册用户失败，请稍后再试！'});
                res.cc('注册用户失败，请稍后再试！')
            };
            //注册用户成功
            // res.send({status: 0, message: '注册成功！'});
            res.cc('注册成功！',0);
        })
        
    });

    

});

//暴露
module.exports = router;