import app from './v1/app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor levantado en http://localhost:${port}`);
});