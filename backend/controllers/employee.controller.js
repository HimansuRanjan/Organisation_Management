import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Employee } from "../models/EmployeeSchema.js";
import { v2 as cloudinary } from 'cloudinary';

export const addNewEmployee = catchAsyncErrors(async (req, res, next)=>{
    const { empName, email, phoneNo, doj, salary } = req.body;
    const employee = await Employee.create({
        empName,
        email,
        phoneNo,
        doj,
        salary
    });

    res.status(200).json({
        success: true,
        message: "New Employee Added",
        employee
    });
});

export const getAllEmployee = catchAsyncErrors(async (req, res, next)=>{
    const employees = await Employee.find(); 
    res.status(200).json({
        success: true,
        message: "All Employees",
        employees
    });
});

export const getEmployeeDetails = catchAsyncErrors(async (req, res, next)=>{
    const employee = await Employee.findById(req.params.id);
    if(!employee){
        return next(new ErrorHandler("Employee not Found!", 400));
    } 
    res.status(200).json({
        success: true,
        employee
    });
});

export const deleteEmployee = catchAsyncErrors(async (req, res, next)=>{
    const employee = await Employee.findById(req.params.id);
    if(!employee){
        return next(new ErrorHandler("Employee not Found!", 400));
    }
    
    await employee.deleteOne();
    res.status(200).json({
        success: true,
        message: "Employee Removed from Organization!"
    });
});

export const updateEmpDetails = catchAsyncErrors(async (req, res, next)=>{
    const employee = await Employee.findById(req.params.id);
    if(!employee){
        return next(new ErrorHandler("Employee not Found!", 400));
    }
    const employeeData = {
        empName: req.body.empName,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        doj: req.body.doj,
        salary: req.body.salary,
        outStandSalary: req.body.outStandSalary
    }
    if(req.files && req.files.photo){
        const photo = req.files.photo;
        if(employee.photo.public_id){ // If present Earlier then delete 
            const profileImageId = employee.photo.public_id;
            await cloudinary.uploader.destroy(profileImageId);
        }
        // Re-Uploading Avatar to cloudnary
        const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
            photo.tempFilePath,
        { folder: "EMPLOYEE_IMAGE" }
        );

        employeeData.photo = {
        public_id: cloudinaryResponseAvatar.public_id,
        url: cloudinaryResponseAvatar.secure_url,
        };
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, employeeData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Employee Profile Updated!",
        updatedEmployee
    });
});

export const empLogin = catchAsyncErrors(async (req, res, next)=>{
    const { email, phoneNo } = req.body;
    if(!email || !phoneNo){
        return next(new ErrorHandler("Provide Email and phoneNo", 400));
    }
    const emp = await Employee.findOne({email, phoneNo});
    if(!emp){
        return next(new ErrorHandler("Employee Not Found!", 400));
    }
    res.status(201).json({
        success: true,
        message: "User Found & Logged In!",
        emp
    })
})


