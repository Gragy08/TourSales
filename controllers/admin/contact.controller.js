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
            deletedAt: "desc"
        })
        .limit(limitItems)
        .skip(skip)

    for (const item of contactList) {
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    }

    res.render("admin/pages/contact-trash", {
        pageTitle: "Thùng rác Liên hệ",
        contactList: contactList,
        keyword: req.query.keyword || "",
        pagination: pagination
    })
}

module.exports.deletePatch = async (req, res) => {
    try {
        const id = req.params.id;
        
        await Contact.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()
        })
    
        req.flash("success", "Xóa tour thành công!");
    
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!"
        })
    }
}

module.exports.undoPatch = async (req, res) => {
    try {
        const id = req.params.id;
        
        await Contact.updateOne({
            _id: id
        }, {
            deleted: false
        })
    
        req.flash("success", "Khôi phục tour thành công!");
    
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!"
        })
    }
}
 
module.exports.deleteDestroyPatch = async (req, res) => {
    try {
        const id = req.params.id;
        
        await Contact.deleteOne({
            _id: id
        })
    
        req.flash("success", "Đã xóa vĩnh viễn tour thành công!");
    
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!"
        })
    }
}

module.exports.trashChangeMultiPatch = async (req, res) => {
    try {
        const { option, ids } = req.body;
    
        switch (option) {
            case "undo":
            await Contact.updateMany({
                _id: { $in: ids }
            }, {
                deleted: false
            });
            req.flash("success", "Khôi phục thành công!");
            break;

            case "delete-destroy":
            await Contact.deleteMany({
                _id: { $in: ids }
            });
            req.flash("success", "Xóa viễn viễn thành công!");
            break;
        }
    
        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không tồn tại trong hệ thông!"
        })
    }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "delete":
        // if(!req.permissions.includes("tour-delete")) {
        //   res.json({
        //     code: "error",
        //     message: "Bạn không có quyền thực hiện chức năng này!"
        //   })
        //   return;
        // }

        await Contact.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        });
        req.flash("success", "Xóa thành công!");
        break;
    }

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thông!"
    })
  }
}