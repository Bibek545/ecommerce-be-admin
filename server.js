import express from 'express';
import { dbConnect } from './src/config/dbConfig.js';
import dotenv from 'dotenv';

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