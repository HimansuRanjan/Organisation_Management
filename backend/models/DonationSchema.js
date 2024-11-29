import mongoose from "mongoose";

const donationSchema = mongoose.Schema({
    donator:{
        type: String,
        required:[true, "Donator Name is required"],
        minLength: [3, "Name must contain at least 3 characters!"],
    },
    donatorEmail: String,
    donatorPhoneNo: String,
    amount:{
        type: Number,
        default: 0
    },
    donatedOn:{
        type: Date,
        default: Date.now
    },
    paymentMode:{
        type: String,
        enum:["online", "offline"],
        required: [true, "Payment Mode is Required!"]
    },
    paymentReceipt:{
        type:{
            public_id: {
                type: String,
                required: function() {
                  return this.paymentMode === 'online';  // public_id is required only when mode is 'online'
                },
              },
            url: {
                type: String,
                required: function() {
                  return this.paymentMode === 'online';  // public_id is required only when mode is 'online'
                },
              }
        },
        validate: {
            validator: function(value) {
              // If paymentMode is 'online', receipt should have both public_id and url
              if (this.paymentMode === 'online') {
                return value && value.public_id && value.url;  // Validate both fields are provided
              }
              return true;  // If paymentMode is 'offline', no validation for receipt
            },
            message: 'Both public_id and url are required when paymentMode is online',
        },
    }
});

export const Donation = mongoose.model("donation", donationSchema);