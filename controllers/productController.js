const Product = require('../models/productSchema')

const products = async(req,res) => {
  try {
    const response = await Product.find();
    if(!response){
        res.status(404).json({msg:"No Product found"});
        return;
    }
    res.status(200).json({msg:response})
  } catch (error) {
    console.log(`products: ,${error}`);
  }
}

const findProductById = async(req,res) => {
  try {
    const {id} = req.params;
    const response = await Product.find({_id:id})
    if(!response){
      res.status(404).json({msg:"No Product found"});
      return;
    }
    res.status(200).json({msg:response})
  } catch (error) {
    console.log(`products:, ${error}`);
  }
}

module.exports = {products, findProductById};