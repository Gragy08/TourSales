const Category =  require("../../models/category.model");

module.exports.list = async (req, res) => {
    // Get slug from params. bcs i defined slug at url in router
    const slug = req.params.slug;

    // Find category by slug
    const category = await Category.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    })

    // Breadcrumb
    if(category) {
        const breadcrumb = {
            image: category.avatar,
            title: category.name,
            list: [
                {
                    link: "/",
                    title: "Trang chủ"
                }
            ]
        };

        // Tìm danh mục cha
        if(category.parent) {
            const parentCategory = await Category.findOne({
                _id: category.parent,
                deleted: false,
                status: "active"
            })

            if(parentCategory) {
                breadcrumb.list.push({
                link: `/category/${parentCategory.slug}`,
                title: parentCategory.name
                })
            }
        }

        // Thêm danh mục hiện tại
        breadcrumb.list.push({
            link: `/category/${category.slug}`,
            title: category.name
        })
        // End Breadcrumb

        res.render("client/pages/tour-list", {
            pageTitle: "Danh sách Tour",
            breadcrumb: breadcrumb
        });
    } else {
        res.redirect("/");
    }
}