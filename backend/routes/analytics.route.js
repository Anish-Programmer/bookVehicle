import express  from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailyBookingData } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get("/",protectRoute, adminRoute, async(req,res)=>{
    try {

        const analyticsData = await getAnalyticsData();

        const endDate = new Date(); 
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        
        const dailyBookingData = await getDailyBookingData(startDate, endDate);

        res.json({
            analyticsData,
            dailyBookingData
        })

        
    } catch (error) {
        console.log("Error in analytics rotue", error.message);
        res.status(500).json({message: "Server Error", error: error.message});
    }
})

export default router;  