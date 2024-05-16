const mongoose = require('mongoose');

const userCart = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    cart:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        title:{
            type:String
        },
        price:{
            type:String
        },
        quantity:{
            type:Number,
            default:1
        },
        image:{type:String}
    }]
})

const UserCart = new mongoose.model("UserCart", userCart)

module.exports = UserCart;