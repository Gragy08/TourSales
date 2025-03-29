module.exports.list = async (req, res) => {
    res.render("admin/pages/setting-list", {
        pageTitle: "Quản lý tour"
    })
}

module.exports.websiteInfo = async (req, res) => {
    res.render("admin/pages/setting-website-info", {
        pageTitle: "Thông tin website"
    })
}