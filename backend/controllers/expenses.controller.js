import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Expenses } from "../models/ExpensesSchema.js";

export const addExpenses = catchAsyncErrors(async (req, res, next)=>{
    const { productName, amount, date } = req.body;
    const expenses = await Expenses.create({
        productName,
        amount,
        date,
        serviceType: req.serviceUser._id
    });

    res.status(200).json({
        success: true,
        message: "New Expenses Added",
        expenses
    });
});

export const getAllExpenses = catchAsyncErrors(async (req, res, next)=>{
    const expenses = await Expenses.find({
        serviceType: req.serviceUser._id,
    }); 
    res.status(200).json({
        success: true,
        message: "All Expenses",
        expenses
    });
});

export const getExpensesByMonth = catchAsyncErrors(async (req, res, next)=>{
    const { year, month } = req.body;
    if(!year || !month){
        return next(new ErrorHandler("Please provide both Month and Year", 400));
    }
    // Define the start and end dates for the specified month
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 1); // First day of the next month

    const expenses = await Expenses.find({
        serviceType: req.serviceUser._id,
        date: { $gte: startDate, $lt: endDate }
    });

    res.status(200).json({
        success: true,
        message: "All Expenses",
        expenses
    });
});

export const getExpenseDetails = catchAsyncErrors(async (req, res, next)=>{
    const expense = await Expenses.findById(req.params.id);
    if(!expense){
        return next(new ErrorHandler("Expenses not Found!", 400));
    } 
    res.status(200).json({
        success: true,
        expense
    });
});

export const deleteExpenses = catchAsyncErrors(async (req, res, next)=>{
    const expense = await Expenses.findById(req.params.id);
    if(!expense){
        return next(new ErrorHandler("Expenses not Found!", 400));
    }
    
    await expense.deleteOne();
    res.status(200).json({
        success: true,
        message: "Expense Removed!"
    });
});

export const updateExpenseDetails = catchAsyncErrors(async (req, res, next)=>{
    const expense = await Expenses.findById(req.params.id);
    if(!expense){
        return next(new ErrorHandler("Expense not Found!", 400));
    }
    const expenseData = {
        productName: req.body.productName,
        amount: req.body.amount,
        date: req.body.date,
    }

    const updatedExpense = await Expenses.findByIdAndUpdate(req.params.id, expenseData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Expenses Details Updated!",
        updatedExpense
    });
});
