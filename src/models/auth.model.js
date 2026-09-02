const mongoose = require("mongoose")

//create schema 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
        minlength: [3, "Name should contain more than 3 characters"],
        maxlength: [80, "Name cannot exceed 80 characters"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
        // required:[true,"role should be either user or admin"] //jb default value de diye hai to iski  need nhi hai
    }

}, { timestamps: true })


const userModel = mongoose.model("userDetails", userSchema)


module.exports = userModel