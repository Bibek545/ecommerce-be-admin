import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { dbConnect } from './src/config/dbConfig.js';

import router from './src/routes/userRoutes.js';
import cors from 'cors';
const app = express ()

const PORT = 8000;

// db connection mongo
app.use(cors());
app.use(express.json());


dbConnect();

// simple server
app.get('/', (req, res) => {
    res.send("The server is live and mongo is working")
    
});

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
});


//making a route from creating a user

app.use("/api/v1/auth", router);
