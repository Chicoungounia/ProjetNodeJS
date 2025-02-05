import express from 'express';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { isAdmin } from '../middlewares/verifyRole';
import { createClient, getClientInactif, modifClient, modifClientStatus } from '../controllers/ClientController';

const router = express.Router();

// Route pour créer une client
router.post('/client', verifyTokenMiddleware, createClient);
// Route pour modifier un client
router.put('/client/:id', verifyTokenMiddleware, modifClient);
router.put('/clientStatus/:id', isAdmin ,verifyTokenMiddleware, modifClientStatus);
// Route pour récupérer la liste des clients inactifs
router.get('/clientInactifs', verifyTokenMiddleware, getClientInactif);


export default router;