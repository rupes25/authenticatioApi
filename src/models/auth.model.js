const mongoose = require("mongoose")

//create schema 

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        minLength:[3,"Name should contain more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Password is required"],
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER",
        // required:[true,"role should be either user or admin"] //jb default value de diye hai to iski  need nhi hai
    }

},{timestamps:true})


const userModel = mongoose.model("userDetails",userSchema)


module.exports = userModel