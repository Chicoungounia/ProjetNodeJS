import mongoose, { Schema, Document } from 'mongoose';

export interface ICommande extends Document {
    clientId : string;
    produit: string[];
    quantité: number[];
    prixUnitaire: number[];
    total: number;
    statuts : 'en attente' | 'expédier' | 'livrer';
    dateCreation: Date;
    dateModifStatus : Date;  
    
}

// Définir le schéma Mongoose
const CommandeSchema: Schema = new Schema({
    clientId : { type: String, required: true },
    produit: { type: [String], required: true},
    quantité: { type: [Number], required: true },
    prixUnitaire : { type: [Number], required: true },
    total: { type: Number, required: true },
    statuts: { type: String, enum: ['en attente', 'expédier', 'livrer'], default: 'en attente' },
    dateCreation: { type: Date, default: Date.now },
    dateModifStatus: { type: Date, default: Date.now }})
    

// Exporter le modèle
export default mongoose.model<ICommande>('Commande', CommandeSchema);