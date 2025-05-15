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

    // Search
    if (req.query.keyword) {
        const keyword = req.query.keyword.trim();
        find.$or = [
            { email: { $regex: keyword, $options: "i" } }
        ];
    }
    // End Search

    // Pagination
    // 3 items each page
    const limitItems = 3;
    // current page 
    let page = 1;
    if(req.query.page) {
        // Lấy giá trị sau dấu "?" trên url
        const currentPage =  parseInt(req.query.page);
        if(currentPage > 0) {
        page = currentPage;
        }
    }
    const totalItems = await Contact.countDocuments(find);
    const totalPages = Math.max(1, Math.ceil(totalItems / limitItems));
    if(page > totalPages) {
        page = totalPages;
    }
    const skip = (page - 1) * limitItems;

    // Return the interface of the necessary variables
    const pagination = {
        skip: skip,
        totalItems: totalItems,
        totalPages: totalPages
    }
    // End Pagination

    const contactList = await Contact
        .find(find)
        .sort({
            createAt: "desc"
        })
        .limit(limitItems)
        .skip(skip)

    for (const item of contactList) {
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    }

    res.render("admin/pages/contact-list", {
        pageTitle: "Thông tin Liên hệ",
        contactList: contactList,
        keyword: req.query.keyword || "",
        pagination: pagination
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