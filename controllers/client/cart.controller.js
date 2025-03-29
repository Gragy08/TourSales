module.exports.cart = async (req, res) => {
    //Khi chạy vào hàm này sẽ render ra file cart.pug trong thư mục views/client/pages
    //Và truyền vào biến title là "Giỏ hàng"
    res.render("client/pages/cart", {
        pageTitle: "Giỏ hàng"
    })
}