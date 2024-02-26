import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connection from "./connection/connection.js";
import router from "./router/router.js"

const app =  express();
dotenv.config();
app.use(cors())
app.use(express.json())
app.use("/api",router)

connection(process.env.DATABASE_URL,(isConnect)=>{
     if(isConnect){
        app.listen(process.env.PORT,()=>{
            console.log(`Server is listen on port ${process.env.PORT}`)
        })
     }
})


