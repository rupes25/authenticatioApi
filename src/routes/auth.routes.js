const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")




//create register route
router.post("/api/register",authController.registerUser)

//login user
router.post("/api/login",authController.loginUser)

//logout user
router.post("/api/logout",authController.logoutUser)

//current user



module.exports = router