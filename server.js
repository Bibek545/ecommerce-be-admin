import dotenv from 'dotenv';
dotenv.config();
import express from 'express';




const app = express ()

const PORT = process.env.PORT || 8000;

import { dbConnect } from './src/config/dbConfig.js';

// db connection mongo
//middlewares
import cors from 'cors';
import morgan from 'morgan';
app.use(cors());
app.use(morgan("dev"));

//parse your json files
app.use(express.json());


//API endpoints
import router from './src/routes/userRoutes.js';
import { errorHandle } from './src/middleware/errorHandler.js';
import { responseClient } from './src/middleware/responseClient.js';
app.use("/api/v1/auth", router);



// simple server
app.get('/', (req, res) => {
    const message = "Server is late";
    responseClient({req,res ,message})
   
});

app.use(errorHandle);
app.use(responseClient);

dbConnect()
.then(()=> {
    app.listen(PORT, error => {
        error
        ? console.log(error)
        : console.log(`Server is running on http://localhost:${PORT}`)
    });
})
.catch((error)=> console.log(error));

//making a route from creating a user

// app.use("/api/v1/auth", router);

// //activateuser
// app.use("/api/v1/auth", router);

