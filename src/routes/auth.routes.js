const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")




//create register route
router.post("/api/register",authController.registerUser)

//login user
router.post("/api/login",authController.loginUser)

//logout user
router.post("/api/logout",authMiddleware.checkLogIn ,authController.logoutUser)

//current user
router.get("/api/currentuser",authMiddleware.checkLogIn,authController.getCurrentUser)



module.exports = router