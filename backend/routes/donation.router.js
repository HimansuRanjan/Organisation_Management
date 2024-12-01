import express from 'express';
import { isServiceAdminAuthenticated } from '../middlewares/serviceAuth.js';
import { addDonator, createDonation, donateByNonAdmin, donationDetails, donatorDetails, getAllDonation, removeDonation, removeDonator } from '../controllers/donation.controller.js';

const router = express.Router();

router.post("/add", isServiceAdminAuthenticated, createDonation)
router.delete("/remove/:id", isServiceAdminAuthenticated, removeDonation);
router.get("/all", isServiceAdminAuthenticated, getAllDonation);
router.get("/details/:id", isServiceAdminAuthenticated, donationDetails);
router.get('/donator/details/:id', isServiceAdminAuthenticated, donatorDetails);
router.post('/add/donator', isServiceAdminAuthenticated, addDonator);
router.delete('/remove/donator/:id', isServiceAdminAuthenticated, removeDonator);

// For Normal People
router.post("/donate", donateByNonAdmin);


export default router;