import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Admin } from "../models/AdminSchema.js";
import { generateToken } from '../utils/jwtToken.js';
import { v2 as cloudinary } from 'cloudinary';
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const signup = catchAsyncErrors(async (req, res, next)=>{
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !email || !password) {
        return next(new ErrorHandler("Mandetory Fields are required"));
    }
    const user = await Admin.create({
        fullName:{ firstName , lastName},
        email,
        password
    });
    
    generateToken(user, "Admin Registered", 201, res);
});

export const signin = catchAsyncErrors(async (req, res, next)=>{
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Email and Password are required"));
    }
    const user = await Admin.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or password!"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password!"));
    }

    generateToken(user, "Admin Logged In", 200, res);
});

export const logout = catchAsyncErrors(async (req, res, next)=>{
    res.status(200).cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "None",
        secure: true
    }).json({
        success: true,
        message: "Admin Logged Out!",
    })

});

export const getAdminData = catchAsyncErrors(async (req, res, next)=>{
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export const updateAdminProfile = catchAsyncErrors(async (req, res, next)=>{
    const newAdminData = {
        fullName:{ firstName: req.body.firstName , lastName: req.body.lastName},
        email: req.body.email,
        phone: req.body.phone,
    }

    if(req.files && req.files.avatar){
        const avatar = req.files.avatar;
        const user = await Admin.findById(req.user.id);
        if(user.avatar.public_id){ // If present Earlier then delete 
            const profileImageId = user.avatar.public_id;
            await cloudinary.uploader.destroy(profileImageId);
        }
       
        // Re-Uploading Avatar to cloudnary
        const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: "ADMIN_IMAGE" }
        );

        newAdminData.avatar = {
        public_id: cloudinaryResponseAvatar.public_id,
        url: cloudinaryResponseAvatar.secure_url,
        };
    }

    const user = await Admin.findByIdAndUpdate(req.user.id, newAdminData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Admin's Profile Updated!",
        user,
    });

});

export const updatePassword = catchAsyncErrors(async (req, res, next)=>{
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if(!currentPassword || !newPassword || !confirmPassword){
        return next(new ErrorHandler("Please fill All fields!", 400));
    }
    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("Confirm Password should be matched to New Password!", 400));
    }

    const user = await Admin.findById(req.user._id).select("+password");
    const isPasswordMatched = user.comparePassword(currentPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Current Password", 400));
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password Updated!",
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next)=>{
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User Not Found!", 404));
    }
    const resetToken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
    const message = `Your Reset Password Link is:- \n\n ${resetPasswordUrl} \n\n If you've not requested for this please ignore it.`;

    try {
        await sendEmail({
          email: user.email,
          subject: "Organization Admin Dashboard Password Recovery",
          message,
        });
    
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully!`,
        });
      } catch (error) {
        user.resetPasswordExire = undefined;
        user.resetPasswordToken = undefined;
        await user.save();
        return next(new ErrorHandler(error.message, 500));
      }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.params;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await Admin.findOne({
        resetPasswordToken,
        resetPasswordExire: { $gt : Date.now() },
    })
    if(!user){
        return next(new ErrorHandler("Reset Password token is invalid or has been Expired", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password & Confirm Password must be matched!", 400)); 
    }

    user.password = req.body.newPassword;
    user.resetPasswordExire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    generateToken(user, "Reset Password Successfully!", 200, res);
    
});
