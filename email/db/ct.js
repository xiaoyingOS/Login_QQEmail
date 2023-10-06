const mysql = require('mysql');
const localtunnel = require('localtunnel');
const { spawn } = require('child_process');

// 启动 Localtunnel 代理 SSH 服务
(async () => {
  const tunnel = await localtunnel({ port: 22, subdomain: 'my-ssh-tunnel' });
  console.log('Localtunnel URL:', tunnel.url);

  // 使用 SSH 隧道连接 MySQL 数据库
  const ssh = spawn('ssh', [
    '-N', // 不打开 shell
    '-L', `${tunnel.url.split(':')[1]}:localhost:3306`, // 将公共 URL 的端口映射到本地端口 3306
    '-i', '/path/to/ssh/key', // SSH 密钥文件路径
    'user@ssh-server' // SSH 服务器用户名和地址
  ]);

  ssh.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ssh.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ssh.on('close', (code) => {
    console.log(`SSH process exited with code ${code}`);
  });

  const connection = mysql.createConnection({
    host: 'localhost',
    port: tunnel.url.split(':')[1], // 使用 Localtunnel 映射的端口
    user: 'root',
    password: 'xiaoying',
    database: 'web_db'
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
  });

})();
