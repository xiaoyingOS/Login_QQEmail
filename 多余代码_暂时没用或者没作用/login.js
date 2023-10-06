const axios = require('axios');

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQ4NDgwMDczMzQsImlhdCI6MTY5NDQwNzMzNCwiaWQiOjE4MTMzNTYwMzcsIm1haWwiOiIiLCJuaWNrbmFtZSI6InhpYW95aW5nT1MiLCJ1c2VybmFtZSI6MTg5ODQ4NzM3MzIsInYiOjB9.KMIVrcCdX0Frou6zZQ4XtPHi-xpCR9cSy66tb6BcaQA'; // 将YOUR_AUTH_TOKEN替换为实际的身份验证令牌

const apiUrl = 'https://www.123pan.com/a/api/user/sign_in';

// 定义登录数据
const loginData = {
  passport: '1***', // 您的手机号码
  password: '123456789jqk',   // 您的密码
  remember: true           // 是否记住登录状态
};

async function loginWithToken() {
  try {
    const response = await axios.post(apiUrl, loginData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      // 登录成功
      console.log('登录成功');
      console.log('响应数据：', response.data);
    } else {
      console.error('登录失败，状态码：', response.status);
    }
  } catch (error) {
    // 处理错误
    if (error.response) {
      console.error('请求失败，状态码：', error.response.status);
    } else if (error.request) {
      console.error('无法获取响应');
    } else {
      console.error('发生错误：', error.message);
    }
  }
}

loginWithToken();
