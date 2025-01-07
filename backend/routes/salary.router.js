import express from 'express';
import { isAdminAuthenticated } from '../middlewares/auth.js';
import { isAccountAdminAuthenticated } from '../middlewares/serviceAuth.js';
import { creditSalary, generateBillSalary, getAllAdmin, getAllSalary, getByMonthSalary, getByMonthSalaryAdmin, getSalaryDetails } from '../controllers/salary.controller.js';


const router = express.Router();

//Salary Can be given by only Account Admin  
router.post("/credit/:id", isAccountAdminAuthenticated, creditSalary);
router.get('/getall', isAccountAdminAuthenticated, getAllSalary);
router.get('/details/:id', isAccountAdminAuthenticated, getSalaryDetails);
router.get('/get/month', isAccountAdminAuthenticated, getByMonthSalary);
router.get("/generate/bill/:id", isAccountAdminAuthenticated, generateBillSalary);

//Details Can be Seen Admin
router.get('/admin/getall', isAdminAuthenticated, getAllAdmin);
router.get('/admin/get/month', isAdminAuthenticated, getByMonthSalaryAdmin);

export default router;