require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/authentication.db")

const port = process.env.PORT || 5000

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGO_URI and JWT_SECRET environment variables are required")
}



async function startServer() {
    await connectToDB()
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

startServer().catch((err) => {
    console.error("Unable to start server:", err.message)
    process.exit(1)
})