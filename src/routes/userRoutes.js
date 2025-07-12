import express from "express";
import {addNewUserController, loginController, verifyEmailController} from "../controllers/authControllers.js"; 

const router = express.Router()

// creating a user

router.post('/register', addNewUserController);


// login user

router.post('/login', loginController);

export default router;


router.post("/verify-email", verifyEmailController)

