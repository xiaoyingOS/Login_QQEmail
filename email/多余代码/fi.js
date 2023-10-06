const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 设置EJS作为模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'myFile.txt');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.send('Error reading file!');
        } else {
            const content = data.toString();
            // 渲染index.ejs模板，并将文件内容传递给模板
            res.render('index', { content });
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
