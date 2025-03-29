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

module.exports.accountAdminList = async (req, res) => {
    res.render("admin/pages/setting-account-admin-list", {
        pageTitle: "Tài khoản quản trị"
    })
}