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
                children: children
            })
        }
    })

    return tree;
}

// Didnt direct export bcs use recursive to buildCategoryTree func, then export this func
module.exports.buildCategoryTree = buildCategoryTree;