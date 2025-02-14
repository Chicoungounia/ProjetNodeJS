import express from 'express';
import { getStocks, getTotalCommandesByMonth } from '../controllers/dashboardController';  // Assurez-vous du bon chemin d'importation

const router = express.Router();

// Route pour récupérer les stocks
router.get('/stocks', getStocks);
router.get('/commandes/:month/:year', getTotalCommandesByMonth);

export default router;
