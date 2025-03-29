module.exports.list = async (req, res) => {
    res.render("admin/pages/category-list", {
        pageTitle: "Tổng quan"
    })
}