import { Router } from "express";
import { createCommande, modifyCommande, modifyCommandeStatuts } from "../controllers/commandeController";

const router = Router();

router.post('/create', createCommande);
router.put('/modifier/:commandeId', modifyCommande)
router.put('/modifier/statuts/:commandeId', modifyCommandeStatuts)

export default router;