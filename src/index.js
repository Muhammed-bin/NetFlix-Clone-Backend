import { app } from "./app.js"
import pool from "./db/index.js"



const startServer = async ()=>{
    try {
        const connection = await pool.getConnection()
        console.log("Database connected successfully")
        connection.release()

        app.listen(process.env.PORT,()=>{
            console.log("Server running on port: ",process.env.PORT)
        })

    } catch (err) {
        console.log("Database connection failed ",err)
        process.exit(1)
    }
}


startServer()