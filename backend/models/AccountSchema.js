import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
    donatedAmount: {
        type: Number,
        default: 0
    },
    currentStock:{
        type: Number,
        default: 0
    },
    salaryPerMonth:{
        type: Number,
        default: 0
    },
    outStanding:{
        type: Number,
        default: 0
    },
});

export const Account = mongoose.model("account", accountSchema);