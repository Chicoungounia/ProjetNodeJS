import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/JWTUtils';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies ? req.cookies.jwt : null;  // Vérifie si req.cookies est défini
    
    if (!token) {
        res.status(401).json({ message: 'Non autorisé, veuillez vous connecter' });
        return;
    }

    const decoded = verifyToken(token);  // Décoder le token pour obtenir les informations de l'utilisateur

    if (!decoded || typeof decoded === 'string' || decoded.role !== 'admin') {
        res.status(403).json({ message: 'Accès interdit, vous devez être administrateur pour accéder à cette ressource' });
        return;
    }

    // Si le rôle est admin, passer à la route suivante
    next();}
