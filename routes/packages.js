import express from "express";
import PackageController from '../controllers/packageController.js';
import { authenticateToken } from "../config/supabase.js";

const router = express.Router();

router.get('/', authenticateToken,PackageController.getPackages);
router.get('/purchase', authenticateToken, PackageController.getPackagePurchaseLink);
router.post('/purchase', PackageController.postPackagePurchaseWebhook);

export default router;