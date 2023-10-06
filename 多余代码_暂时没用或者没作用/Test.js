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

// 注册路由
app.post('/signup', (req, res) => {
  const { email, password, code } = req.body;

  // 生成验证码并将其与用户关联
  const generatedCode = generateAndAssociateVerificationCode(email);

  // 验证验证码是否匹配且未过期
  if (!verifyVerificationCode(email, code)) {
    return res.json({ success: false, message: '验证码错误或已过期' });
  }

  // 执行用户注册逻辑，包括将用户的电子邮件、密码和验证码存储在数据库中等操作
  // ...

  // 清除已使用的验证码
  delete userVerifications[email];

  // 返回注册成功的响应
  res.json({ success: true, message: '注册成功' });
});
