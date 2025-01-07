import express from 'express';
import { forgotPassword, getAdminData, logout, resetPassword, signin, signup, updateAdminProfile, updatePassword } from '../controllers/admin.contoller.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';


const router = express.Router();

router.post("/signup", signup);
router.post("/login", signin);
router.get("/logout", isAdminAuthenticated, logout);
router.get("/getAdmin", isAdminAuthenticated, getAdminData);
router.put("/update/profile", isAdminAuthenticated, updateAdminProfile);
router.put("/update/password", isAdminAuthenticated, updatePassword);
router.post("/forgot/password", isAdminAuthenticated, forgotPassword);
router.put("/password/reset/:token", isAdminAuthenticated, resetPassword);


export default router;