import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import UserSchema, { IUser } from '../DBSchemas/User';
import { generateToken, verifyToken } from '../utils/JWTUtils';
import { JwtPayload } from 'jsonwebtoken';

export async function register(req:Request, res:Response){
    try{
    const {name, password,isActive} = req.body;
    if(!name || !password){
        res.status(400).send('Champs manquant: name et/ou password');
        return 
    }
    //hashage
    const hashedPassword= await hashPassword(password);

    //creer nouvel utilisateur
    const newUser:IUser= new UserSchema({name, hashedPassword, isActive});
    //on sauvegarde
    const savedUser= await newUser.save();

    //on supprime le hashed password
    savedUser.hashedPassword='';

    res.status(201).json({message: 'Utilisateur créé avec succès',data: savedUser});
} catch(err:any){
    //erreur de duplication 
    if(err.code===11000){
        res.status(400).json({message: 'Ce nom est déjà utilisé'});
        return 
    }
    res.status(500).json({message: 'Erreur interne', error: err.message});

}
}

export async function login(req:Request, res:Response){
    const {name,password}=req.body;
    try{
         const user= await  UserSchema.findOne({name});
            if(!user){
                res.status(404).json({message: 'Utilisateur non trouvé, ce nom n\'existe pas'});
                return 
            }
            const isPasswordValid= await verifyPassword(password,user.hashedPassword);

            if(!isPasswordValid){
                res.status(401).json({message: 'Mot de passe incorrect'});
                return 
            }
            const token = generateToken({ id: user._id, name: user.name, role: user.role });
            res.cookie('jwt',token,{httpOnly:true, sameSite:'strict'});
            res.status(200).json({message: 'Connexion réussie'});

    }catch(error:any){
        res.status(500).json({message: error.message});
    }
}

export async function deleteUser(req: Request, res: Response) {
    const { id } = req.params; // L'ID de l'utilisateur à supprimer provient des paramètres de la requête
    const token = req.cookies.jwt;  // Récupérer le token JWT depuis les cookies

    try {
        // Vérifier si le token est présent
        if (!token) {
            res.status(401).json({ message: 'Non autorisé, veuillez vous connecter' });
            return;
        }

        // Décoder le token pour obtenir les informations de l'utilisateur
        const decoded = verifyToken(token);  // Décoder le token pour obtenir les données de l'utilisateur

        // Vérifier si le token est valide et contient un rôle
        if (!decoded || !(decoded as JwtPayload).role) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        console.log('Token décodé:', decoded); // Pour déboguer et vérifier les données du token
        
      

        // Chercher l'utilisateur avec l'ID donné
        const user = await UserSchema.findById(id);

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // Supprimer l'utilisateur
        await user.deleteOne();

        res.status(200).json({ message: `Utilisateur ${user.name} à été supprimé avec succès` });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}
