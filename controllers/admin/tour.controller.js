const moment = require("moment");
const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");
const AccountAdmin = require("../../models/account-admin.model");

module.exports.list = async (req, res) => {
    const find = {
        deleted: false
    };

    // Filtered by status
    if(req.query.status) {
        find.status = req.query.status;
    }
    // End Filtered by status

    // Filtered by createdBy
    if(req.query.createdBy) {
        find.createdBy = req.query.createdBy;
    }

    // Get list of account admin
    const accountAdminList = await AccountAdmin
        .find({})
        .select("id fullName");
    // End Get list of account admin
    // End Filtered by createdBy

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

    // Filtered by category
    if(req.query.category) {
        find.category = req.query.category;
    }

    const categoryList = await Category
        .find({})
        .select("id name");
    // End Filtered by category

    // Search
    if (req.query.keyword) {
        const keyword = req.query.keyword.trim();
        find.$or = [
            { name: { $regex: keyword, $options: "i" } }
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
    const totalItems = await Tour.countDocuments(find);
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

    const tourList = await Tour
        .find(find)
        .sort({
            position: "desc"
        })
        .limit(limitItems)
        .skip(skip)

    for (const item of tourList) {
        if(item.createdBy) {
            const infoAccountCreated = await AccountAdmin.findOne({
            _id: item.createdBy
            })
            item.createdByFullName = infoAccountCreated.fullName;
        }
    
        if(item.updatedBy) {
            const infoAccountUpdated = await AccountAdmin.findOne({
            _id: item.updatedBy
            })
            item.updatedByFullName = infoAccountUpdated.fullName;
        }
    
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
        item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    }
        

    res.render("admin/pages/tour-list", {
        pageTitle: "Quản lý Tour",
        tourList: tourList,
        accountAdminList: accountAdminList,
        categoryList: categoryList,
        keyword: req.query.keyword || "",
        pagination: pagination
    })
}

module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    })

    const categoryTree = categoryHelper.buildCategoryTree(categoryList);

    const cityList = await City.find({
        // Find all records
    })

    res.render("admin/pages/tour-create", {
        pageTitle: "Tạo tour",
        categoryList: categoryTree,
        cityList: cityList
    })
}

module.exports.edit = async (req, res) => {
    try {
      const id = req.params.id;
  
      const tourDetail = await Tour.findOne({
        _id: id,
        deleted: false
      })
  
      if(tourDetail) {
        // format lại trường thời gian để đưa ra giao diện
        tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("YYYY-MM-DD");
  
        const categoryList = await Category.find({
          deleted: false
        })
    
        const categoryTree = categoryHelper.buildCategoryTree(categoryList);
    
        const cityList = await City.find({});
    
        res.render("admin/pages/tour-edit", {
          pageTitle: "Chỉnh sửa tour",
          categoryList: categoryTree,
          cityList: cityList,
          tourDetail: tourDetail
        })
      } else {
        res.redirect(`/${pathAdmin}/tour/list`);
      }
    } catch (error) {
      res.redirect(`/${pathAdmin}/tour/list`);
    }
}

module.exports.trash = async (req, res) => {
    const find = {
        deleted: true
    };

    // Search
    if (req.query.keyword) {
        const keyword = req.query.keyword.trim();
        find.$or = [
            { name: { $regex: keyword, $options: "i" } }
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
    const totalItems = await Tour.countDocuments(find);
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
    
    const tourList = await Tour
    .find(find)
    .sort({
        deletedAt: "desc"
    })
    // display limitItem items each page
    .limit(limitItems)
    // skip skip items
    .skip(skip)
    
    for (const item of tourList) {
        if(item.createdBy) {
            const infoAccountCreated = await AccountAdmin.findOne({
            _id: item.createdBy
            })
            item.createdByFullName = infoAccountCreated.fullName;
        }

        if(item.deletedBy) {
            const infoAccountDeleted = await AccountAdmin.findOne({
            _id: item.deletedBy
            })
            item.deletedByFullName = infoAccountDeleted.fullName;
        }

        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
        item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
    }

    res.render("admin/pages/tour-trash", {
        pageTitle: "Thùng rác Tour",
        tourList: tourList,
        keyword: req.query.keyword || "",
        pagination: pagination
    })
}

// Added BE Decentralization
module.exports.undoPatch = async (req, res) => {
    if(!req.permissions.includes("tour-trash")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    try {
        const id = req.params.id;
        
        await Tour.updateOne({
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

// Added BE Decentralization
module.exports.deleteDestroyPatch = async (req, res) => {
    if(!req.permissions.includes("tour-trash")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    try {
        const id = req.params.id;
        
        await Tour.deleteOne({
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

// Added BE Decentralization
module.exports.trashChangeMultiPatch = async (req, res) => {
    if(!req.permissions.includes("tour-trash")) {
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
            await Tour.updateMany({
                _id: { $in: ids }
            }, {
                deleted: false
            });
            req.flash("success", "Khôi phục thành công!");
            break;
            case "delete-destroy":
            await Tour.deleteMany({
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

// Added BE Decentralization
module.exports.createPost = async (req, res) => {
    if(!req.permissions.includes("tour-create")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    // Format lại dữ liệu trưóc khi lưu vào DB
    // Phần danh mục
    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
    const totalRecord = await Tour.countDocuments({});
    req.body.position = totalRecord + 1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    // req.body.avatar = req.file ? req.file.path : "";
    if(req.files && req.files.avatar) {
        req.body.avatar = req.files.avatar[0].path;
    } else {
        delete req.body.avatar;
    }
    // Hết Phần danh mục

    // Phần tour
    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    // Chuyển từ JSON về mảng
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    // Chuyển thành định dạng chuẩn trong CSDL
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    // Chuyển từ JSON về mảng
    req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];
    // Hết Phần tour

    if(req.files && req.files.images && req.files.images.length > 0) {
        req.body.images = req.files.images.map(file => file.path);
    } else {
        delete req.body.images;
    }

    // Save to DB
    const newRecord = new Tour(req.body);
    await newRecord.save();

    req.flash("success", "Tạo tour thành công!")

    res.json({
        code: "success"
    })
}

// Added BE Decentralization
module.exports.editPatch = async (req, res) => {
    if(!req.permissions.includes("tour-edit")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    try {
        const id = req.params.id;
    
        if(req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const totalRecord = await Tour.countDocuments({});
            req.body.position = totalRecord + 1;
        }
    
        req.body.updatedBy = req.account.id;
        // if(req.file) {
        //     req.body.avatar = req.file.path;
        // } else {
        //     delete req.body.avatar;
        // }
        if(req.files && req.files.avatar) {
            req.body.avatar = req.files.avatar[0].path;
        } else {
            delete req.body.avatar;
        }
    
        req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
        req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
        req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
        req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
        req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
        req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
        req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
        req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
        req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
        req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
        req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
        req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];
    
        if(req.files && req.files.images && req.files.images.length > 0) {
            req.body.images = req.files.images.map(file => file.path);
        } else {
            delete req.body.images;
        }

        await Tour.updateOne({
            _id: id,
            deleted: false
        }, req.body)
    
        req.flash("success", "Cập nhật tour thành công!")
    
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
module.exports.deletePatch = async (req, res) => {
    if(!req.permissions.includes("tour-delete")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
        })
        return;
    }

    try {
      const id = req.params.id;
      
      await Tour.updateOne({
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

// Added BE Decentralization
module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        if(!req.permissions.includes("tour-edit")) {
          res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
          })
          return;
        }

        await Tour.updateMany({
          _id: { $in: ids }
        }, {
          status: option
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;
      case "delete":
        if(!req.permissions.includes("tour-delete")) {
          res.json({
            code: "error",
            message: "Bạn không có quyền thực hiện chức năng này!"
          })
          return;
        }

        await Tour.updateMany({
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