const Tour = require("../../models/tour.model");
const City = require("../../models/city.model");
const moment = require("moment");

module.exports.cart = async (req, res) => {
    //Khi chạy vào hàm này sẽ render ra file cart.pug trong thư mục views/client/pages
    //Và truyền vào biến title là "Giỏ hàng"
    res.render("client/pages/cart", {
        pageTitle: "Giỏ hàng"
    })
}

module.exports.detail = async (req, res) => {
    // Get data
    const cart = req.body;

    for(const item of cart) {
        const tourInfo = await Tour.findOne({
            _id: item.tourId,
            status: "active",
            deleted: false
        });

        if(tourInfo) {
            item.avatar = tourInfo.avatar;
            item.name = tourInfo.name;
            item.slug = tourInfo.slug;
            item.departureDateFormat = moment(tourInfo.departureDate).format("DD/MM/YYYY");
            item.priceNewAdult = tourInfo.priceNewAdult;
            item.priceNewChildren = tourInfo.priceNewChildren;
            item.priceNewBaby = tourInfo.priceNewBaby;

            const city = await City.findOne({
                _id: item.locationFrom
            });
            item.locationFromName = city.name;
        } else {
            // Nếu không lấy được tour thì xóa tour khỏi giỏ hàng
            const indexItem = cart.findIndex(tour => tour.tourId == item.tourId);
            cart.splice(indexItem, 1);
        }
    }

    res.json({
        code: "success",
        // Trả về cho FE đổi tượng cart
        cart: cart
    })
}