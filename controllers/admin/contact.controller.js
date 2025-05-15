const Contact = require("../../models/contact.model");
const moment = require("moment");
const mailHelper = require("../../helpers/mail.helper");

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
    const limitItems = 4;
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
    const limitItems = 4;
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

// Added BE Decentralization
module.exports.deletePatch = async (req, res) => {
    if(!req.permissions.includes("contact-delete")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    try {
        const id = req.params.id;
        
        await Contact.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()
        })
    
        req.flash("success", "Xóa liên hệ thành công!");
    
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

// Added BE Decentralization
module.exports.undoPatch = async (req, res) => {
    if(!req.permissions.includes("contact-trash")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    try {
        const id = req.params.id;
        
        await Contact.updateOne({
            _id: id
        }, {
            deleted: false
        })
    
        req.flash("success", "Khôi phục liên hệ thành công!");
    
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

// Added BE Decentralization
module.exports.deleteDestroyPatch = async (req, res) => {
    if(!req.permissions.includes("contact-trash")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    try {
        const id = req.params.id;
        
        await Contact.deleteOne({
            _id: id
        })
    
        req.flash("success", "Đã xóa vĩnh viễn liên hệ thành công!");
    
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

// Added BE Decentralization
module.exports.trashChangeMultiPatch = async (req, res) => {
    if(!req.permissions.includes("contact-trash")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

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
            req.flash("success", "Xóa vinh viễn thành công!");
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

// Added BE Decentralization
module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "delete":
        if(!req.permissions.includes("contact-delete")) {
          res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
          })
          return;
        }

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

module.exports.sendMail = async (req, res) => {
    try {
        const id = req.params.id;
  
        const contactDetail = await Contact.findOne({
            _id: id,
            deleted: false
        })

        res.render("admin/pages/contact-send-mail", {
        pageTitle: "Phản hồi liên hệ",
        contactDetail: contactDetail
    })
    } catch (error) {
        res.redirect(`/${pathAdmin}/contact/list`);
    }
}

// Added BE Decentralization
module.exports.sendMailPatch = async (req, res) => {
    if(!req.permissions.includes("contact-reply")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    try {
        const email = req.body.email;
        const title = req.body.title;
        const content = req.body.content;

        const staffName = req.account.fullName || 'Nhân viên hỗ trợ';
        const companyName = 'Công ty GQ8'

        const finalHtml = `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
            <p>Kính gửi Quý khách,</p>

            <p>Chúng tôi xin phản hồi yêu cầu của Quý khách như sau:</p>

            <div style="border-left: 4px solid #0d6efd; padding-left: 15px; margin: 10px 0;">
            ${content}
            </div>

            <p>Nếu Quý khách cần thêm thông tin hoặc hỗ trợ, vui lòng liên hệ lại với chúng tôi.</p>

            <p>Trân trọng,<br/>
            ${staffName}<br/>
            Bộ phận CSKH - ${companyName}</p>

            <hr style="margin-top: 30px;" />
            <p style="font-size: 12px; color: #888;">Email này được gửi từ hệ thống hỗ trợ khách hàng. Vui lòng không phản hồi trực tiếp.</p>
        </div>
        `;

        await mailHelper.sendMail(email, title, finalHtml);

        req.flash("success", "Gửi phản hồi thành công!");
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