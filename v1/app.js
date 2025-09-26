import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import { connectDB } from "./config/db.js";
import ROUTES from "./index.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import rateLimit from 'express-rate-limit';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limit = rateLimit({
  windowMs:  60 * 1000, 
  max: 5, 
  message: "Demasiadas peticiones, espera 1 minuto para volver a intentarlo",
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      error: "Too many requests",
      limit: options.max,
      windowMs: options.windowMs,
      retryAfter: Math.ceil(options.windowMs / 1000) + ' seconds',
    });
  }
});

app.use(limit);

app.get('/', (req, res) => {
  res.json({ message: "Deploy Vercel" });
});

app.use('/v1', ROUTES);

//middleware 
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
