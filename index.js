const express = require("express")
const messageRoute = require("./routes/message")
const dotenv = require("dotenv")

dotenv.config({path: "./env"})

const app = express()
app.use(express.json())

app.use("/api/messages", messageRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status:errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

app.listen(process.env.PORT || 500, () => {
    console.log("server connected")
})
