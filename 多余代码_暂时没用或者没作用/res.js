const axios = require('axios');

// const apiUrl = 'https://www.123pan.com/a/api/user/info';
const apiUrl = 'https://www.123pan.com/a/api/user/info?3410282197=1694407390-4818944-3274068010';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQ4NDgwMDg2OTQsImlhdCI6MTY5NDQwODY5NCwiaWQiOjE4MTMzNTYwMzcsIm1haWwiOiIiLCJuaWNrbmFtZSI6InhpYW95aW5nT1MiLCJ1c2VybmFtZSI6MTg5ODQ4NzM3MzIsInYiOjB9.LHtk_sZw5N9oCYU70x6xgTTTjpe1iMCn5r2fU28YVCo'; // 请将YOUR_TOKEN_HERE替换为您提供的令牌

async function getUserInfo() {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      // 请求成功，处理响应数据
      console.log('获取用户信息成功');
      console.log('用户信息：', response.data);
    } else {
      console.error('获取用户信息失败，状态码：', response.status);
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

getUserInfo();
