module.exports.login = async (req, res) => {
    //Khi chạy vào hàm này sẽ render ra file login.pug trong thư mục views/admin/pages
    //Và truyền vào biến title là "Đăng nhập"
    res.render("admin/pages/login", {
        pageTitle: "Đăng nhập"
    })
}