import jwt from 'jsonwebtoken';
import { catchAsyncErrors } from './catchAsyncError.js';
import ErrorHandler from './error.js';
import { Service } from '../models/SecviceSchema.js';

export const isServiceAdminAuthenticated = catchAsyncErrors(async (req, res, next)=>{
    const { token } = req.cookie;
    if(!token){
        return next(new ErrorHandler("Service Admin not Authenticated", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SERVICE_SECRET_KEY);
    req.serviceUser = await Service.findById(decoded.id);
    
    next();
});