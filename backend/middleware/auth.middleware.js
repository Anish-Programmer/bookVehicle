import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectRoute = async (req, res, next) => {

    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({message: "Unauthorized - No access token"});
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");
            
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
            
            req.user = user;    // now we can use this user in the next middleware
            next(); 
        }catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({message: "Unauthorized - Access token expired"});
            }
           throw error;
        }
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({message: "Server Error", error: error.message});
    }

}

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({message: "Access denited - Admin  only"});
    }
}