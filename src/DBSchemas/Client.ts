import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
    name: string;
    adresse: string
    email: string;
    telephone : number;
    historiqueAchat : string[];
    status: 'actif' | 'inactif'; // Utilisation de l'enum
    
    
}

// Définir le schéma Mongoose
const ClientSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    adresse: { type: String, required: true },
    email: { type: String },
    telephone: { type: Number },
    historiqueAchat: { type: [String], default: [] },
    status: { type: String, enum: ['actif', 'inactif'], default: 'actif' }});

// Exporter le modèle
export default mongoose.model<IClient>('Client', ClientSchema);