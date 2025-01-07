import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from "crypto";

const serviceSchema = mongoose.Schema({
    serviceName:{
        type: String,
        required:[true, "Service Name is required"],
        minLength: [3, "Name must contain at least 3 characters!"],
        unique: true
    },
    serviceAdminName:{
        type: String,
        required:[true, "Admin Name is required"],
        minLength: [3, "Name must contain at least 3 characters!"],
    },
    adminEmail: {
        type: String,
        required:[true, "Email of Admin is required"]
    },
    adminPhoto: {
        public_id: String,
        url: String,
    },
    adminPhoneNo:{
        type: String,
        minLength: [10, "Length is less than Indian Standard Length"],
        maxLength: [10, "Length is greater than Indian Stanadard Length"],
    },
    dateOfCreate:{
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        minLength: [8, "Password must contain at least 8 characters!"],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExire: Date,
});

// for passwording hashing
serviceSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });

// for comparing password with hased password
serviceSchema.methods.comparePassword = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.password);
};

//Generating JSON Web Token
serviceSchema.methods.grnerateJsonWebToken = function () {
    return jwt.sign({ id: this._id },
        process.env.JWT_SERVICE_SECRET_KEY, 
        {
            expiresIn: process.env.JWT_SERVICE_EXPIRES,
        });
};

serviceSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
    
    this.resetPasswordExire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

export const Service = mongoose.model("service", serviceSchema);