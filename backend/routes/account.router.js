import express from 'express';
import { isAdminAuthenticated } from '../middlewares/auth.js';
import { isServiceAdminAuthenticated } from '../middlewares/serviceAuth.js';
import { accDetailsServiceAdmin, accountDetails, createAccount, resetAccount, updateAccount } from '../controllers/account.controller.js';

const router = express.Router();

// For Admin 
router.post("/create", isAdminAuthenticated, createAccount);
router.put('/reset', isAdminAuthenticated, resetAccount);
router.put('/update', isAdminAuthenticated, updateAccount);
router.get("/details", isAdminAuthenticated, accountDetails);

//for Service Admin
router.get("/details/acc", isServiceAdminAuthenticated, accDetailsServiceAdmin);

export default router;