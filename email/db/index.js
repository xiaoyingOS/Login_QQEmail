const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'xiaoying',
    database: 'web_db'
});


module.exports = db;