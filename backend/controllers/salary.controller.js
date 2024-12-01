import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Salary } from "../models/SalarySchema.js";
import { Employee } from "../models/EmployeeSchema.js";

export const creditSalary = catchAsyncErrors(async (req, res, next)=>{
    const { amount, salaryMode} = req.body;
    const { id } = req.params;
    if(!amount || !salaryMode){
        return next(new ErrorHandler("Provide Mandetory Fields!", 400));
    }
    const employee = await Employee.findById(id);
    if(!employee){
        return next(new ErrorHandler("Employee not Found!", 400));
    }
    if(employee.salary >= amount){
        employee.outStandSalary = employee.outStandSalary + (employee.salary - amount);
    }else{
        employee.outStandSalary = employee.outStandSalary - (amount - employee.salary);
    }

    const salaryData = {
        employee: id,
        amount: amount,
        transactionId: Array.from({ length: 15 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?'[Math.floor(Math.random() * 84)]).join(''),
        salaryDate: Date.now(),
        salaryMode: salaryMode,
    }

    if(req.files && req.files.salaryReceipt){
        const salaryReceipt = req.files.salaryReceipt;
        // Uploading Avatar to cloudnary
        const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
            salaryReceipt.tempFilePath,
        { folder: "SALARY_RECEIPT" }
        );

        salaryData.salaryReceipt = {
        public_id: cloudinaryResponseAvatar.public_id,
        url: cloudinaryResponseAvatar.secure_url,
        }
    }

    const salary = await Salary.create(salaryData);
    await employee.save();

    res.status(200).json({
        success: true,
        message:  `Salary Credited to ${employee.empName}!`,
        salary
    });   
});

export const getAllSalary = catchAsyncErrors(async (req, res, next)=>{
    const salary = await Salary.find();
    res.status(200).json({
        success: true,
        message: `All Salaries`,
        salary
    });
});

export const getSalaryDetails = catchAsyncErrors(async (req, res, next)=>{
    const { id } = req.params;
    const salary = await Salary.findById(id);
    res.status(200).json({
        success: true,
        message: `Salary`,
        salary
    });
});

export const getByMonthSalary = catchAsyncErrors(async (req, res, next)=>{
    const { year, month } = req.body;
    if(!year || !month){
        return next(new ErrorHandler("Please provide both Month and Year", 400));
    }
    // Define the start and end dates for the specified month
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 1); // First day of the next month

    const salaries = await Salary.find({
        salaryData: { $gte: startDate, $lt: endDate }
    });

    res.status(200).json({
        success: true,
        message: `All Salaries of ${year} - ${month}`,
        salaries
    });
});

export const generateBillSalary = catchAsyncErrors(async (req, res, next)=>{
    
});

export const getAllAdmin = catchAsyncErrors(async (req, res, next)=>{
    const salary = await Salary.find();
    res.status(200).json({
        success: true,
        message: `All Salaries`,
        salary
    });
});

export const getByMonthSalaryAdmin = catchAsyncErrors(async (req, res, next)=>{
    const { year, month } = req.body;
    if(!year || !month){
        return next(new ErrorHandler("Please provide both Month and Year", 400));
    }
    // Define the start and end dates for the specified month
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 1); // First day of the next month

    const salaries = await Salary.find({
        salaryData: { $gte: startDate, $lt: endDate }
    });

    res.status(200).json({
        success: true,
        message: `All Salaries of ${year} - ${month}`,
        salaries
    });
});

