import express from 'express';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post("/create", isAdminAuthenticated);
router.put('/reset', isAdminAuthenticated);
router.get("/details", isAdminAuthenticated);




export default router;