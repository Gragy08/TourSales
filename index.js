const express = require('express')
const path = require('path');
require('dotenv').config();
//dotenv là một thư viện giúp chúng ta đọc file .env để lấy thông tin môi trường
//Tạo một biến môi trường để khi đưa code lên gitlab không bị lộ thông tin của csdl
const admintRoutes = require("./routers/admin/index.router");
const clientRoutes = require("./routers/client/index.router");
const database = require("./config/database");
//Nhúng file lưu biến vào
const variableConfig = require("./config/variable");

const app = express()
const port = 3000

//ket noi database
database.connect();

// Thiết lập views
// dirname là biến để nối chuỗi có sẵn trong nodeJS
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Sử dụng static file
app.use(express.static(path.join(__dirname, "public")));

// Tạo biến toàn cục trong file PUG
// Biến env chỉ dùng được trong các file JS bên Back-end thôi
// Tất cả file PUG đều dùng được biến pathAdmin này
// Tất cả file PUG mà sử dụng với res.render đều có thể sử dụng biến pathAdmin này
app.locals.pathAdmin = variableConfig.pathAdmin;

// Thiet lap duong dan
app.use(`/${variableConfig.pathAdmin}`, admintRoutes);
app.use("/", clientRoutes);

app.listen(port, () => {
    console.log(`Website dang chay tren http://localhost:${port}`)
})