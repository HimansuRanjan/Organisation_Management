import express from 'express';
import { isServiceAdminAuthenticated } from '../middlewares/serviceAuth.js';
import { addExpenses, deleteExpenses, getAllExpenses, getExpenseDetails, getExpensesByMonth, updateExpenseDetails } from '../controllers/expenses.controller.js';


const router = express.Router();

// for an Service Admin
router.post("/add", isServiceAdminAuthenticated, addExpenses);
router.get("/getAll", isServiceAdminAuthenticated, getAllExpenses);
router.get("/get/month", isServiceAdminAuthenticated, getExpensesByMonth);
router.get("/details/:id", isServiceAdminAuthenticated, getExpenseDetails);
router.put("/update/:id", isServiceAdminAuthenticated, updateExpenseDetails);
router.delete("/delete/:id", isServiceAdminAuthenticated, deleteExpenses);


export default router;