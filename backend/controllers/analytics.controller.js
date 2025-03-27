import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";
import User from "../models/user.model.js"

export const getAnalyticsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();

    const bookingData = await Booking.aggregate([
        {
            $group: {
                _id: null, // it groups all documents together,
                totalBooking: { $sum:1},
                totalRevenue: {$sum:"$totalAmount"}
            },
        },
    ])

    const {totalBooking, totalRevenue} = bookingData[0] || {totalBooking: 0, totalRevenue: 0};

    return {
        users:totalUsers,
        vehicles:totalVehicles,
        totalBooking,
        totalRevenue
    }

}


export const getDailyBookingData = async (startDate, endDate) => {
    try {
        
        const dailyBookingData = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate, // greater than or equal to startDate
                        $lte: endDate, // less than or equal to endDate
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    booking: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
    
        
    
    
        const dateArray = getDateInRange(startDate, endDate);
        // console.log(dateArray); // ["2021-08-01", "2021-08-02", "2021-08-03"]
    
        return dateArray.map(date => {
            const foundData = dailyBookingData.find(item => item._id === date);
    
            return {
                date,
                booking: foundData?.booking || 0,
                revenue: foundData?.revenue || 0,
            }
        })

    } catch (error) {
            throw error
    }
}


function getDateInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}