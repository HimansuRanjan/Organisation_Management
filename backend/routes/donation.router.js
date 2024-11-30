import express from 'express';
import { isServiceAdminAuthenticated } from '../middlewares/serviceAuth.js';

const router = express.Router();

router.post("/add",)
router.delete("/remove/:id",);
router.get("/all");
router.get('/donator/details/:id');
router.post('/add/donator');
router.delete('/remove/donator');



export default router;