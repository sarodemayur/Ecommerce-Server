const express = require("express");
const router = express.Router();
const {
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
  DecreaseQuantity
} = require("../controllers/userController");
const signupSchema = require("../validators/userValidator");
const validate = require("../middlewares/validate-middleware");
const loginSchema = require("../validators/loginValidator");
const authMiddleware = require("../middlewares/auth-middleware");

// router.get('/', (req,res)=> {
//   res.status(200).send('Welcome.to home page')
// })

router.route("/").get(home);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/user").get(authMiddleware, user);

router.route("/user/cart").post(addToCart);

router.route("/user/cart/delete").post(deleteFromCart);

router.route("/user/cart/quantity").get(cartQuantity);

router.route("/user/cart/remove").delete(RemoveFromCart);

router.route("/user/create-checkout-session").post(checkoutsession);

router.route("/user/payment-details").post(authMiddleware, paymentDetails);

router.route("/user/getProductDetails").get(authMiddleware, getProductDetails);

router.route("/user/cart/decreaseQuantity").put(DecreaseQuantity);

module.exports = router;
