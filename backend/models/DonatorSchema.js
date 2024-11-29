import mongoose from "mongoose";

const donatorSchema = mongoose.Schema({
    fullName:{
        type: String,
        required:[true, "Donator Name is required"],
        minLength: [3, "Name must contain at least 3 characters!"],
    },
    donatorEmail: String,
    
    totalDonatedAmount:{
        type: Number,
        default: 0
    },
    noOfTime: {
        type: Number,
        default: 0
    },
    donations: [{
        type: mongoose.Schema.Types.ObjectId,  // Array of ObjectId
        ref: 'donation',  // Reference to the Service model
      }],
});

export const Donator = mongoose.model("donator", donatorSchema);