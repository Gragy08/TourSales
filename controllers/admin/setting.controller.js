module.exports.list = async (req, res) => {
    res.render("admin/pages/setting-list", {
        pageTitle: "Quản lý tour"
    })
}