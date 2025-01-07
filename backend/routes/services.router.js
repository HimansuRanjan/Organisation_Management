import express from 'express';
import { isAdminAuthenticated } from '../middlewares/auth.js';
import { addService, adminLogin, deleteService, forgotAdminPassword, getAllService, getServiceAdmin, resetAdminPassword, serviceAdminLogout, updateServiceAdminData, updateServiceAdminPassword, updateServiceAdminProfile, updateServiceAdminPwd } from '../controllers/services.controller.js';
import { isServiceAdminAuthenticated } from '../middlewares/serviceAuth.js';


const router = express.Router();
// As an Admin of Organization 
router.post("/new", isAdminAuthenticated, addService);
router.get("/getall", isAdminAuthenticated, getAllService);
router.delete("/delete/:id", isAdminAuthenticated, deleteService);
router.put("/update/:id", isAdminAuthenticated, updateServiceAdminProfile);
router.put("/update/pwd/:id", isAdminAuthenticated, updateServiceAdminPassword);


// As an Admin of a specific Service
router.post("/admin/login", adminLogin);
router.get("/admin/logout", serviceAdminLogout);
router.get("/admin/me", isServiceAdminAuthenticated, getServiceAdmin)
router.put("/admin/update", isServiceAdminAuthenticated, updateServiceAdminData);
router.put("/admin/update/pwd", isServiceAdminAuthenticated,updateServiceAdminPwd);
router.post("/admin/forgot/password", forgotAdminPassword);
router.put("/admin/password/reset/:token", resetAdminPassword);

export default router;