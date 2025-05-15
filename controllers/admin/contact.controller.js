const Contact = require("../../models/contact.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
    const find = {
        deleted: false
    };

    const contactList = await Contact
        .find(find)
        .sort({
            createAt: "desc"
        });

    for (const item of contactList) {
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    }

    res.render("admin/pages/contact-list", {
        pageTitle: "Thông tin Liên hệ",
        contactList: contactList
    })
}

module.exports.trash = async (req, res) => {
    const find = {
        deleted: true
    };

    const contactList = await Contact
        .find(find)
        .sort({
            deletedAt: "desc"
        });

    for (const item of contactList) {
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    }

    res.render("admin/pages/contact-trash", {
        pageTitle: "Thùng rác Liên hệ",
        contactList: contactList
    })
}