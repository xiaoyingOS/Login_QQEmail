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


//生成123云盘文件 有效期直链 函数
exports.addLink = (req, res) => {

    const ProvidedURL = req.body.providedURL; // 待签名URL
    const crypto = require('crypto-js');
    function SignURL(originURL, privateKey, uid, validDuration) {
        const ts = Math.floor((Date.now() + validDuration) / 1000); // 有效时间戳，单位：秒
        const rInt = Math.floor(Math.random() * 1000000); // 随机正整数，这里生成一个最大值为1000000的随机整数
        const objURL = new URL(originURL);
        const authKey = `${ts}-${rInt}-${uid}-${crypto
            .MD5(`${decodeURIComponent(objURL.pathname)}-${ts}-${rInt}-${uid}-${privateKey}`)
            .toString()}`;
        objURL.searchParams.append('auth_key', authKey);
        // console.log(objURL);
        return objURL.toString();
    }


    function testSign() {
        //https://vip.123pan.cn/uid/网盘路径/文件名.后缀
        //暂时还没找到智能获取文件路径的办法，除非管理员一个一个添加？或者前端添加，还没办法登录到123云盘里去获取
        const originURL = ProvidedURL; // 待签名URL
        const privateKey = 'yyds'; // 鉴权密钥
        const uid = 1813356033; // 账号id
        const validDuration = 13 * 1000; // 链接签名有效期，单位：毫秒【13秒】

        try {
        const newURL = SignURL(originURL, privateKey, uid, validDuration);
        const link_timeStr = `生成直链成功！有效期${validDuration / 1000}s`
        console.log(link_timeStr + " 请尽快使用！！！\n链接为: " + newURL);

        const data = {
            message: link_timeStr,
            status: 200,
            newURL: newURL
        }

        //发送生成的直链对象
        res.send(data);

        } catch (error) {
        console.error(error); // 记录错误信息到控制台
        // res.status(500).send('生成签名链接失败'); // 发送错误响应
        res.send({status: 500 ,message:'生成签名链接失败\n可能是输入链接不合法，链接格式：https://vip.123pan.cn/1813356033/Backups/FL%20Studio/win_21_1_0.exe   '}); // 发送错误响应
        
        }
    }

    //调用函数
    testSign();

};

