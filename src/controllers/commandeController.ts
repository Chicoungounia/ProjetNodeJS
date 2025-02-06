import { Request, Response } from 'express';
import Commande from "../DBSchemas/Commande";
import Client from "../DBSchemas/Client";
import Product from "../DBSchemas/Product"; // Assurez-vous d'importer votre modèle Product

export async function createCommande(req: Request, res: Response) {
  const { clientId, produit, quantité } = req.body;

  try {
    // Vérifier si les informations requises sont présentes
    if (!clientId || !produit || !quantité) {
      res.status(400).json({ message: 'Les informations sont incomplètes' });
      return;
    }

    // Vérifier que la quantité demandée ne dépasse pas le stock
    const produitsAvecStock = await Promise.all(
      produit.map(async (nomProduit: string, index: number) => {
        const product = await Product.findOne({ name: nomProduit });
        if (!product) {
          throw new Error(`Produit non trouvé : ${nomProduit}`);
        }

        if (product.stock < quantité[index]) {
          throw new Error(`Stock insuffisant pour le produit: ${nomProduit}. Disponible: ${product.stock}, demandé: ${quantité[index]}`);
        }

        // Réduire le stock du produit
        product.stock -= quantité[index];
        await product.save();

        return {
          name: product.name,
          prixUnitaire: product.prix,
          quantity: quantité[index]
        };
      })
    );

    // Calculer le total de la commande
    const total = produitsAvecStock.reduce((acc, item, index) => {
      return acc + (item.prixUnitaire * quantité[index]);
    }, 0);

    // Créer la commande avec les produits et leurs prix
    const newCommande = new Commande({
      clientId,
      produit: produitsAvecStock.map(item => item.name),
      quantité,
      prixUnitaire: produitsAvecStock.map(item => item.prixUnitaire),
      total,  
    });

    // Sauvegarder la commande
    const savedCommande = await newCommande.save();

    // Ajouter l'ID de la commande au tableau historiqueAchat du client
    const client = await Client.findById(clientId);
    if (!client) {
      res.status(404).json({ message: 'Client non trouvé' });
      return;
    }

    client.historiqueAchat.push(savedCommande._id as string);
    await client.save();

    // Répondre avec la commande créée et un message de succès
    res.status(201).json({ message: 'Commande créée avec succès', savedCommande });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Erreur lors de la création de la commande' });
  }
}

