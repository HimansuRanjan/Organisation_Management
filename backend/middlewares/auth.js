import jwt from 'jsonwebtoken';
import { catchAsyncErrors } from './catchAsyncError.js';
import ErrorHandler from './error.js';
import { Admin } from '../models/AdminSchema.js';

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next)=>{
    const { token } = req.cookie;
    if(!token){
        return next(new ErrorHandler("Admin not Authenticated", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await Admin.findById(decoded.id);
    
    next();
});

export const isAuthenticated = catchAsyncErrors(async (req, res, next)=>{
    const { token } = req.cookie;
    if(!token){
        return next(new ErrorHandler("Admin not Authenticated", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await Admin.findById(decoded.id);
    
    next();
});
