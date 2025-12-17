import { app } from "./app.js"
import connectDB from "./db/index.js"


// import dotenv from 'dotenv'
// dotenv.config() //now dotenv packege is not important just give in the package file

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("DB connected")
        })
    })
    .catch((err) => {
        console.log("Database error ", err)
    })