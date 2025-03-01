import { Request, Response } from "express";
import ProductSchema, { IProduct } from "../DBSchemas/Product";

export async function getAllProduct(req: Request, res: Response) {
    try {
        const products = await ProductSchema.find();
        res.status(200).json(products);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des produits : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' })

    }
}

export async function createProduct(req: Request, res: Response) {
    try {
        const { name, description, stock, prix } = await req.body;

        if (!name || !description || !stock || !prix) {
            res.status(400).json({ message: 'Tous les champs sont requis : name, description, stock, prix', name, description, stock });
            return;
        }

        const newProduct: IProduct = new ProductSchema({ name, description, stock, prix });

        const savedProduct = await newProduct.save();

        res.status(201).json({ message: 'Produit créé avec succès', data: savedProduct });
    } catch (err: any) {

        if (err.code === 11000) {
            res.status(400).json({ message: 'Produit déjà utilisé' });
            return;
        }
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, stock, prix } = req.body;

        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }

        const updatedProduct = await ProductSchema.findByIdAndUpdate(
            id,
            { name, description, stock, prix },
            { new: true }
        ).exec();

        if (!updatedProduct) {
            res.status(404).send("Produit non trouver");
            return;
        }

        res.status(200).json({message :"Produit modifié avec succès" ,updatedProduct})
    } catch (err) {
        res.status(500).send("Une erreur est survenu lors de la modification du produit");
        return;
    }
};