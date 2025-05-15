module.exports.list = async (req, res) => {
    res.render("admin/pages/user-list", {
        pageTitle: "Quản lý Người dùng"
    })
}