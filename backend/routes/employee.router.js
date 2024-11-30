import express from 'express';
import { isAdminAuthenticated } from '../middlewares/auth.js';
import { addNewEmployee, deleteEmployee, empLogin, getAllEmployee, getEmployeeDetails, updateEmpDetails } from '../controllers/employee.controller.js';


const router = express.Router();

// for an Admin
router.post("/new", isAdminAuthenticated, addNewEmployee);
router.get("/getAll", isAdminAuthenticated, getAllEmployee);
router.get("/details/:id", isAdminAuthenticated, getEmployeeDetails);
router.put("/update/:id", isAdminAuthenticated, updateEmpDetails);
router.delete("/delete/:id", isAdminAuthenticated, deleteEmployee);

//for an Employee 
router.post("/login", empLogin);




export default router;