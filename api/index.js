import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import { connectDB } from "./v1/config/db.js";
import ROUTES from "./v1/index.js";
import { notFoundMiddleware } from "./v1/middlewares/not-found.middleware.js";
import { errorMiddleware } from "./v1/middlewares/error.middleware.js";

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1', ROUTES);

//middleware 
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Servidor levantado en http://localhost:${port}`);
});
