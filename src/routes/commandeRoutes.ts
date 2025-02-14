import { Router } from "express";
import { cancelCommande, createCommande, modifyCommande, modifyCommandeStatuts } from "../controllers/commandeController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

router.post('/create', verifyTokenMiddleware, createCommande);
router.put('/modifier/:commandeId',verifyTokenMiddleware, modifyCommande)
router.put('/modifier/statuts/:commandeId',verifyTokenMiddleware, modifyCommandeStatuts)
router.put('/cancel/:commandeId',verifyTokenMiddleware, cancelCommande)

export default router;