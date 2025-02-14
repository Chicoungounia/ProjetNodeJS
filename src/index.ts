import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import clientRoutes from "./routes/clientRoutes";
import productRoutes from "./routes/productRoutes";
import commandeRoutes from "./routes/commandeRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

//Création d'un serveur Express
const app = express();

// Utilisation de cookie-parser
app.use(cookieParser());

//Chargement des variables d'environnement
dotenv.config();

//Définition du port du serveur
const PORT = process.env.PORT;
console.log(PORT);

//Config du serveur par défaut
app.use(express.json());

// Connecter MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connecté avec succès');
    } catch (err) {
        console.error('Erreur lors de la connexion à MongoDB:', err);
        process.exit(1);
    }
};
connectDB();

//Ajouter ici les routes
app.use('/auth', authRoutes);
app.use('/api', clientRoutes);
app.use('/api', productRoutes);
app.use('/commande', commandeRoutes);
app.use('/dashboard', dashboardRoutes);



//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(3000, () => {
    console.log('Server is running on port :', PORT);
});
