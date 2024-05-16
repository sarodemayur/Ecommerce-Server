const Contact = require('../models/contactSchema')

const contactForm = async(req,res) => {
   try {
    const response = req.body;
    await Contact.create(response);
    return res.status(200).json({message:"messeage sent successfully"})
   } catch (error) {
    return res.status(500).json({message:"message not deliverd"});    
   }
};

module.exports = contactForm;