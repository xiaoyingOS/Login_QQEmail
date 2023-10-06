const http = require('http');
const fs = require('fs');
const path = require('path');

//导入express模块
const express = require('express');
//创建服务器实例对象
const app = express();

//导入并配置cors中间件
const cors = require('cors');
app.use(cors());

////
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//配置解析表单数据的内置中间件，注意：这个中间件只能解析
// application/x-www-form-urlencoded 格式的表单数据。
app.use(express.urlencoded({extended: false}));

////
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

/////
//导入路由模块
const router1 = require('./email/users_Router/mysqlQuery');
//把路由模块，注册到app上
app.use('/api',router1);

//导入路由模块
const router2 = require('./email/emailRouter/emailRouter');
//把路由模块，注册到app上
app.use('/api',router2);

//导入路由模块
const router3 = require('./email/urlRouter/urlRouter');
//把路由模块，注册到app上
app.use('/api',router3);


// 静态文件服务中间件，将静态文件放在 public 文件夹中
app.use(express.static(path.join(__dirname, 'public')));

// 自定义路由处理程序，用于处理 index.html 页面的所有请求
app.all('/', (req, res) => {
    // 这里可以处理所有类型的请求HTML页面，包括 GET、POST 等
    res.sendFile(path.join(__dirname, 'public', 'login.html'));//响应public/index.html页面,后面改为了login
});


//导入并使用 123云盘文件生成直链 的路由
const userRouter = require('./router/use_link');
app.use('/api', userRouter);//默认访问 增加一个/api  原来的/add 访问就变成了/api/add

//模拟用户联系管理员，也可以向Ai发送请求，用Ai处理
app.all('/api/administrator', (req, res)=>{
    //打印提问 问题
    console.log(req.body.Question);
    const data = {
        message: "我们已经收到你的消息，处理完成后 会第一时间和您联系，感谢您的反馈！！！",
        status: 200
    }
    res.send(data);
    //用Axios向Ai发送请求
    //ToDo...
});

// 启动 Express 服务器，监听端口
const port = 80;
app.listen(port, () => {
    console.log(`Express server is running on port http://127.0.0.1:${port}`);
});
