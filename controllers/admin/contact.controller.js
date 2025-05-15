const Contact = require("../../models/contact.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
    const find = {
        deleted: false
    };

    // Filtered by createAt
        const dateFilter = {};
    
        if(req.query.startDate) {
            const startDate = moment(req.query.startDate).startOf("date").toDate();
            dateFilter.$gte = startDate;
        }
    
        if(req.query.endDate) {
            const endDate = moment(req.query.endDate).endOf("date").toDate();
            dateFilter.$lte = endDate;
        }
    
        if(Object.keys(dateFilter).length > 0) {
            find.createdAt = dateFilter;
        }
    // End Filtered by createAt

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