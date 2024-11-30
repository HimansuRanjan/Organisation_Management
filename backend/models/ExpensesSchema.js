import mongoose from "mongoose";

const expensesSchema = mongoose.Schema({
    productName: {
        type: String,
        required:[true, "Product Name is required"]
    },
    amount:{
        type: Number,
        required:[true, "Amount is required"]
    },
    serviceType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service', // Reference to the Service model
        required: true, 
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const Expenses = mongoose.model("expenses", expensesSchema);