import { Router } from "express";
import { createCommande } from "../controllers/commandeController";

const router = Router();

router.post('/create', createCommande);

export default router;