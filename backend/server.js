import express from "express";
import dotenv from "dotenv";

import path from 'path'


import cors from "cors";

import authRoutes from './routes/auth.route.js';
import vehicleRoutes from './routes/vehicle.route.js';
import bookListRoutes from './routes/bookList.route.js';
import analyticsRoutes from './routes/analytics.route.js';



import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();



const app = express();
const PORT = process.env.PORT || 5000;


const __dirname = path.resolve() 

app.use(express.json({limit: "10mb"})) // allows us to parse the body of the request
app.use(cookieParser()); // to use refresh token
app.use(express.urlencoded({extended: true}));




app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend requests
    credentials: true  // Allow cookies & authentication headers
}));



app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookList', bookListRoutes);
app.use('/api/analytics', analyticsRoutes);




if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/dist")));


    app.get("*", (req,res) =>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}




app.listen(PORT,()=>{
    console.log("Server is running on http://localhost:"+PORT);
    connectDB();
})

