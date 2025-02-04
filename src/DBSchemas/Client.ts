import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IClient extends Document {
    name: string;
    adresse: string
    email: string;
    telephone : number;
    historiqueAchat : [string];
    status : boolean;
    
    
}

// Définir le schéma Mongoose
const ClientSchema: Schema = new Schema({
    name: { type: String, required: true },
    adresse: { type: String },
    email: { type: String },
    telephone: { type: Number },
    historiqueAchat: { type: [String] },
    status: { type: Boolean, default: true}
});

// Exporter le modèle
export default mongoose.model<IClient>('User', ClientSchema);