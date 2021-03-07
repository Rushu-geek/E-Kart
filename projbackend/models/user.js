var mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : {
        type : String,
        required : true,
        maxlength : 32,
        trim : true
    },
    last_name : {
        type : String,
        maxlength : 32,
        trim : true
    },
    email : {
        type : String,
        trim : true, 
        required : true,
        unique : true
    },
    user_info : {
        type : String,
        trim : true
    },
    encrypt_password : {
        type : String,
        required : true
    },
    salt : String,
    role : {
        type : Number,
        default : 0
    },
    purchases : {
        type : Array,
        default : []
    }
}, { timestamps : true });

userSchema.virtual('password')
    .get(function () {
     return this._password;
    })
    .set(function (password) {
     this._password = password;
     this.salt = uuidv1();
     this.encrypt_password = this.securePassword(password);
    });

userSchema.methods = {
    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encrypt_password;
    },
    securePassword : function(plainpassword){
        if (!plainpassword) return "";
        try {
            console.log("password is secured here!!!");
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        } catch (err) {
            return "";
        }
    }
}


module.exports = mongoose.model("User", userSchema);