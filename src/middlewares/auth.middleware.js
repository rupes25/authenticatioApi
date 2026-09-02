//ye  check krne ke liye ki user logged in hai ya nhi
const userModel = require("../models/auth.model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function checkLogIn(req, res, next) {
    //check kro ki req me token ya header aarha hai ya nhi

    const authorization = req.headers.authorization
    const token = req.cookies?.token || (authorization?.startsWith("Bearer ") ? authorization.slice(7) : null)

    if (!token) {
        return res.status(401).json({ message: "unauthorized access" })
    }

    try {
        //agar token jo aarha hai wo valid hai ya nhi
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //agar token shi hai to fr userid ko find kro
        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" })
        }

        //agar sb shi hai to request wale user ko is wale user se assign kr do ie.
        req.user = user
        return next()

    } catch (err) {
        return res.status(401).json({ message: "Unauthorized access" })
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" })
        }
        return next()
    }
}

module.exports = { checkLogIn, requireRole }