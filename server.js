import express from 'express';
import { dbConnect } from './src/config/dbConfig.js';
import dotenv from 'dotenv';
import router from './src/routes/userRoutes.js';

const app = express ()

const PORT = 3000;

// db connection mongo
app.use(express.json());

dotenv.config();
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