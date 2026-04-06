const foodmodel = require("../models/foodModels")
const fs=require("fs")

// add food item

const addfood=async(req,res)=>{

    let image_filename=`${req.file.filename}`

    const food=new foodmodel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })

    try{

        await food.save();
        res.json({success:true,message:"Food added"})

    }catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})

    }

}

// All list food

const listFood=async(req,res)=>{
    try{

        const foods=await foodmodel.find({});
        res.json({success:true,data:foods})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})

    }

}

// remove food item

const removeFood=async(req,res)=>{
    try{

        const food=await foodmodel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodmodel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Food Removed"})

}catch(err){
    console.log(err)
    res.json({success:false,message:"err"})

    }

}

module.exports={addfood,listFood,removeFood}