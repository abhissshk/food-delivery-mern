require("dotenv").config();
const Stripe = require("stripe");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place user order and create Stripe checkout session
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    // Ensure userId is present from authMiddleware
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const { items, amount, address } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items to order" });
    }

    // Create new order in DB
    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // Prepare Stripe line_items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price)* 83 * 100), // convert to paisa
      },
      quantity: Number(item.quantity) || 1,
    }));


    // Add delivery charges (₹20)
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 20 * 100,
      },
      quantity: 1,
    });

    console.log("Stripe line_items:", line_items);

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe / Order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOrder=async(req,res)=>{
const {orderId,success}=req.body
try{
  if(success=="true"){
    await orderModel.findByIdAndUpdate(orderId,{payment:true});
    res.json({success:true,message:"paid"})
  }

  else{
    await orderModel.findByIdAndDelete(orderId);
    res.json({success:false,message:"Not paid"})
  }
}catch(error){
  console.log(error)
  res.json({success:false,message:"ERROR"})

}

}

// user orders for fronted

const userOrders=async(req,res)=>{
  try{

    const orders=await orderModel.find({userId:req.userId})
    res.json({success:true,data:orders})
  }catch(error){
console.log(error)
res.json({success:false,message:"error"})
  }

}


// Listing order for admin panel

const listOrders=async(req,res)=>{

  try{
    const orders=await orderModel.find({});
    res.json({success:true,data:orders})
  }catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})
  }

}

// api for updating order status

const updateStatus=async (req,res)=>{
  try{

    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"status updated"})

  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})

  }

}

module.exports = { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };