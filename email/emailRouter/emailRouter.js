const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const app = express();
//用户插入数据库，密码加密
//导入bcryptjs这个包
const bcrypt = require('bcryptjs');

//导入生成 Token的包
const jwt = require('jsonwebtoken');

//导入全局的配置文件
const config = require('../users_Router/config');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//配置解析表单数据的中间件
app.use(express.urlencoded({extended: false}));

//一定要在路由之前配置 cors 中间件
const cors = require('cors');
app.use(cors());


//当前时间
const options = { dateStyle: 'long', timeStyle: 'medium' };
const now0 = new Date().toLocaleString('zh-CN', options);
// const yzmCode = Math.floor(Math.random() * 900000 + 100000);
///let yzmCode;
let yzmCode = 0;

/////////////////////////
// 在服务器端保存验证码与用户的关联，包括验证码和过期时间
const userVerifications = {};

// 生成验证码并将其与用户关联
function generateAndAssociateVerificationCode(email) {
  const code = Math.floor(Math.random() * 900000 + 100000);
  const expirationTime = Date.now() + 3 * 60 * 1000; // 3分钟后过期
  userVerifications[email] = { code, expirationTime };
  return code;
}

// 验证验证码是否匹配且未过期
function verifyVerificationCode(email, code) {
  const storedCodeAndExpiration = userVerifications[email];
  if (storedCodeAndExpiration && storedCodeAndExpiration.code === code && storedCodeAndExpiration.expirationTime >= Date.now()) {
    return true; // 验证码有效
  }
  return false; // 验证码无效或已过期
}

////////////////////////
//数据库
const mysql = require('mysql');
//建立与MySQL数据库的连接
const db1 = mysql.createPool({
  host: '127.0.0.1', //数据库的 IP地址
  user: 'root', //登录数据库的账号
  password: 'xiaoying', //登录数据库的密码
  database: 'web_db' //指定要操作哪个数据库
});

// 发送验证码
router.all('/sendCode', (req, res) => {
  //设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  
  const email = req.body.email;

  if (!email) {
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

    



  //对表单中的数据，进行合法性校验
  // if(!userinfo.email || !userinfo.password){
  //     // return res.send({status: 1, message: '用户名或密码不合法'});
  //     return res.cc('用户名或密码不合法');
  // };
  //用更高级的验证方式，不再用if...else了

  //定义SQL语句，查询用户名是否被占用
  let flag = 0;
  const sqlStr5 = 'select * from users where email=?';
  db1.query(sqlStr5,email,(err,results)=>{
      // if(err) return res.send({status: 1, message: err.message});
      if(err) return res.cc(err);

      if(results.length > 0){
        
        flag = results.length;
          // return res.send({status: 1,message: });
          return res.cc('邮箱已经注册过了')
      }
  });

  if(flag != 0){
    flag = 0;
    
    return;
  }


  //yzmCode = Math.floor(Math.random() * 900000 + 100000);

  // 生成验证码并将其与用户关联
  yzmCode = generateAndAssociateVerificationCode(email);

////*** */

////*** */

  // 发送验证码到邮箱
  const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,//不要修改smtp端口号
    secure: false,
    auth: {
      user: '3635526659@qq.com',
      pass: 'yanjwidbkvkyciej'
    }
  });
  //const code = Math.floor(Math.random() * 900000 + 100000);//定义为全局的呢
  const mailOptions = {
    from: '3635526659@qq.com',
    to: email,
    subject: '注册验证码',
    //text: `您的验证码是：${code}，请勿将验证码透露给他人。`,
    html: '<p>您好，欢迎注册,您的验证码是：'+ yzmCode +',此验证码将在 3分钟内 有效</p>'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.error('Error:', error);
      res.json({ success: false, message: "验证码发送失败，请稍后再试！" });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ success: true });
    }
  });
});



//////////////////////////////
//注册路由
router.all('/signUp',(req,res)=>{

  //设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  //通过 req.query 获取客服端、通过查询字符串，发送到服务器的数据
  // console.log(req.body);

// //数据库
//   const mysql = require('mysql');
// //建立与MySQL数据库的连接
// const db = mysql.createPool({
//   host: '127.0.0.1', //数据库的 IP地址
//   user: 'root', //登录数据库的账号
//   password: 'xiaoying', //登录数据库的密码
//   database: 'web_db' //指定要操作哪个数据库
// });


const email = req.body.email;
const password = req.body.password;
const yzm = req.body.yzm;

if (!email) {//判断邮箱是否为空
  res.json({ success: false, message: "请输入邮箱地址！" });
  return;
}

//*** */
// 验证验证码是否匹配且未过期
if (!verifyVerificationCode(email, yzmCode)) {
  res.json({ success: false, message: '验证码错误或已过期' });
  return;
}
//*** */

//判断邮箱是否合法
// 创建一个正则表达式
let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (emailPattern.test(email)) {
  //console.log("email: " + email + " 是一个合法的电子邮件地址");
} else {
  console.log("email: " + email + " 不是一个合法的电子邮件地址");
  res.json({ success: false, message: "请输入正确的邮箱地址！" });
  return;
  }

  //判断密码是否合法
  const regexPassword2 = /^[^\u4e00-\u9fa5]+$/;
  if (regexPassword2.test(password)) {

  } else {
    res.json({ success: false, message: "请输入正确密码格式！" });
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
if(yzm != yzmCode ){
  //res.json({ success: false, message: "验证码错误！" });
  res.json({ success: false, message: yzm + " " + yzmCode});
  return;
}

const userinfo = req.body;
  //对表单中的数据，进行合法性校验
  // if(!userinfo.email || !userinfo.password){
  //     // return res.send({status: 1, message: '用户名或密码不合法'});
  //     return res.cc('用户名或密码不合法');
  // };
  //用更高级的验证方式，不再用if...else了

  //定义SQL语句，查询用户名是否被占用
  const sqlStr = 'select * from users where email=?';
  db1.query(sqlStr,userinfo.email,(err,results)=>{
      // if(err) return res.send({status: 1, message: err.message});
      if(err) return res.cc(err);
      if(results.length > 0){
          // return res.send({status: 1,message: });
          return res.cc('邮箱已经注册过了')
      }

      //TODO：用户名可以使用
      //调用bcrypt.hanshSync() 对密码进行加密
      userinfo.password = bcrypt.hashSync(userinfo.password,13);
      console.log(userinfo.password);

      //定义插入新用户的 SQL语句
      const sqlStr2 = 'insert into users set ?';
      //调用 db.quer() 执行SQL语句
      db1.query(sqlStr2,{email: userinfo.email, password: userinfo.password, vip_date: now0},(err,results)=>{
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

    // 清除已使用的验证码
    delete userVerifications[email];

});


//登录接口
//登录的处理函数
router.all('/login',(req,res)=>{
  //设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  //接收表单的数据
  const userinfo = req.body;
  console.log(userinfo.email);
  console.log(userinfo.password);

  //数据库
  const mysql = require('mysql');
//建立与MySQL数据库的连接
const db = mysql.createPool({
  host: '127.0.0.1', //数据库的 IP地址
  user: 'root', //登录数据库的账号
  password: 'xiaoying', //登录数据库的密码
  database: 'web_db' //指定要操作哪个数据库
});


  //定义SQL语句
  const sql = `select * from users where email=?`;
  //执行sql语句，根据用户名查询用户信息
  db.query(sql, userinfo.email, (err,results)=>{
      //执行sql语句失败
      if(err) return res.cc(err);
      //判断没有用户，则返回stauts为3
      if(results.length == 0) return res.send({
        status: 3,
        message: '跳到注册'
    });
      //执行sql语句成功，但是获取到的数据条数不等于1
      if(results.length !== 1) return res.cc('登录失败');
      
  
      //TODO: 判断密码是否正确
      const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
      if(!compareResult) return res.send({
        status: 2,
        message: '密码错误，登录失败'
    });

      //TODO: 在服务器生成Token的字符串
      // res.send('login OK');
      const user = {...results[0], password: '', user_pic: ''};
      // console.log(user);
      //对用户信息进行加密，生成 Token字符串
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn});
      // console.log(tokenStr);
      //调用res.send() 将Token响应给客服端
      res.send({
          status: 0,
          message: '登录成功',
          token: 'Bearer ' + tokenStr //Bearer后面的空格必须写
      });
  });
});




//暴露
module.exports = router;