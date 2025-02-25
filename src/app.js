import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';



dotenv.config()
const app = express();

const PORT = 8080

const connection = mongoose.connect("mongodb+srv://btofpach:3202coder@coder.wy2fs.mongodb.net/?retryWrites=true&w=majority&appName=coder")
.then(() => console.log("Conectado a base de datos MongoDb Atlas"))
.catch((error) => console.error("Error en conexcion :", error));

app.use(express.json());
app.use(cookieParser());
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);




app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
}
)
