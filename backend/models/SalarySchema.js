import mongoose from "mongoose";

const salarySchema = mongoose.Schema({
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required:[true, "Employee required"],
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId:{
        type: String,
        required: true
    },
    salaryDate:{
        type: Date,
        default: Date.now
    },
    salaryMode:{
        type: String,
        enum:["online", "offline"],
        required: [true, "Salary Mode is Required!"]
    },
    salaryReceipt:{
        type:{
            public_id: {
                type: String,
                required: function() {
                  return this.salaryMode === 'online';  // public_id is required only when salaryMode is 'online'
                },
              },
            url: {
                type: String,
                required: function() {
                  return this.salaryMode === 'online';  // public_id is required only when salaryMode is 'online'
                },
              }
        },
        validate: {
            validator: function(value) {
              // If salaryMode is 'online', receipt should have both public_id and url
              if (this.salaryMode === 'online') {
                return value && value.public_id && value.url;  // Validate both fields are provided
              }
              return true;  // If salaryMode is 'offline', no validation for receipt
            },
            message: 'Both public_id and url are required when salaryMode is online',
        },
    }
});

export const Salary = mongoose.model("salary", salarySchema);