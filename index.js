const express = require('express')
const path = require('path');
require('dotenv').config();
//dotenv là một thư viện giúp chúng ta đọc file .env để lấy thông tin môi trường
//Tạo một biến môi trường để khi đưa code lên gitlab không bị lộ thông tin của csdl
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

const clientRoutes = require("./routers/client/index.router");

const app = express()
const port = 3000

// Thiết lập views
// dirname là biến để nối chuỗi có sẵn trong nodeJS
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Sử dụng static file
app.use(express.static(path.join(__dirname, "public")));

// Thiet lap duong dan
app.use("/", clientRoutes);

app.listen(port, () => {
    console.log(`Website dang chay tren http://localhost:${port}`)
})