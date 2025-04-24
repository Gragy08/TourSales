const slugify = require('slugify');
const Category = require("../../models/category.model")
const AccountAdmin = require("../../models/account-admin.model")

//Embed momet library
const moment = require("moment");

const categoryHelper = require("../../helpers/category.helper")

module.exports.list = async (req, res) => {
    // const categoryList = await Category.find({
    //     deleted: false
    // }).sort({
    //     position: "asc"
    // })

    const find = {
      deleted: false
    };

    // Filter by status
    if(req.query.status) {
      // Lấy giá trị sau dấu "?" trên url  
      find.status = req.query.status;
    }
    // End Filter by status
    
    // Filter by Created By
    if(req.query.createdBy) {
      find.createdBy = req.query.createdBy;
    }
    // End Filter by Created By

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

    // Search
    if(req.query.keyword) {

      // slugify là một thư viện giúp chuyển đổi chuỗi thành dạng slug (đường dẫn thân thiện với SEO)
      // lower: true => Chuyển về chữ thường
      const keyword = slugify(req.query.keyword, {
        lower: true
      });

      // Tìm kiếm theo Regex, (keyword, flag)
      const keywordRegex = new RegExp(keyword);
      find.slug = keywordRegex;
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
    const totalItems = await Category.countDocuments(find);
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
    
    const categoryList = await Category
      .find(find)
      .sort({
        position: "desc"
      })
      // display limitItem items each page
      .limit(limitItems)
      // skip skip items
      .skip(skip)

    // Get user info by ID
    for (const item of categoryList) {
        if(item.createdBy) {
            const infoUser = await AccountAdmin.findOne({
                _id: item.createdBy
            })
            item.createdByFullName = infoUser.fullName;
        }

        if(item.updatedBy) {
            const infoUser = await AccountAdmin.findOne({
                _id: item.updatedBy
            })
            item.updatedByFullName = infoUser.fullName;
        }

        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
        item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    }

    // Get list of admin accounts
    const accountAdminList = await AccountAdmin
    .find({})
    // Lấy ra những trường cần thiết thôi
    .select("id fullName")

    res.render("admin/pages/category-list", {
        pageTitle: "Quản lý danh mục",
        categoryList: categoryList,
        accountAdminList: accountAdminList,
        pagination: pagination
    })
}

module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    })

    const categoryTree = categoryHelper.buildCategoryTree(categoryList);

    res.render("admin/pages/category-create", {
        pageTitle: "Tạo danh mục",
        categoryList: categoryTree
    })
}

module.exports.createPost = async (req, res) => {
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Category.countDocuments({});
      req.body.position = totalRecord + 1;
    }
  
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";
  
    const newRecord = new Category(req.body);
    await newRecord.save();
  
    req.flash("success", "Tạo danh mục thành công!");
  
    res.json({
      code: "success"
    })
}  

module.exports.edit = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    })

    const categoryTree = categoryHelper.buildCategoryTree(categoryList);

    const id = req.params.id;
    const categoryDetail = await Category.findOne({
        _id: id,
        deleted: false
    })

    res.render("admin/pages/category-edit", {
        pageTitle: "Chỉnh sửa danh mục",
        categoryList: categoryTree,
        categoryDetail: categoryDetail
    })
}

module.exports.editPatch = async (req, res) => {
    try {
      const id = req.params.id;
  
      if(req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        const totalRecord = await Category.countDocuments({});
        req.body.position = totalRecord + 1;
      }
  
      req.body.updatedBy = req.account.id;
      if(req.file) {
        req.body.avatar = req.file.path;
      } else {
        delete req.body.avatar;
      }
  
      await Category.updateOne({
        _id: id,
        deleted: false
      }, req.body)
  
      req.flash("success", "Cập nhật danh mục thành công!");
  
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

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Category.updateOne({
      _id: id
    }, {
      deleted: true,
      // variable account was created in authMiddleware file(func)
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })

    req.flash("success", "Xóa danh mục thành công!")

    res.json({
      code:"success"
    })
  } catch {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {

    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await Category.updateMany({
          // Tìm id trong mảng ids
          _id: { $in: ids }
        }, {
          status: option
        })
        req.flash("success", "Đổi trạng thái thành công!");
        break;

      case "delete":
        await Category.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        })
        req.flash("success", "Xóa thành công!");
        break;
    }

    req.flash("success", "Đổi trạng thái thành công!")
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}