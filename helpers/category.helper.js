const Category = require("../models/category.model");

// Get tree of category
const buildCategoryTree = (categories, parentID = "") => {
    const tree = [];

    categories.forEach(item => {
        if(item.parent == parentID) {
            const children = buildCategoryTree(categories, item.id);
            // Gọi đệ quy buildCategoryTree để tìm các danh mục con của danh mục hiện tại (item)
            // , bằng cách truyền item.id làm parentID mới.

            tree.push({
                id: item.id,
                name: item.name,
                slug: item.slug,
                children: children
            })
        }
    })

    return tree;
}

// Didnt direct export bcs use recursive to buildCategoryTree func, then export this func
module.exports.buildCategoryTree = buildCategoryTree;
// End Get tree of category

// Get all ids of category parent n child
module.exports.getAllSubcategoryIds = async (parentId) => {
  // Mảng lưu tất cả ID của danh mục (gồm danh mục cha và các danh mục con)
  const result = [parentId];

  // Hàm đệ quy để tìm các danh mục con
  const findChildren = async (currentId) => {
    // Tìm các danh mục con có parent = currentId, không bị xóa và đang hoạt động
    const children = await Category
      .find({
        parent: currentId,
        deleted: false,
        status: "active"
      });

    // Duyệt qua từng danh mục con tìm được
    for (const child of children) {
      result.push(child.id); // Thêm ID vào danh sách kết quả
      await findChildren(child.id); // Gọi đệ quy để tìm danh mục con của danh mục này
    }
  };

  // Bắt đầu đệ quy từ danh mục gốc
  await findChildren(parentId);

  // Trả về toàn bộ danh sách ID đã thu thập được
  return result;
};
// End Get all ids of category parent n child