const express = require('express');
const router = express.Router();

//导入需要的处理函数模块
const Link = require('./link/link');

//发布文章的路由，post访问
router.post('/addLink',Link.addLink);//访问 /addLink路由 就会调用函数

//共享出去, 暴露路由
module.exports = router;