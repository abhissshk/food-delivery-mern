

const userModel = require("../models/userModel")



// add items to user cart
const addToCart = async (req, res) => {
  try {
    // ✅ use req.userId (from middleware)
    let userData = await userModel.findById(req.userId);

    // ✅ check user exists
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ safe cartData
    let cartData = userData.cartData || {};

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

// remove cart
const removeFromCart = async (req, res) => {
  try {
    // ✅ use middleware userId
    let userData = await userModel.findById(req.userId);

    // ✅ check user exists
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ safe cartData
    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId]) {
      if (cartData[req.body.itemId] > 1) {
        cartData[req.body.itemId] -= 1;
      } else {
        delete cartData[req.body.itemId]; // remove item completely
      }
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true, message: "Removed From Cart" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// fetch user cart data

const getCart=async(req,res)=>{

    try{

        let userData=await userModel.findById(req.userId);
        let cartData=await userData.cartData;
        res.json({success:true,cartData})


    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})

    }

}

module.exports={addToCart,removeFromCart,getCart}

