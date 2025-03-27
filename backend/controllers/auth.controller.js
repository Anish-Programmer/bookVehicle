import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


const generateTokens = (userId) =>{
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    })

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    })

    return {accessToken, refreshToken};
};


const storeRefreshToken = async(userId, refreshToken) =>{
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX",7*24*60*60); // 7 day // storing in redis store
}


const setCookies = (res, accessToken, refreshToken) =>{
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attacks, cross site request forgery
        maxAge: 15*60*1000, // 15 minutes in milliseconds formulat 15*60*1000
});
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attacks, cross site request forgery
        maxAge: 7*24*60*60*1000, // 7 days in milliseconds formulat 7*24*60*60*1000
});
}



export const signup = async (req,res)=>{
   
    // to test singup we use => desktop app => postman
    const { email,  password, name } = req.body;
             
    // console.log(req.body);

    try{
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({message: "User already exists"});
        }

        
        const user = await User.create({email,name,password});  


        // authenticate
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    
    }catch (error){
        console.log("Error in singup controller", error.message);
         res.status(500).json({message: error.message});
    }

}

export const login = async (req,res)=>{
    
     try{
// console.log("here runs login 1")
        const {email, password} = req.body;
        const user = await User.findOne({email});
// console.log("her runs login 2")
console.log(user)
        if (user && (await user.comparePassword(password))){
            const {accessToken, refreshToken} = generateTokens(user._id);
console.log("Her runs login 3")
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            })
        }else {
            res.status(401).json({message: "Invalid email or password"});
        }
// console.log("her run login 4")
     } catch (error) {
        console.log("Her run login 5")
            console.log("Error in login controller", error.message);
            res.status(500).json({message: error.message});
     }



}
export const logout = async (req,res)=>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`); // deleting the refresh token from redis store  
        }
        // clearing the cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message: "Logged out successfully"});

    } catch (error){
        console.log("Erro in logout controller", error.message);
        res.status(500).json({message: "server Error", error: error.message});
    }
}

//  this will refresh the access token
export const refreshToken = async (req,res)=>{
    try {
        const  refreshToken  = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({message: "No refresh token provided."});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);


        if (storedToken !== refreshToken) {
            return res.status(401).json({message: "Invalid refresh token"});
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15*60*1000,
        });

        res.json({message:"Token refreshed successfully"});

    } catch (error) {
        console.log("Error in refresh token controller", error.message);
        res.status(500).json({message: "Server Error", error: error.message});
    }
}


// accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RlOGY5ZTViOWYwZWNhNmRhNjA0OTEiLCJpYXQiOjE3NDI2NDMyNzksImV4cCI6MTc0MjY0NDE3OX0.Kzo90Hl1oCYL7wlp688xN-uRZ-FYTNfmznEiG0-zhh4; Path=/; HttpOnly; Expires=Sat, 22 Mar 2025 11:49:39 GMT;

// accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RlOGY5ZTViOWYwZWNhNmRhNjA0OTEiLCJpYXQiOjE3NDI2NDMzNzIsImV4cCI6MTc0MjY0NDI3Mn0.YT6m940XvwlGdXrqT4fYdNXQ9CrehMeVtiHtH0t5ERQ; Path=/; HttpOnly; Expires=Sat, 22 Mar 2025 11:51:11 GMT;



// TODO -implement get Profile later
export const getProfile = async (req,res)=>{
    try {
        res.json(req.user);
    } catch (error) {
        res.status((500).json({ message: "Server error", error: error.message}));
    }
} 