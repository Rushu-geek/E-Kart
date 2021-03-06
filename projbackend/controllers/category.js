const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
    
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "Category is not found in DB!!"
            });
        }
        req.category = cate;
        next();
    });
}

exports.createCategory = (req, res) => {
    console.log("++++++++++++++++req++++++++++++++++", req.body);
    const category = new Category(req.body);
    console.log(category);
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error: "not able to save category in DB!!"
            });
        }
        res.json(category);
    });
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No categories found"
            });
        }
        res.json(categories);
    });
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to updated category"
            });
        }
        res.json(updatedCategory);
    })
}

exports.deleteCategory = (req, res) => {
    const category = req.category;

    category.remove((err, deleteCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete category"
            });
        }
        res.json({
            message: "Category deleted successfully"
        });
    })
}