const Tour = require('../../models/tour.model');

//await là chờ để lấy dữ liệu xong mới chạy xuống dòng code tiếp theo, dùng await phải có async
module.exports.list = async (req, res) => {
    const tourList = await Tour.find({});

    console.log(tourList);

    res.render("client/pages/tour-list", {
        pageTitle: "Danh sách tour",
        tourList: tourList
    })
}