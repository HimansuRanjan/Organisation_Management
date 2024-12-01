import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Donation } from "../models/DonationSchema.js";
import { Donator } from "../models/DonatorSchema.js";

export const createDonation = catchAsyncErrors( async (req, res, next)=>{
    const { donator, donatorEmail, donatorPhoneNo, amount, donatedOn, paymentMode} = req.body;
    if(!amount || !paymentMode || !donator || !donatorEmail){
        return next(new ErrorHandler("Provide Mandetory Fields!", 400));
    }
    let paymentReceipt = null;
    if(req.files && req.files.paymentReceipt){
        paymentReceipt = req.files.paymentReceipt;
        // Uploading Receipt to cloudnary
        const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
            paymentReceipt.tempFilePath,
            { folder: "DONATION_RECEIPT" }
        );

        paymentReceipt = {
        public_id: cloudinaryResponseAvatar.public_id,
        url: cloudinaryResponseAvatar.secure_url,
        }
    }
    const donation = await Donation.create({
        donator,
        donatorEmail,
        donatorPhoneNo,
        amount,
        donatedOn,
        paymentMode,
        paymentReceipt
    });

    let prevDonator = await Donator.find({
        donatorEmail: donatorEmail
    });
    if(!prevDonator){
        prevDonator = await Donator.create({
            fullName: donator,
            donatorEmail,
            totalDonatedAmount: amount,
            noOfTime: 1
        });
        prevDonator.donatios.push(donation);
        await prevDonator.save();
    }else{
        prevDonator.totalDonatedAmount += amount;
        prevDonator.noOfTime += 1;
        await prevDonator.save();
    }
    res.status(200).json({
        success: true,
        message: "New Donation Added!",
        donation
    });
});

export const removeDonation = catchAsyncErrors( async (req, res, next)=>{
    const donation = await Donation.findById(req.params.id);
    if(!donation){
        return next(new ErrorHandler("Donation Not Found!", 400));
    }
    await donation.deleteOne();

    res.status(200).json({
        success: true,
        message: "Removed Donation!",
    });
});

export const getAllDonation = catchAsyncErrors( async (req, res, next)=>{
    const donations = await Donation.find();
    res.status(200).json({
        success: true,
        message: "All Donations!",
        donations
    });
});

export const donationDetails = catchAsyncErrors( async (req, res, next)=>{
    const donation = await Donation.findById(req.params.id);
    if(!donation){
        return next(new ErrorHandler("Donation Not Found!", 400));
    }
    res.status(200).json({
        success: true,
        message: "Donation Details!",
        donation
    });
});

export const donatorDetails = catchAsyncErrors( async (req, res, next)=>{
    const donator = await Donator.findById(req.params.id);
    if(!donator){
        return next(new ErrorHandler("Donator Not Found!", 400));
    }
    res.status(200).json({
        success: true,
        message: "Donator Details!",
        donator
    });
});

export const addDonator = catchAsyncErrors( async (req, res, next)=>{
    const { fullName, donatorEmail, totalDonatedAmount, noOfTime }= req.body;
    if(!fullName || !donatorEmail){
        return next(new ErrorHandler("Provide Mandetory Fields!", 400));
    }

    const donator = await Donator.create({
        fullName,
        donatorEmail,
        totalDonatedAmount,
        noOfTime
    });
    res.status(200).json({
        success: true,
        message: "New Donator Added!",
        donator
    });
});

export const removeDonator = catchAsyncErrors( async (req, res, next)=>{
    const donator = await Donator.findById(req.params.id);
    if(!donator){
        return next(new ErrorHandler("Donator Not Found!", 400));
    }
    await donator.deleteOne();

    res.status(200).json({
        success: true,
        message: "Removed Donator!",
    });
});

export const donateByNonAdmin = catchAsyncErrors( async (req, res, next)=>{
    const { donator, donatorEmail, donatorPhoneNo, amount, donatedOn, paymentMode} = req.body;
    if(!amount || !paymentMode || !donator || !donatorEmail || !donatorPhoneNo){
        return next(new ErrorHandler("Provide Mandetory Fields!", 400));
    }
    let paymentReceipt = null;
    if(req.files && req.files.paymentReceipt){
        paymentReceipt = req.files.paymentReceipt;
        // Uploading Receipt to cloudnary
        const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
            paymentReceipt.tempFilePath,
            { folder: "DONATION_RECEIPT" }
        );

        paymentReceipt = {
        public_id: cloudinaryResponseAvatar.public_id,
        url: cloudinaryResponseAvatar.secure_url,
        }
    }
    const donation = await Donation.create({
        donator,
        donatorEmail,
        donatorPhoneNo,
        amount,
        donatedOn,
        paymentMode,
        paymentReceipt
    });

    let prevDonator = await Donator.find({
        donatorEmail: donatorEmail
    });
    if(!prevDonator){
        prevDonator = await Donator.create({
            fullName: donator,
            donatorEmail,
            totalDonatedAmount: amount,
            noOfTime: 1
        });
        prevDonator.donatios.push(donation);
        await prevDonator.save();
    }else{
        prevDonator.totalDonatedAmount += amount;
        prevDonator.noOfTime += 1;
        await prevDonator.save();
    }
    res.status(200).json({
        success: true,
        message: "New Donation Added!",
        donation
    });
});