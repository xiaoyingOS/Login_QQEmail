//如果没有这个用户，自动注册
if(!results.length){

    //发送验证码

    // 发送验证码到邮箱
    const transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 587,//不要修改smtp端口号
        secure: false,
        auth: {
        user: '366651926@qq.com',
        pass: 'bbnwwojyxwjrbhhd'
        }
    });
    const code = Math.floor(Math.random() * 900000 + 100000);
    const mailOptions = {
        from: '366651926@qq.com',
        to: email,
        subject: '注册验证码',
        //text: `您的验证码是：${code}，请勿将验证码透露给他人。`,
        html: '<p>您好，欢迎注册,您的验证码是：'+ code +',此验证码将在 3分钟内 有效</p>'
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

//判断发回验证码是否相同



    //插入数据库
    //获取客服端提交到服务器的用户信息
    
    //对表单中的数据，进行合法性校验
    // if(!userinfo.username || !userinfo.password){
    //     // return res.send({status: 1, message: '用户名或密码不合法'});
    //     return res.cc('用户名或密码不合法');
    // };
    //用更高级的验证方式，不再用if...else了

    //定义SQL语句，查询用户名是否被占用
    const sqlStr2 = 'select * from users where email=?';
    db.query(sqlStr2,email,(err,results)=>{
        // if(err) return res.send({status: 1, message: err.message});
        if(err) return res.cc(err);
        if(results.length > 0){
            // return res.send({status: 1,message: });
            return res.cc('邮箱已被占用，请换一个')
        }

        //TODO：用户名可以使用
        //调用bcrypt.hanshSync() 对密码进行加密
        password = bcrypt.hashSync(password,13);

        //定义插入新用户的 SQL语句
        const sqlStr3 = 'insert into users set ?';
        //调用 db.quer() 执行SQL语句
        db.query(sqlStr3,{email: email, password: password},(err,results)=>{
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






    //返回注册成功后的的页面






   }