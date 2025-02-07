import { Request, Response } from "express";
import Client from "../DBSchemas/Client";


export async function createClient(req: Request, res: Response) {
    try {
      const { name, adresse, email, telephone  } = req.body;
  
      // Vérifier si les informations requises sont présentes
      if (!name || !adresse) {
          res.status(400).json({ message: 'Nom et adresse sont obligatoires' });
        return 
      }
  
      // Créer une nouvelle chanson
      const newClient = new Client({
        name,
        adresse,
        email,
        telephone,
      });
  
      const savedClient = await newClient.save();
  
      // Répondre avec la chanson créée
      res.status(201).json({message :"client crée avec succès" ,savedClient});
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: 'Ce client à deja été créer' });
    }
  }

  // Modifier un client
export async function modifClient(req: Request, res: Response) {
    const { id } = req.params;
    const { name, adresse, email, telephone } = req.body;

    try {
        // Récupérer le client par son ID
        const client = await Client.findById(id);

        if (!client) {
        res.status(404).json({ message: 'Client non trouvé' });
        return 
        }

        // Ne pas permettre la modification du champ "status"
        const updatedClientData = {
            name,
            adresse,
            email,
            telephone,
        };

        // Mettre à jour les informations du client
        const updatedClient = await Client.findByIdAndUpdate(id, updatedClientData, { new: true });

        res.status(200).json({ message: 'Client modifié avec succès', updatedClient });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la modification du client' });
    }
}

// Modifier un client
export async function modifClientStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status} = req.body;

    try {
        // Récupérer le client par son ID
        const client = await Client.findById(id);

        if (!client) {
        res.status(404).json({ message: 'Client non trouvé' });
        return 
        }

        // modification du champ "status"
        const updatedClientData = {
            status
        };

        // Mettre à jour les informations du client
        const updatedClient = await Client.findByIdAndUpdate(id, updatedClientData, { new: true });

        res.status(200).json({ message: 'Le status du Client à été modifié avec succès', updatedClient });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la modification du status du client' });
    }
}
  
// Récupérer la liste des clients inactifs
export async function getClientInactif(req: Request, res: Response) {
    try {
        // Récupérer tous les clients avec un statut inactif
        const inactiveClients = await Client.find({ status: "inactif" });

        // Vérifier si des clients inactifs existent
        if (inactiveClients.length === 0) {
            res.status(404).json({ message: 'Aucun client inactif trouvé' });
            return;
        }

        // Renvoyer la liste des clients inactifs
        res.status(200).json({ message: 'Clients inactifs récupérés avec succès', inactiveClients });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la récupération des clients inactifs' });
    }
}
