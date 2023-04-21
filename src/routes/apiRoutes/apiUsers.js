import { Router } from "express";
import UserManagerDAO from "../../dao/mongoManagers/UserManagerDAO.js";

const router = Router();


// OBTENER USUARIOS
router.get('/', UserManagerDAO.getUsers);


export default router;