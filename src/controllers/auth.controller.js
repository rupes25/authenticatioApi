const userModel = require("../models/auth.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
}

function createToken(user) {
    return jwt.sign({
         id: user._id },
         process.env.JWT_SECRET,
         { expiresIn: "1d" })
}


//register api

async function registerUser(req, res) {
    const { name, email, password } = req.body

    //ab check krna hai ki ye values aarhi hai ya nhi ie.
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" ||
        !name.trim() || !email.trim() || password.length < 8 || password.length > 128) {
        return res.status(400).json({
            message: "Name, valid email and a password of 8 to 128 characters are required"
        })
    }

    try {
        //ab ye check krna hai ki ye values phle se exist to nhi kr rhi ie.
        const normalizedEmail = email.trim().toLowerCase()
        const userEmail = await userModel.findOne({ email: normalizedEmail })

        if (userEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        //ab user create kr skte hai agar ye saare upar wale satisfy kr rhe hai to lekin usse phle password ko hash kr lenge ie.
        const hash = await bcrypt.hash(password, 10)

        //ab user create
        const user = await userModel.create({
            name: name.trim(), email: normalizedEmail, password: hash
        })

        //ab user create ho gaya ab token create krte hai ie.

        const token = createToken(user)

        //ab cookie me token ko set krna hai
        res.cookie("token", token, cookieOptions)

        return res.status(200).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }

    catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Email already exists" })
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }

}

//login api
async function loginUser(req, res) {
    const { email, password } = req.body

    //email aur password aa bhi rha hai ya nhi
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
        return res.status(400).json({ message: "Email and password is required" })
    }

    try {
        //kya email se koi user exist krta hai ?
        const user = await userModel.findOne({ email: email.trim().toLowerCase() }).select("+password")

        if (!user) {
            return res.status(401).json({ message: "Invalid login credentials" })
        }
        //agar email valid hai to password ko krke check kro

        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
            return res.status(401).json({ message: "Invalid login credentials" })
        }

        //agar password shi hai to token generate kro
        const token = createToken(user)

        //fr cookie me token ko insert kro
        res.cookie("token", token, cookieOptions)

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
            message: "Internal server error"
        })
    }

}

//logout api
async function logoutUser(req, res) {
    try {
        res.clearCookie("token", cookieOptions)
        res.status(200).json({ message: "Logout successful" })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

//get current user
async function getCurrentUser(req, res) {
    try {
        const user = req.user

        return res.status(200).json({
            message: "User details",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    }
    catch (err) {

        return res.status(500).json({
            message: "Error in fetching user details"
        });
    }


}


module.exports = { registerUser, loginUser, logoutUser, getCurrentUser }