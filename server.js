require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/authentication.db")

const port = process.env.PORT || 5000








app.listen(port,async()=>{
    await connectToDB()
    console.log(`Server  is running on port ${port}`)
})