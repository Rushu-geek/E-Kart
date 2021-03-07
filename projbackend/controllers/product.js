const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Product is not found"
            });
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }
        // destructure the fields
        const { name, description, price, category, stock } = fields;

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "Please enter all fields!!"
            });
        }

        let product = new Product(fields);

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File is too large!!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        //console.log(product);

        //save to the db
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "saving product failed!!!"
                });
            }
            res.json(product);
        });
    });
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

// middleware
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

// delete controller 
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete product"
            });
        }
        res.json({
            message: "Successfully deleted", deletedProduct
        });
    });
}

//update controller
exports.updateProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }

        // updation code.
        let product = req.product;
        product = _.extend(product, fields);

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File is too large!!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        //console.log(product);

        //save to the db
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Updation of product failed!!!"
                });
            }
            res.json(product);
        });
    });
}

//listing all products
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 9;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"; 

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "acs"]])
    .limit(limit)
    .exec((err, products) => {
        if (err || !products){
            return res.status(400).json({
                error: "Products are not available"
                });
            }
        res.json(products);
    });
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: {_id: product._id},
                update: {$inc: {stock: -product.count, sold: +product.count}}
            }
        }
    });
    product.bulkWrite(myOperations, {}, (err, products) => { //mongoose methods
        if(err){
            return res.status(400).json({
                error: "Bulk ops failed"
            });
        }
        next();
    });
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No categories found"
            });
        }
        res.json(categories);
    });
}