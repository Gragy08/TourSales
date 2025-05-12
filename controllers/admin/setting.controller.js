const SettingWebsiteInfo = require("../../models/setting-website-info.model")
const bcrypt = require("bcryptjs");
const permissionConfig = require("../../config/permission");
const Role = require("../../models/role.model");
const AccountAdmin = require("../../models/account-admin.model");
const { model } = require("mongoose");
const moment = require("moment");

module.exports.list = async (req, res) => {
  res.render("admin/pages/setting-list", {
    pageTitle: "Cài đặt chung"
  })
}

// Website Info Page
module.exports.websiteInfo = async (req, res) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  res.render("admin/pages/setting-website-info", {
    pageTitle: "Thông tin website",
    settingWebsiteInfo: settingWebsiteInfo
  })
}

module.exports.websiteInfoPatch = async (req, res) => {
  if(req.files && req.files.logo) {
    req.body.logo = req.files.logo[0].path;
  } else {
    delete req.body.logo;
  }

  if(req.files && req.files.favicon) {
    req.body.favicon = req.files.favicon[0].path;
  } else {
    delete req.body.favicon;
  }

  // Do chỉ có 1 bản ghi trong bảng setting-website-info nên dùng findOne thay vì find
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  if(settingWebsiteInfo) {
    await SettingWebsiteInfo.updateOne({
      _id: settingWebsiteInfo.id
    }, req.body)
  } else {
    const newRecord = new SettingWebsiteInfo(req.body);
    await newRecord.save();
  }

  req.flash("success", "Cập nhật thành công!")

  res.json({
    code: "success"
  })
}
// End Website Info Page

// Account Admin Page
module.exports.accountAdminList = async (req, res) => {
  const find = {
    deleted: false
  };

  // Filterd by status
  if(req.query.status) {
    find.status = req.query.status
  }
  // End Filterd by status

  // Filter by CreatedDate
  const dateFilter = {}

  if(req.query.startDate) {
    // Phải định dạng lại bằng thư viện moment để khớp với định dạng của MongoDB
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;
  }

  if(req.query.endDate) {
    // Phải định dạng lại bằng thư viện moment để khớp với định dạng của MongoDB
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFilter.$lte = endDate;
  }

  if(Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }
  // End Filter by CreatedDate

  // Filterd by role
  if(req.query.role) {
    find.role = req.query.role
  }
  // End Filterd by role

  const roleList = await Role
    .find({
      deleted: false
    });

  const accountAdminList = await AccountAdmin
    .find(find)
    .sort({
      createdAt: "asc"
    });

  for(const item of accountAdminList) {
    if(item.role) {
      const roleInfo = await Role.findOne({
        _id: item.role
      });

      if(roleInfo) {
        item.roleName = roleInfo.name;
      }
    }
  }

  res.render("admin/pages/setting-account-admin-list", {
    pageTitle: "Tài khoản quản trị",
    accountAdminList: accountAdminList,
    roleList: roleList
  })
}

module.exports.accountAdminCreate = async (req, res) => {
  const roleList =  await Role.find({
    deleted: false
  })

  res.render("admin/pages/setting-account-admin-create", {
    pageTitle: "Tạo tài khoản quản trị",
    roleList: roleList
  })
}

module.exports.accountAdminCreatePost = async (req, res) => {
  const existAccount = await AccountAdmin.findOne({
    email: req.body.email
  })

  if(existAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại!"
    })
    return;
  }

  // Lấy biến account thông qua middleware auth
  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : null;

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSaltSync(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const newAccount = new AccountAdmin(req.body);
  await newAccount.save();

  req.flash("success", "Tạo tài khoản quản trị thành công!")

  res.json({
    code: "success"
  })
}

module.exports.accountAdminEdit = async (req, res) => {
  try {
    const roleList = await Role.find({
      deleted: false
    })
  
    const id = req.params.id;
    const accountAdminDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    })
  
    if(!accountAdminDetail) {
      res.redirect(`/${pathAdmin}/setting/account-admin/list`);
      return;
    }
  
    res.render("admin/pages/setting-account-admin-edit", {
      pageTitle: "Chỉnh sửa tài khoản quản trị",
      roleList: roleList,
      accountAdminDetail: accountAdminDetail
    })
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
  }
}

module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.updatedBy = req.account.id;
    if(req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }
    
    // Mã hóa mật khẩu với bcrypt
    if(req.body.password) {
      const salt = await bcrypt.genSalt(10); // Tạo salt - Chuỗi ngẫu nhiên có 10 ký tự
      req.body.password = await bcrypt.hash(req.body.password, salt); // Mã hóa mật khẩu
    }

    await AccountAdmin.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash('success', 'Cập nhật tài khoản quản trị thành công!');

    res.json({
      code: "success"
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
  }
}

module.exports.accountAdminDeletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await AccountAdmin.updateOne({
      _id: id,
      deleted: false
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });

    req.flash("success", "Xóa tài khoản quản trị thành công!");

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại!"
    })
  }
}

module.exports.accountAdminTrash = async (req, res) => {
  const find = {
    deleted: true
  };

  // Search
  if (req.query.keyword) {
      const keyword = req.query.keyword.trim();
      find.$or = [
          { fullName: { $regex: keyword, $options: "i" } }
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
    const totalItems = await AccountAdmin.countDocuments(find);
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

  const accountAdminList = await AccountAdmin
    .find({
      deleted: true
    })
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for(const item of accountAdminList) {
    if(item.role) {
      const roleInfo = await Role.findOne({
        _id: item.role
      });

      if(roleInfo) {
        item.roleName = roleInfo.name;
      }
    }
  }

  res.render("admin/pages/setting-account-admin-trash", {
    pageTitle: "Thùng rác Tài khoản quản trị",
    accountAdminList: accountAdminList,
    keyword: req.query.keyword || "",
    pagination: pagination
  })
}

module.exports.accountAdminTrashChangeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "undo":
        await AccountAdmin.updateMany({
          _id: { $in: ids }
        }, {
          deleted: false
        });
        req.flash("success", "Khôi phục thành công!");
        break;
      case "delete-destroy":
        await AccountAdmin.deleteMany({
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

module.exports.accountAdminUndoPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await AccountAdmin.updateOne({
      _id: id
    }, {
      deleted: false
    })

    req.flash("success", "Khôi phục Tài khoản quản trị thành công!");

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

module.exports.accountAdminDeleteDestroyPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await AccountAdmin.deleteOne({
      _id: id
    })

    req.flash("success", "Đã xóa vĩnh viễn Tài khoản quản trị thành công!");

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
// End Account Admin Page

// Role Page
module.exports.roleList = async (req, res) => {
  const roleList = await Role.find({
    deleted: false
  })

  res.render("admin/pages/setting-role-list", {
    pageTitle: "Nhóm quyền",
    roleList: roleList
  })
}

module.exports.roleCreate = async (req, res) => {
  res.render("admin/pages/setting-role-create", {
    pageTitle: "Tạo nhóm quyền",
    permissionList: permissionConfig.permissionList
  })
}

module.exports.roleCreatePost = async (req, res) => {
    // Lấy biến account thông qua middleware auth
    req.body,createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();

    req.flash("success", "Tạo nhóm quyền thành công!");

    res.json({
      code: "success"
    })
}

module.exports.roleEdit = async (req, res) => {
    try {
      const id = req.params.id;
  
      const roleDetail = await Role.findOne({
        _id: id,
        deleted: false
      })
  
      if(roleDetail) {
        res.render("admin/pages/setting-role-edit", {
          pageTitle: "Chỉnh sửa nhóm quyền",
          permissionList: permissionConfig.permissionList,
          roleDetail: roleDetail
        })
      } else {
        res.redirect(`/${pathAdmin}/setting/role/list`);
      }
    } catch (error) {
      res.redirect(`/${pathAdmin}/setting/role/list`);
    }
}  

module.exports.roleEditPatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.updatedBy = req.account.id;

        await Role.updateOne({
            _id: id,
            deleted: false
        }, req.body)

        req.flash("success", "Cập nhật nhóm quyền thành công!");

        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không tồn tại!"
        })
    }    
}
// End Role Page