import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
    { 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        vehicles: [
            {
                vehicle: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Vehicle",
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be greater than 0"],
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, "Price must be greater than 0"],
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: [0, "Total amount must be greater than 0"],
        },
    
    },
     {timestamps: true }
);


const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;