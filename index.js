const express = require('express')
const path = require('path');
require('dotenv').config();
//dotenv là một thư viện giúp chúng ta đọc file .env để lấy thông tin môi trường
//Tạo một biến môi trường để khi đưa code lên gitlab không bị lộ thông tin của csdl
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);


const Tour = require('./models/tour.model');

const app = express()
const port = 3000

// Thiết lập views
// dirname là biến để nối chuỗi có sẵn trong nodeJS
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Sử dụng static file
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render("client/pages/home", {
        pageTitle: "Trang chủ",
    })
})


//await là chờ để lấy dữ liệu xong mới chạy xuống dòng code tiếp theo, dùng await phải có async
app.get('/tours', async (req, res) => {
    const tourList = await Tour.find({});

    console.log(tourList);

    res.render("client/pages/tour-list", {
        pageTitle: "Danh sách tour",
        tourList: tourList
    })
})

app.listen(port, () => {
    console.log(`Website dang chay tren http://localhost:${port}`)
})