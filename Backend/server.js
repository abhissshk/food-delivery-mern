
require("dotenv").config()
const express=require("express")
const app=express()
const cors=require("cors")
const connectdb=require("./config/db")
const foodRouter = require("./routes/foodRoutes")
const userRouter = require("./routes/userRoutes")
const cartRouter = require("./routes/cartRoutes")
const orderModel = require("./models/orderModel")
const orderRouter = require("./routes/orderRoutes")
const port=4000


// middleware

app.use(express.json())
app.use(cors({
  origin: "*"
}));

// db conn
connectdb()

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static("uploads"))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
  res.send("Api working")
})

app.listen(port,()=>{
    console.log(`server started at port no ${port}`)
})

