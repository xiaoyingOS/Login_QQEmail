const express = require('express');
const app = express();

//安装并导入JWT相关的两个包，分别是jsonwebtoken和express-jwt
///【【【需要安装5版本才能运行 npm i express-jwt@5】】】
const jwt = require('jsonwebtoken');
const expressJWT2 = require('express-jwt');

//允许跨域资源共享
const cors = require('cors');
app.use(cors());

//解析post表单数据的中间件
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//定义secret密钥，建议将密钥命名为secretKey
const secretKey = 'itXiaoying No1 ^_^';

//注册将JWT字符串解析还原成JSON对象的中间件
//注意：只要配置成功express-jwt这个中间件。就可以把解析出来的用户信息，挂载到req.user属性上
//.unless({path:'不需要访问权限的接口'})
app.use(expressJWT2({ secret: secretKey }).unless({ path: [/^\/api\//] }));

//登录接口
app.post('/api/login',(req,res)=>{
    //将req.body请求体中的数据，转为userinfo常量
    const userinfo = req.body
    //登录失败
    if(userinfo.username !== 'admin' || userinfo.password !== '000000'){
        return res.send({
            status: 400,
            msg: '登陆失败'
        });
    };

    //登录成功
    //登陆成功后，调用jwt.sign()方法生成JWT字符串，并通过token属性发送给客服端
    //参数1：用户的信息对象
    //参数2：加密的密钥
    //参数3：配置对象，可以配置当前 token 的有效期
    //注意：不要把密码加密到token字符串中
    const tokenStr = jwt.sign({username: userinfo.username},secretKey,{expiresIn: '30s'});
    
    res.send({
        status: 200,
        msg: '登录成功',
        token: tokenStr //要发送给客服端的token字符串
    });


    //这是一个有权限的接口
    app.get('/admin/getinfo',(req,res)=>{
        //使用req.user 获取用户信息，并使用data属性将用户信息发送给客服端
        console.log(req.user);
        res.send({
            status: 200,
            message: '获取用户信息成功',
            data: req.user //要发送给客服端的用户信息
        });
    });

});

//使用全局错误中间件，捕获解析JWT失败后产生的错误
app.use((err,req,res,next)=>{
    //这次错误是由token解析失败导致的
    if(err.name === 'UnauthorizedError'){
        return res.send({
            status: 401,
            message: '无效的token'
        });
    };
    res.send({
        status: 500,
        message: '未知错误'
    });
});

app.listen(8888,()=>{
    console.log("express server running at http://127.0.0.1:8888");
});