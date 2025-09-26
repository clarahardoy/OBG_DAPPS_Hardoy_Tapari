import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import { connectDB } from "./config/db.js";
import ROUTES from "./index.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { limiter } from "./utils/limiter.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.get('/', (req, res) => {
  res.json({ message: "Deploy Vercel" });
});

app.use('/v1', ROUTES);

//middleware 
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
