import { Request, Response } from 'express';
import ProductSchema from '../DBSchemas/Product'; // Assurez-vous que le chemin est correct
import Commande from '../DBSchemas/Commande';

// Méthode pour afficher les stocks par produit
export async function getStocks(req: Request, res: Response): Promise<void> {
    try {
        // Trouver tous les produits avec leur nom et stock
        const products = await ProductSchema.find({}, 'name stock').exec();

        if (!products || products.length === 0) {
            res.status(404).json({ message: 'Aucun produit trouvé' });
            return;
        }

        // Renvoi de la réponse avec les produits et leurs stocks
        res.status(200).json({
            message: 'Stocks récupérés avec succès.',
            data: products
        });
    } catch (err: any) {
        console.error('Erreur lors de la récupération des stocks : ', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des stocks.' });
    }
}



export async function getTotalCommandesByMonth(req: Request, res: Response) {
    const { month, year } = req.params; // mois (1-12) et année (ex. 2025)
  
    try {
      // Vérification des paramètres
      if (!month || !year) {
        res.status(400).json({ message: 'Le mois et l\'année sont requis' });
        return;
      }
  
      // Calculer le premier et dernier jour du mois
      const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
      const lastDay = new Date(parseInt(year), parseInt(month), 0); // Dernier jour du mois
  
      // Récupérer les commandes créées entre le premier et le dernier jour du mois, excluant les annulées
      const commandes = await Commande.find({
        dateCreation: { $gte: firstDay, $lte: lastDay },
        statuts: { $ne: 'annulée' }  // Exclure les commandes avec statut 'annulée'
      });
  
      // Si aucune commande n'est trouvée
      if (commandes.length === 0) {
        res.status(404).json({ message: 'Aucune commande trouvée pour ce mois' });
        return;
      }
  
      // Calculer le total des montants des commandes
      const totalAmount = commandes.reduce((acc, commande) => acc + commande.total, 0);
  
      // Retourner le total des commandes du mois
      res.status(200).json({ message: 'Total des commandes récupéré avec succès', totalAmount });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: err.message || 'Erreur lors de la récupération du total des commandes' });
    }
  }

