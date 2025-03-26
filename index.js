const express = require('express')
const path = require('path');
require('dotenv').config();
//dotenv là một thư viện giúp chúng ta đọc file .env để lấy thông tin môi trường
//Tạo một biến môi trường để khi đưa code lên gitlab không bị lộ thông tin của csdl
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);


//nhúng 2 file của bên controller vô, lưu trữ với tên biến
const tourController = require('./controllers/client/tour.controller');
const homeController = require('./controllers/client/home.controller');

const app = express()
const port = 3000

// Thiết lập views
// dirname là biến để nối chuỗi có sẵn trong nodeJS
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Sử dụng static file
app.use(express.static(path.join(__dirname, "public")));

app.get('/', homeController.home);

app.get('/tour', tourController.list);

app.listen(port, () => {
    console.log(`Website dang chay tren http://localhost:${port}`)
})