const userModel = require("../models/auth.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



//register api

async function registerUser(req, res) {
    const { name, email, password } = req.body

    //ab check krna hai ki ye values aarhi hai ya nhi ie.
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email or password is missing"
        })
    }

    try {
        //ab ye check krna hai ki ye values phle se exist to nhi kr rhi ie.
        const userEmail = await userModel.findOne({ email })

        if (userEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        //ab user create kr skte hai agar ye saare upar wale satisfy kr rhe hai to lekin usse phle password ko hash kr lenge ie.
        const hash = await bcrypt.hash(password, 10)

        //ab user create
        const user = await userModel.create({
            name, email, password: hash
        })

        //ab user create ho gaya ab token create krte hai ie.

        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET)

        //ab cookie me token ko set krna hai
        res.cookie("token", token)

        return res.status(200).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        })
    }

    catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            err
        })
    }

}

//login api
async function loginUser(req, res) {
    const { email, password } = req.body

    //email aur password aa bhi rha hai ya nhi
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password is required" })
    }

    try {
        //kya email se koi user exist krta hai ?
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalud login credentials" })
        }
        //agar email valid hai to password ko krke check kro

        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
            return res.status(400).json({ message: "Invalud login credentials" })
        }

        //agar password shi hai to token generate kro
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET)

        //fr cookie me token ko insert kro
        res.cookie("token", token)

        res.status(200).json({
            message: "Login Successfull",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            }
        })

    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            err
        })
    }

}

//logout api
async function logoutUser(req,res){
    try{
        res.clearCookie("token")
        res.status(200).json({message:"Logout successful"})
    }
    catch(err){
        return res.status(500).json({message:"Internal server error"})
    }
}




module.exports = { registerUser, loginUser, logoutUser }