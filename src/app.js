const express = require("express")
const cookieParser = require("cookie-parser")
const authRoutes = require("../src/routes/auth.routes")

const app = express()

app.use(express.json({ limit: "10kb" }))
app.use(cookieParser())

app.use("/",authRoutes)

app.use((req, res) => {
	res.status(404).json({ message: "Route not found" })
})


module.exports = app