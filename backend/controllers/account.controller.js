import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Account } from "../models/AccountSchema.js";

export const createAccount = catchAsyncErrors(async (req, res, next)=>{
    const {donatedAmount, currentStock, salaryPerMonth, outStanding} = req.body;
    if(!donatedAmount || !currentStock || !salaryPerMonth || !outStanding){
        return next(new ErrorHandler("Please Provide the Mandetory Fields!", 400));
    }
    const findAcc = await Account.find();
    if(findAcc){
        return next(new ErrorHandler("Account is present. Only one Account Allowed!", 400));
    }
    const account = await Account.create({
        donatedAmount,
        currentStock,
        salaryPerMonth,
        outStanding
    });

    res.status(200).json({
        success: true,
        message: "Account Created Successfully!",
        account
    });
});

export const resetAccount = catchAsyncErrors(async (req, res, next)=>{
    const account = await Account.find(); 
    if(!account){
        return next(new ErrorHandler("Account not Found! Add One Account."))
    }    
    account.donatedAmount = 0;
    account.currentStock = 0;
    account.salaryPerMonth = 0;
    account.outStanding = 0;
    await account.save();

    res.status(200).json({
        success: true,
        message: "Account Reset Successfully!",
        account
    });
})

export const updateAccount = catchAsyncErrors(async (req, res, next)=>{
    const account = await Account.find();
    if(!account){
        return next(new ErrorHandler("Account not Found! Add One Account."))
    }    
    account.donatedAmount = req.body.donatedAmount;
    account.currentStock = req.body.currentStock;
    account.salaryPerMonth = req.body.salaryPerMonth;
    account.outStanding = req.body.outStanding;
    await account.save();

    res.status(200).json({
        success: true,
        message: "Account Updated Successfully!",
        account
    });
})

export const accountDetails = catchAsyncErrors(async (req, res, next)=>{
    const account = await Account.find();
    if(!account){
        return next(new ErrorHandler("Account not Found! Add an Account."))
    }
    res.status(200).json({
        success: true,
        message: "Account Details!",
        account
    }); 
})

export const accDetailsServiceAdmin = catchAsyncErrors(async (req, res, next)=>{
    const account = await Account.find();
    if(!account){
        return next(new ErrorHandler("Account not Found! Add an Account."))
    }
    res.status(200).json({
        success: true,
        message: "Account Details!",
        account
    });
})
