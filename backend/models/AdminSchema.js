import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from "crypto";

const adminSchema = mongoose.Schema({
    fullName : {
        firstName: {
            type: String,
            required:[true, "First Name of Admin is required"],
            minLength: [3, "Nirst Name must contain at least 3 characters!"],
        },
        lastName: {
            type: String,
        }
    },
    email: {
        type: String,
        required:[true, "Email of Admin is required"]
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        minLength: [8, "Password must contain at least 8 characters!"],
        select: false,
    },

    phone:String,

    avatar: {
        public_id: String,
        url: String,
    },

    resetPasswordToken: String,
    resetPasswordExire: Date,

});

// for passwording hashing
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });

// for comparing password with hased password
adminSchema.methods.comparePassword = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.password);
};

//Generating JSON Web Token
adminSchema.methods.grnerateJsonWebToken = function () {
    return jwt.sign({ id: this._id },
        process.env.JWT_SECRET_KEY, 
        {
            expiresIn: process.env.JWT_EXPIRES,
        });
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
    
    this.resetPasswordExire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

export const Admin = mongoose.model("admin", adminSchema);