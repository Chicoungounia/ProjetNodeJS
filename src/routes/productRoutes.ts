import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { getAllProduct, createProduct, updateProduct } from "../controllers/productController";

const router = Router();

router.get('/productAll',verifyTokenMiddleware, getAllProduct);
router.post('/product',verifyTokenMiddleware, createProduct);
router.put('/product/:id',verifyTokenMiddleware, updateProduct);


export default router;