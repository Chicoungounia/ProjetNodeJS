import { Router } from "express";
import { deleteUser, login, register } from "../controllers/authControllers";
import { isAdmin } from "../middlewares/verifyRole";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/user/:id',isAdmin, deleteUser);

export default router;
