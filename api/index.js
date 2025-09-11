import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';

app.use(cors());

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Servidor levantado en http://localhost:${port}`);
});