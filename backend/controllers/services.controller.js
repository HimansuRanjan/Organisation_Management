import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Service } from "../models/SecviceSchema.js";
import { generateTokenServiceAdmin } from "../utils/jwtToken.js";
import { v2 as cloudinary} from 'cloudinary';
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";


// As an Admin code: 
export const addService = catchAsyncErrors(async (req, res, next)=>{
    const { serviceName, adminEmail, serviceAdminName, password } = req.body;
    if(!serviceName || !serviceAdminName || !adminEmail || !password){
        return next(new ErrorHandler("Mandetory Fields are required!", 400));
    }
    const service = await Service.create({
        serviceName,
        serviceAdminName,
        adminEmail,
        password,
        dateOfCreate: Date.now(),
    });
    // No need to generate token for Admin it will be created for Service Admin while login
    res.status(200).json({
        success: true,
        message: "New Service Added",
        service,
    })
});

export const getAllService = catchAsyncErrors(async (req, res, next)=>{
    const services = await Service.find();
    res.status(200).json({
        success: true,
        message: "All Services",
        services,
    });
})

export const deleteService = catchAsyncErrors(async (req, res, next)=>{
    const { id } = req.params;
    const service = await Service.findById(id);
    if(!service){
        return next(new ErrorHandler("Service Not Found, Error Occured!",400));
    }

    await service.deleteOne();
    res.status(200).json({
        success: true,
        message: "Service Removed"
    });
})

export const updateServiceAdminProfile = catchAsyncErrors(async (req, res, next)=>{
    const { id } = req.params;
    const service = await Service.findById(id);
    if(!service){
        return next(new ErrorHandler("Service Not Found, Error Occured!",400));
    }

    const newServiceAdminData = {
        serviceName: req.body.serviceName,
        serviceAdminName: req.body.serviceAdminName,
        adminEmail: req.body.adminEmail,
        adminPhoneNo: req.body.adminPhoneNo,
        dateOfCreate: req.body.dateOfCreate
    }
    if(req.files && req.files.adminPhoto){
        const adminNewPhoto = req.files.adminPhoto;
        if(service.adminPhoto.public_id){ // If present Earlier then delete 
            const profileImageId = service.adminPhoto.public_id;
            await cloudinary.uploader.destroy(profileImageId);
        }
        // Re-Uploading Avatar to cloudnary
        const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
            adminNewPhoto.tempFilePath,
        { folder: "SERVICES_ADMIN_IMAGE" }
        );

        newServiceAdminData.adminPhoto = {
        public_id: cloudinaryResponseAvatar.public_id,
        url: cloudinaryResponseAvatar.secure_url,
        };
    }

    const updatedService = await Service.findByIdAndUpdate(id, newServiceAdminData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Service Admin's Profile Updated!",
        updatedService,
    });
});

export const updateServiceAdminPassword = catchAsyncErrors(async (req, res, next)=>{
    const { id } = req.params;
    const service = await Service.findById(id).select("+password");
    if(!service){
        return next(new ErrorHandler("Service Not Found, Error Occured!",400));
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if(!currentPassword || !newPassword || !confirmPassword){
        return next(new ErrorHandler("Please fill All fields!", 400));
    }
    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("Confirm Password should be matched to New Password!", 400));
    }

    const isPasswordMatched = service.comparePassword(currentPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Current Password", 400));
    }

    service.password = newPassword;
    await service.save();
    res.status(200).json({
        success: true,
        message: "Service Admin Password Updated!",
    });
});


// As an Service Admin code: 
export const adminLogin = catchAsyncErrors(async (req, res, next)=>{
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Email and Password are required"));
    }
    const serviceUser = await Service.findOne({ adminEmail: email }).select("+password");
    if (!serviceUser) {
        return next(new ErrorHandler("Invalid Email or password!"));
    }

    const isPasswordMatched = await serviceUser.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password!"));
    }

    generateTokenServiceAdmin(serviceUser, "Service Admin Logged In", 200, res);
});

export const getServiceAdmin = catchAsyncErrors(async (req, res, next)=>{
    res.status(200).json({
        success: true,
        user: req.serviceUser
    });
});

export const serviceAdminLogout = catchAsyncErrors(async (req, res, next) =>{
    res.status(200).cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "None",
        secure: true
    }).json({
        success: true,
        message: "Service Admin Logged Out!",
    })
})

export const updateServiceAdminData = catchAsyncErrors(async (req, res, next)=>{
    const service = await Service.findById(req.serviceUser._id);
    if(!service){
        return next(new ErrorHandler("Service Not Found, Error Occured!",400));
    }

    const newServiceAdminData = {
        serviceAdminName: req.body.serviceAdminName,
        adminEmail: req.body.adminEmail,
        adminPhoneNo: req.body.adminPhoneNo,
    }
    
    if(req.files && req.files.adminPhoto){
        const adminNewPhoto = req.files.adminPhoto;
        if(service.adminPhoto.public_id){ // If present Earlier then delete 
            const profileImageId = service.adminPhoto.public_id;
            await cloudinary.uploader.destroy(profileImageId);
        }
        // Re-Uploading Avatar to cloudnary
        const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
            adminNewPhoto.tempFilePath,
        { folder: "SERVICES_ADMIN_IMAGE" }
        );

        newServiceAdminData.adminPhoto = {
        public_id: cloudinaryResponseAvatar.public_id,
        url: cloudinaryResponseAvatar.secure_url,
        };
    }

    const updatedService = await Service.findByIdAndUpdate(req.serviceUser._id, newServiceAdminData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Service Admin Data Updated!",
        serviceAdmin: updatedService  
    });
});

export const updateServiceAdminPwd = catchAsyncErrors(async (req, res, next)=>{
    const service = await Service.findById(req.serviceUser.id).select("+password");
    if(!service){
        return next(new ErrorHandler("Service Not Found, Error Occured!",400));
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if(!currentPassword || !newPassword || !confirmPassword){
        return next(new ErrorHandler("Please fill All fields!", 400));
    }
    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("Confirm Password should be matched to New Password!", 400));
    }

    const isPasswordMatched = service.comparePassword(currentPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Current Password", 400));
    }

    service.password = newPassword;
    await service.save();
    res.status(200).json({
        success: true,
        message: "Service Admin Password Updated!",
    });
});

export const forgotAdminPassword = catchAsyncErrors(async (req, res, next)=>{
    const serviceUser = await Service.findOne({ adminEmail: req.body.email });
    if (!serviceUser) {
        return next(new ErrorHandler("User Not Found!", 404));
    }
    const resetToken = await serviceUser.getResetPasswordToken();
    await serviceUser.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/api/v1/services/admin/password/reset/${resetToken}`;
    const message = `Your Reset Password Link is:- \n\n ${resetPasswordUrl} \n\n If you've not requested for this please ignore it.`;

    try {
        await sendEmail({
          email: serviceUser.adminEmail,
          subject: `${serviceUser.serviceName} Admin Dashboard Password Recovery`,
          message,
        });
    
        res.status(200).json({
          success: true,
          message: `Email sent to ${serviceUser.adminEmail} successfully!`,
        });
      } catch (error) {
        serviceUser.resetPasswordExire = undefined;
        serviceUser.resetPasswordToken = undefined;
        await serviceUser.save();
        return next(new ErrorHandler(error.message, 500));
      }
});

export const resetAdminPassword = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.params;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const serviceUser = await Service.findOne({
        resetPasswordToken,
        resetPasswordExire: { $gt : Date.now() },
    })
    if(!serviceUser){
        return next(new ErrorHandler("Reset Password token is invalid or has been Expired", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password & Confirm Password must be matched!", 400)); 
    }

    serviceUser.password = req.body.newPassword;
    serviceUser.resetPasswordExire = undefined;
    serviceUser.resetPasswordToken = undefined;
    await serviceUser.save();

    generateTokenServiceAdmin(serviceUser, "Reset Password Successfully!", 200, res);
    
});
