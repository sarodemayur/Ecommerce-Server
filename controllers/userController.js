const User = require("../models/userSchema");
const UserCart = require("../models/userCart");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PFrMGSHoSIOpCN6ez6s0nK0Hhp6RrbMs3yV9uDhGqu5o5hdamY2z8K73PRve6KBPAGnmVWrzjqunmfEzss7Hhsw00RuLZO8MV"
);

const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome.to home page" });
  } catch (error) {
    console.log("error");
  }
};

async function checkoutsession(req, res) {
  const { cart } = req.body;

  const lineItems = cart.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.productId.title,
        images: [product.productId.image],
      },
      unit_amount: product.productId.price * 100,
    },
    quantity: product.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success?redirectStatus=success", 
      cancel_url: "http://localhost:3000//cancel?redirectStatus=cancel", 
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}

const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "user already exists" });
    }

    //   const saltRound = 10;
    //   const hash_password = await bcrypt.hash(password,saltRound)

    const userCreated = await User.create({ username, email, password });

    res.status(201).json({
      msg: "registration successfully",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    //console.log(userExist);

    if (!userExist) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // const user = await bcrypt.compare(password, userExist.password);
    const user = await userExist.comparePassword(password);

    if (user) {
      res.status(200).json({
        msg: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ msg: "invalid email or password" });
    }
  } catch (error) {
    //res.status(500).json({ msg: "internal server error" });
    next(error);
  }
};

const user = async (req, res) => {
  try {
    const userData = req.user;
    // console.log(userData)
    res.status(200).json({ userData });
  } catch (error) {
    console.log(`error from the user route ${error}`);
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    // Find the user's cart
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const existingProduct = user.cart.find((item) => {
      return item.productId.toString() === productId._id;
    });
    if (existingProduct) {
      existingProduct.quantity++;
      existingProduct.price * existingProduct.quantity;
      await user.save();
      return res.status(200).json({ msg: "product updated success" });
    } else {
      user.cart.push({ productId: productId });
      await user.save();
      return res
        .status(200)
        .json({ msg: "Product added to cart successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const DecreaseQuantity = async(req,res) => {
  try {
    const {productId, userId} = req.body;
    const user = await User.findOne({_id:userId});
    if(!user){
      return res.status(404).json({msg:"User Not Found"});
    }
    const existingProduct = user.cart.find((item) => {
      return item.productId.toString() === productId;
    });
    if(existingProduct){
      existingProduct.quantity--;
      await user.save()
      return res.status(200).json({msg:"product Quantity updated success"})
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"Server Error"})
  }
}

const deleteFromCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    // console.log(req.body)
    //console.log(productId);
    // Find the user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Find the index of the product in the cart
    const productIndex = user.cart.find((item) => {
      return item.productId.toString() === productId._id;
    });
   // console.log(productIndex);
    if (productIndex === -1) {
      // Product not found in the cart
      return res.status(404).json({ msg: "Product not found in the cart" });
    }

    // Remove the product from the cart array
    user.cart.splice(productIndex, 1);
    await user.save();

    return res
      .status(200)
      .json({ msg: "Product removed from cart successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const cartQuantity = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const existingProduct = user.cart.find((item) => {
      return item.productId.toString() === productId._id;
    });
    console.log(existingProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const RemoveFromCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Remove all products from the cart array
    user.cart = [];
    await user.save();

    return res
      .status(200)
      .json({ msg: "All products removed from cart successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

async function paymentDetails(req, res) {
  const { cart, Fullname, Phone, productId } = req.body;
  try {
    if (req.user) {
      const userId = req.user.id;

      // Retrieve or create the user's cart document
      let existingCart = await UserCart.findOne({ userId });
      if (!existingCart) {
        existingCart = new UserCart({
          userId: userId,
          cart: cart.map((item) => ({
            productId: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            image: item.productId.image,
            quantity: item.quantity,
          })),
        });
      } else {
        existingCart.cart.push(
          ...cart.map((item) => ({
            productId: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            image: item.productId.image,
            quantity: item.quantity,
          }))
        );
      }

      // Save the changes to the user's cart
      await existingCart.save();

      // empty the user cart
      //await cart.deleteMany({ productId:productId });
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ msg: "User Not Found" });
      }
      user.cart = [];
      await user.save();

      return res.status(200).json({ success: true, cart: existingCart });
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "User Not Authenticated" });
    }
  } catch (error) {
    console.error("Error updating user cart data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update user cart data" });
  }
}


async function getProductDetails(req, res) {
  try {
    if (!req.user) {
      console.log("User not authenticated");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user.id;
    const existingCart = await UserCart.findOne({ userId: userId });
    if (existingCart) {
      res
        .status(200)
        .json({ cart: existingCart.cart, quantities: existingCart.quantities });
    } else {
      res.status(200).json({ cart: [], quantities: {} });
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  home,
  register,
  login,
  user,
  addToCart,
  deleteFromCart,
  cartQuantity,
  RemoveFromCart,
  checkoutsession,
  paymentDetails,
  getProductDetails,
  DecreaseQuantity,
};
