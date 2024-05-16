const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')
const { Schema } = require('zod')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    isAdmin : {
        type: Boolean,
        default:false,
    },
    cart:[{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity:{
        type:Number,
        default:1
      },
      TotalPrice:{
        type:Number,
        default:0
      },
    }],
});

userSchema.pre('save', async function(next){
  const user = this;
  if(!user.isModified('password')){
    next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(this.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
};

userSchema.methods.generateToken = async function() {
   try {
    return jwt.sign(
        {
        userId:this._id.toString(),
        email:this.email,
        isAdmin:this.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    {
        expiresIn:"30d",
    }
    );
   } catch (error) {
     console.error(error);
   }
};

const User = new mongoose.model("User",userSchema);

module.exports = User;