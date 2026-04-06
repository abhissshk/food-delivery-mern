const mongoose=require("mongoose")

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://abhishek629460_db_user:pCOZ6tUJp3tiJv6p@foodtom.0aa5mb1.mongodb.net/food-del")
    .then(()=>{
        console.log("DB connected")
    }).catch((err)=>{
        console.error(err)
    })
}

module.exports=connectDB


