//导入模块
const express = require('express');
const path = require('path');
const app = express();

// 导入并配置 cors 中间件
const cors = require('cors');
app.use(cors());

// 配置解析表单数据的内置中间件
app.use(express.urlencoded({ extended: false }));

// 静态文件服务中间件，将静态文件放在 public 文件夹中
app.use(express.static(path.join(__dirname, 'public')));

// 自定义路由处理程序，用于处理 index.html 页面的所有请求
app.all('/', (req, res) => {
    // 这里可以处理所有类型的请求HTML页面，包括 GET、POST 等
    res.sendFile(path.join(__dirname, 'public', 'index.html'));//响应public/index.html页面
});

//导入并使用 123云盘文件生成直链 的路由
const userRouter = require('./router/use_link');
app.use('/api', userRouter);//默认访问 增加一个/api  原来的/add 访问就变成了/api/add


// 启动 Express 服务器，监听端口
const port = 80;
app.listen(port, () => {
    console.log(`Express server is running on port http://127.0.0.1:${port}`);
});
