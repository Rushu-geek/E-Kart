const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            res.status(400).json({
                error: 'User not found in DB'
            });
        }
        req.profile = user;
        next();
    });
}

exports.getUser = (req, res) => {
    console.log(req.profile);
    req.profile.salt = undefined;
    req.profile.encrypt_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    console.log(req.profile);
    return res.json(req.profile);
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error : "you are not authorized to modify user"
                })
            }
            user.salt = undefined;
            user.encrypt_password = undefined;
            res.json(user);
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id})
    .populate("user", "_id name")                // mistake here should be propagated
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No orders available"
            });
        }
        res.json({order});
    });
}

exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
          next();
        }
    )
}

// exports.getAllUsers = (req, res) => {
//     User.find((err, users) => {
//         if (err || !users){
//             return res.status(400).json({
//                 error: "Users are not available"
//             });
//         }
//         res.json(users);
//     });
// }