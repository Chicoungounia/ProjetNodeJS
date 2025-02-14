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

//  méthode  pour modifier une commande existante
export async function modifyCommande(req: Request, res: Response) {
  const { commandeId } = req.params;  // ID de la commande à modifier
  const { produit, quantité } = req.body;  // Nouvelles informations pour la commande

  try {
    // Vérifier si la commande existe
    const commande = await Commande.findById(commandeId);
    if (!commande) {
     res.status(404).json({ message: 'Commande non trouvée' });
     return 
    }

    // Vérifier que les informations requises sont présentes
    if (!produit || !quantité || produit.length !== quantité.length) {
      res.status(400).json({ message: 'Les informations sont incomplètes ou invalides' });
      return 
    }

    // Vérifier la disponibilité du stock pour les nouveaux produits et quantités
    const produitsAvecStock = await Promise.all(
      produit.map(async (nomProduit: string, index: number) => {
        const product = await Product.findOne({ name: nomProduit });
        if (!product) {
          throw new Error(`Produit non trouvé : ${nomProduit}`);
        }

        if (product.stock < quantité[index]) {
          throw new Error(`Stock insuffisant pour le produit: ${nomProduit}. Disponible: ${product.stock}, demandé: ${quantité[index]}`);
        }

        // Mettre à jour le stock du produit
        product.stock -= quantité[index];
        await product.save();

        return {
          name: product.name,
          prixUnitaire: product.prix,
          quantity: quantité[index]
        };
      })
    );

    // Calculer le nouveau total de la commande
    const total = produitsAvecStock.reduce((acc, item, index) => {
      return acc + (item.prixUnitaire * quantité[index]);
    }, 0);

    // Mettre à jour la commande
    commande.produit = produitsAvecStock.map(item => item.name);
    commande.quantité = quantité;
    commande.prixUnitaire = produitsAvecStock.map(item => item.prixUnitaire);
    commande.total = total;
    
    // Sauvegarder la commande modifiée
    const updatedCommande = await commande.save();

    res.status(200).json({ message: 'Commande modifiée avec succès', updatedCommande });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Erreur lors de la modification de la commande' });
  }
}

// Méthode pour modifier le statut d'une commande
export async function modifyCommandeStatuts(req: Request, res: Response) {
  const { commandeId} = req.params;
  const { statuts} = req.body;

  try {
    
    // Trouver la commande par son ID
    const commande = await Commande.findById(commandeId);
    if (!commande) {
    res.status(404).json({ message: 'Commande non trouvée' });
    return 
    }

    

    // Sauvegarder les changements
    const updatedCommandeData = {
      statuts,
      dateModifStatuts : new Date()
    }
    
    const updatedCommande = await Commande.findByIdAndUpdate(commandeId, updatedCommandeData, { new: true });

    // Répondre avec la commande mise à jour
    res.status(200).json({ message: 'Statut de la commande modifié avec succès', updatedCommande });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Erreur lors de la modification du statut' });
  }
}

export async function cancelCommande(req: Request, res: Response) {
  const { commandeId } = req.params;
  

  try {
    // Trouver la commande à supprimer
    const commande = await Commande.findById(commandeId);
    if (!commande) {
     res.status(404).json({ message: 'Commande non trouvée' });
     return 
    }

    // Mettre à jour les stocks des produits
    const produits = commande.produit;
    const quantités = commande.quantité;

    await Promise.all(
      produits.map(async (nomProduit: string, index: number) => {
        const product = await Product.findOne({ name: nomProduit });
        if (!product) {
          throw new Error(`Produit non trouvé : ${nomProduit}`);
        }

        // Ajouter la quantité de retour au stock
        product.stock += quantités[index];
        await product.save();
      })
    );

    // Supprimer la commande du tableau historiqueAchat du client
    const client = await Client.findById(commande.clientId);
    if (!client) {
     res.status(404).json({ message: 'Client non trouvé' });
     return 
    }

    // Retirer l'ID de la commande du tableau historiqueAchat
    client.historiqueAchat = client.historiqueAchat.filter(
      (id: string) => id.toString() !== commandeId
    );
    await client.save();

    // Supprimer la commande
    await Commande.findByIdAndDelete(commandeId);

    // Répondre avec un message de succès
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Erreur lors de la suppression de la commande' });
  }
}

