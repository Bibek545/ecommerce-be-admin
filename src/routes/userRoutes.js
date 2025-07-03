import express from "express";
import addNewUserController from "../controllers/authControllers.js";

const router = express.Router()

// creating a user

router.post('/register', addNewUserController);

export default router;