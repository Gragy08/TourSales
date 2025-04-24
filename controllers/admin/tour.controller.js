const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");

module.exports.list = async (req, res) => {
    res.render("admin/pages/tour-list", {
        pageTitle: "Quản lý tour"
    })
}

module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    })

    const categoryTree = categoryHelper.buildCategoryTree(categoryList);

    const cityList = await City.find({
        // Find all records
    })

    res.render("admin/pages/tour-create", {
        pageTitle: "Tạo tour",
        categoryList: categoryTree,
        cityList: cityList
    })
}

module.exports.trash = async (req, res) => {
    res.render("admin/pages/tour-trash", {
        pageTitle: "Thùng rác tour"
    })
}

module.exports.createPost = async (req, res) => {

    // Format lại dữ liệu trưóc khi lưu vào DB
    // Phần danh mục
    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
    const totalRecord = await Tour.countDocuments({});
    req.body.position = totalRecord + 1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";
    // Hết Phần danh mục

    // Phần tour
    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    // Chuyển từ JSON về mảng
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    // Chuyển thành định dạng chuẩn trong CSDL
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    // Chuyển từ JSON về mảng
    req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];
    // Hết Phần tour

    // Save to DB
    const newRecord = new Tour(req.body);
    await newRecord.save();

    req.flash("success", "Tạo tour thành công!")

    res.json({
        code: "success"
    })
}