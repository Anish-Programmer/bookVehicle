import mongoose from "mongoose";


const vehicleSchema = mongoose.Schema({ 
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description:{
        type: String,
        required: [true, "Description is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than 0"],
    },
    image: {
        type: String,
        required: [true, "Image is required"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },

}, {timestamps: true});


const Vehicle = mongoose.model("Vehicle", vehicleSchema);   

export default Vehicle;

    
