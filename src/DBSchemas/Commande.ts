import mongoose, { Schema, Document } from 'mongoose';

export interface ICommande extends Document {
    clientId : string;
    produit: string[];
    quantité: number[];
    prixUnitaire: number[];
    total: number;
    dateCreation: Date;
    dateModifStatuts : Date;  
    statuts: 'en attente' | 'expédiée' | 'livrée' | 'annulée';
    
}

// Définir le schéma Mongoose
const CommandeSchema: Schema = new Schema({
    clientId : { type: String, required: true },
    produit: { type: [String], required: true},
    quantité: { type: [Number], required: true },
    prixUnitaire : { type: [Number], required: true },
    total: { type: Number, required: true },
    dateCreation: { type: Date, default: Date.now },
    dateModifStatuts: { type: Date, default: Date.now },
    statuts: { type: String, enum: ['en attente', 'expédiée', 'livrée', 'annulée'], default: 'en attente' }
});    

// Exporter le modèle
export default mongoose.model<ICommande>('Commande', CommandeSchema);